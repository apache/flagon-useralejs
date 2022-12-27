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

import { detect } from 'detect-browser';
const browser = detect();

export let logs;
let config;

// Interval Logging Globals
let intervalID;
let intervalType;
let intervalPath;
let intervalTimer;
let intervalCounter;
let intervalLog;

export let filterHandler = null;
export let mapHandler = null;

/**
 * Assigns a handler to filter logs out of the queue.
 * @param  {Function} callback The handler to invoke when logging.
 */
export function setLogFilter(callback) {
  filterHandler = callback;
}

/**
 * Assigns a handler to transform logs from their default structure.
 * @param  {Function} callback The handler to invoke when logging.
 */
export function setLogMapper(callback) {
  mapHandler = callback;
}


/**
 * Assigns the config and log container to be used by the logging functions.
 * @param  {Array} newLogs   Log container.
 * @param  {Object} newConfig Configuration to use while logging.
 */
export function initPackager(newLogs, newConfig) {
  logs = newLogs;
  config = newConfig;
  filterHandler = null;
  mapHandler = null;
  intervalID = null;
  intervalType = null;
  intervalPath = null;
  intervalTimer = null;
  intervalCounter = 0;
  intervalLog = null;
}

/**
 * Transforms the provided HTML event into a log and appends it to the log queue.
 * @param  {Object} e         The event to be logged.
 * @param  {Function} detailFcn The function to extract additional log parameters from the event.
 * @return {boolean}           Whether the event was logged.
 */
export function packageLog(e, detailFcn) {
  if (!config.on) {
    return false;
  }

  let details = null;
  if (detailFcn) {
    details = detailFcn(e);
  }

  const timeFields = extractTimeFields(
    (e.timeStamp && e.timeStamp > 0) ? config.time(e.timeStamp) : Date.now()
  );

  let log = {
    'target' : getSelector(e.target),
    'path' : buildPath(e),
    'pageUrl': window.location.href,
    'pageTitle': document.title,
    'pageReferrer': document.referrer,
    'browser': detectBrowser(),
    'clientTime' : timeFields.milli,
    'microTime' : timeFields.micro,
    'location' : getLocation(e),
    'scrnRes' : getSreenRes(),
    'type' : e.type,
    'logType': 'raw',
    'userAction' : true,
    'details' : details,
    'userId' : config.userId,
    'toolVersion' : config.version,
    'toolName' : config.toolName,
    'useraleVersion': config.useraleVersion,
    'sessionID': config.sessionID,
  };

  if ((typeof filterHandler === 'function') && !filterHandler(log)) {
    return false;
  }

  if (typeof mapHandler === 'function') {
    log = mapHandler(log, e);
  }

  logs.push(log);

  return true;
}

/**
 * Packages the provided customLog to include standard meta data and appends it to the log queue.
 * @param  {Object} customLog        The behavior to be logged.
 * @param  {Function} detailFcn     The function to extract additional log parameters from the event.
 * @param  {boolean} userAction     Indicates user behavior (true) or system behavior (false)
 * @return {boolean}           Whether the event was logged.
 */
export function packageCustomLog(customLog, detailFcn, userAction) {
    if (!config.on) {
        return false;
    }

    let details = null;
    if (detailFcn) {
        details = detailFcn();
    }

    const metaData = {
        'pageUrl': window.location.href,
        'pageTitle': document.title,
        'pageReferrer': document.referrer,
        'browser': detectBrowser(),
        'clientTime' : Date.now(),
        'scrnRes' : getSreenRes(),
        'logType': 'custom',
        'userAction' : userAction,
        'details' : details,
        'userId' : config.userId,
        'toolVersion' : config.version,
        'toolName' : config.toolName,
        'useraleVersion': config.useraleVersion,
        'sessionID': config.sessionID
    };

    let log = Object.assign(metaData, customLog);

    if ((typeof filterHandler === 'function') && !filterHandler(log)) {
        return false;
    }

    if (typeof mapHandler === 'function') {
        log = mapHandler(log);
    }

    logs.push(log);

    return true;
}

/**
 * Extract the millisecond and microsecond portions of a timestamp.
 * @param  {Number} timeStamp The timestamp to split into millisecond and microsecond fields.
 * @return {Object}           An object containing the millisecond
 *                            and microsecond portions of the timestamp.
 */
export function extractTimeFields(timeStamp) {
  return {
    milli: Math.floor(timeStamp),
    micro: Number((timeStamp % 1).toFixed(3)),
  };
}

/**
 * Track intervals and gather details about it.
 * @param {Object} e
 * @return boolean
 */
