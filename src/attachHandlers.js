/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { packageLog } from './packageLogs.js';
import { packageIntervalLog } from './packageLogs';

var events;
var bufferBools;
var bufferedEvents;
//@todo: Investigate drag events and their behavior
var intervalEvents = ['click', 'focus', 'blur', 'input', 'change', 'mouseover', 'submit'];
var windowEvents = ['load', 'blur', 'focus'];

/**
 * Maps an event to an object containing useful information.
 * @param  {Object} e Event to extract data from
 */
function extractMouseEvent(e) {
  return {
    'clicks' : e.detail,
    'ctrl' : e.ctrlKey,
    'alt' : e.altKey,
    'shift' : e.shiftKey,
    'meta' : e.metaKey
  };
}

/**
 * Defines the way information is extracted from various events.
 * Also defines which events we will listen to.
 * @param  {Object} config Configuration object to read from.
 */
export function defineDetails(config) {
  // Events list
  // Keys are event types
  // Values are functions that return details object if applicable
  events = {
    'click' : extractMouseEvent,
    'dblclick' : extractMouseEvent,
    'mousedown' : extractMouseEvent,
    'mouseup' : extractMouseEvent,
    'focus' : null,
    'blur' : null,
    'input' : config.logDetails ? function(e) { return { 'value' : e.target.value }; } : null,
    'change' : config.logDetails ? function(e) { return { 'value' : e.target.value }; } : null,
    'dragstart' : null,
    'dragend' : null,
    'drag' : null,
    'drop' : null,
    'keydown' : config.logDetails ? function(e) { return { 'key' : e.keyCode, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; } : null,
    'mouseover' : null,
    'submit' : null
  };

  bufferBools = {};
  bufferedEvents = {
    'wheel' : function(e) { return { 'x' : e.deltaX, 'y' : e.deltaY, 'z' : e.deltaZ }; },
    'scroll' : function() { return { 'x' : window.scrollX, 'y' : window.scrollY }; },
    'resize' : function() { return { 'width' : window.outerWidth, 'height' : window.outerHeight }; }
  };
}

/**
 * Hooks the event handlers for each event type of interest.
 * @param  {Object} config Configuration object to use.
 * @return {boolean}        Whether the operation succeeded
 */
export function attachHandlers(config) {
  defineDetails(config);

  Object.keys(events).forEach(function(ev) {
    document.addEventListener(ev, function(e) {
      packageLog(e, events[ev]);
    }, true);
  });

  intervalEvents.forEach(function(ev) {
    document.addEventListener(ev, function(e) {
        packageIntervalLog(e);
    }, true);
  });

  Object.keys(bufferedEvents).forEach(function(ev) {
    bufferBools[ev] = true;

    window.addEventListener(ev, function(e) {
      if (bufferBools[ev]) {
        bufferBools[ev] = false;
        packageLog(e, bufferedEvents[ev]);
        setTimeout(function() { bufferBools[ev] = true; }, config.resolution);
      }
    }, true);
  });

  windowEvents.forEach(function(ev) {
    window.addEventListener(ev, function(e) {
      packageLog(e, function() { return { 'window' : true }; });
    }, true);
  });

  return true;
}
