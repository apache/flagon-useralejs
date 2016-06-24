// Copyright 2016 The Charles Stark Draper Laboratory
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {packager, setConfigs} from './packager.js';


export default function logger (config) {

  setConfigs(config);

  // Events list
  // Keys are event types
  // Values are functions that return details object if applicable
  var events = {
    'click' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
    'dblclick' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
    'mousedown' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
    'mouseup' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
    'focus' : null,
    'blur' : null,
    'input' : config.logDetails ? function (e) { return { 'value' : e.target.value }; } : null,
    'change' : config.logDetails ? function (e) { return { 'value' : e.target.value }; } : null,
    'dragstart' : null,
    'dragend' : null,
    'drag' : null,
    'drop' : null,
    'keydown' : config.logDetails ? function (e) { return { 'key' : e.keyCode, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; } : null,
    'mouseover' : null,
    'submit' : null
  };

  Object.keys(events).forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      packager(e, events[ev]);
    }, true);
  });

  var bufferedEvents = {
    'wheel' : function (e) { return { 'x' : e.deltaX, 'y' : e.deltaY, 'z' : e.deltaZ }; },
    'scroll' : function () { return { 'x' : window.scrollX, 'y' : window.scrollY }; },
    'resize' : function () { return { 'width' : window.outerWidth, 'height' : window.outerHeight }; }
  };

  var bufferBools = {};
  Object.keys(bufferedEvents).forEach(function (ev) {
    bufferBools[ev] = true;

    window.addEventListener(ev, function (e) {
      if (bufferBools[ev]) {
        bufferBools[ev] = false;
        packager(e, bufferedEvents[ev]);
        setTimeout(function () { bufferBools[ev] = true; }, config.resolution);
      }
    }, true);
  });

  var windowEvents = ['load', 'blur', 'focus'];
  var windowEvent = function (e) { packager(e, function () { return { 'window' : true }; }); }

  windowEvents.forEach(function (ev) {
    window.addEventListener(ev, windowEvent, true);
  });

  return true;
}