export function packageIntervalLog(e) {
    const target = getSelector(e.target);
    const path = buildPath(e);
    const type = e.type;
    const timestamp = Math.floor((e.timeStamp && e.timeStamp > 0) ? config.time(e.timeStamp) : Date.now());

    // Init - this should only happen once on initialization
    if (intervalID == null) {
        intervalID = target;
        intervalType = type;
        intervalPath = path;
        intervalTimer = timestamp;
        intervalCounter = 0;
    }

    if (intervalID !== target || intervalType !== type) {
        // When to create log? On transition end
        // @todo Possible for intervalLog to not be pushed in the event the interval never ends...

        intervalLog = {
            'target': intervalID,
            'path': intervalPath,
            'pageUrl': window.location.href,
            'pageTitle': document.title,
            'pageReferrer': document.referrer,
            'browser': detectBrowser(),
            'count': intervalCounter,
            'duration': timestamp - intervalTimer,  // microseconds
            'startTime': intervalTimer,
            'endTime': timestamp,
            'type': intervalType,
            'logType': 'interval',    
            'targetChange': intervalID !== target,
            'typeChange': intervalType !== type,
            'userAction': false,
            'userId': config.userId,
            'toolVersion': config.version,
            'toolName': config.toolName,
            'useraleVersion': config.useraleVersion,
            'sessionID': config.sessionID
        };

        if (typeof filterHandler === 'function' && !filterHandler(intervalLog)) {
          return false;
        }

        if (typeof mapHandler === 'function') {
          intervalLog = mapHandler(intervalLog, e);
        }

        logs.push(intervalLog);

        // Reset
        intervalID = target;
        intervalType = type;
        intervalPath = path;
        intervalTimer = timestamp;
        intervalCounter = 0;
    }

    // Interval is still occuring, just update counter
    if (intervalID == target && intervalType == type) {
        intervalCounter = intervalCounter + 1;
    }

    return true;
}

/**
 * Extracts coordinate information from the event
 * depending on a few browser quirks.
 * @param  {Object} e The event to extract coordinate information from.
 * @return {Object}   An object containing nullable x and y coordinates for the event.
 */
export function getLocation(e) {
  if (e.pageX != null) {
    return { 'x' : e.pageX, 'y' : e.pageY };
  } else if (e.clientX != null) {
    return { 'x' : document.documentElement.scrollLeft + e.clientX, 'y' : document.documentElement.scrollTop + e.clientY };
  } else {
    return { 'x' : null, 'y' : null };
  }
}

/**
 * Extracts innerWidth and innerHeight to provide estimates of screen resolution
 * @return {Object} An object containing the innerWidth and InnerHeight
 */
export function getSreenRes() {
    return { 'width': window.innerWidth, 'height': window.innerHeight};
}

/**
 * Builds a string CSS selector from the provided element
 * @param  {HTMLElement} ele The element from which the selector is built.
 * @return {string}     The CSS selector for the element, or Unknown if it can't be determined.
 */
export function getSelector(ele) {
  if (ele.localName) {
    return ele.localName + (ele.id ? ('#' + ele.id) : '') + (ele.className ? ('.' + ele.className) : '');
  } else if (ele.nodeName) {
    return ele.nodeName + (ele.id ? ('#' + ele.id) : '') + (ele.className ? ('.' + ele.className) : '');
  } else if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
    return "Window";
  } else {
    return "Unknown";
  }
}

/**
 * Builds an array of elements from the provided event target, to the root element.
 * @param  {Object} e Event from which the path should be built.
 * @return {HTMLElement[]}   Array of elements, starting at the event target, ending at the root element.
 */
export function buildPath(e) {
  let path = [];
  if (typeof e.composedPath == "function" && e.composedPath().length > 0) {
    path = e.composedPath();
  } else {
    let ele = e.target
    while(ele) {
      path.push(ele);
      ele = ele.parentElement;
    }
  }

  return selectorizePath(path);
}

/**
 * Builds a CSS selector path from the provided list of elements.
 * @param  {HTMLElement[]} path Array of HTMLElements from which the path should be built.
 * @return {string[]}      Array of string CSS selectors.
 */
export function selectorizePath(path) {
  let i = 0;
  let pathEle;
  const pathSelectors = [];
  while (pathEle = path[i]) {
    pathSelectors.push(getSelector(pathEle));
    ++i;
  }
  return pathSelectors;
}

export function detectBrowser() {
    return {
        'browser': browser ? browser.name : '',
        'version': browser ? browser.version : ''
    };
}