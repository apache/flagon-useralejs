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

var sendIntervalId = null;

/**
 * Initializes the log queue processors.
 * @param  {Array} logs   Array of logs to append to.
 * @param  {Object} config Configuration object to use when logging.
 */
export function initSender(logs, config) {
  if (sendIntervalId !== null) {
    clearInterval(sendIntervalId);
  }

  sendIntervalId = sendOnInterval(logs, config);
  sendOnClose(logs, config);
}

/**
 * Checks the provided log array on an interval, flushing the logs
 * if the queue has reached the threshold specified by the provided config.
 * @param  {Array} logs   Array of logs to read from.
 * @param  {Object} config Configuration object to be read from.
 * @return {Number}        The newly created interval id.
 */
export function sendOnInterval(logs, config) {
  return setInterval(function() {
    if (!config.on) {
      return;
    }

    if (logs.length >= config.logCountThreshold) {
      sendLogs(logs.slice(0), config, 0); // Send a copy
      logs.splice(0); // Clear array reference (no reassignment)
    }
  }, config.transmitInterval);
}

/**
 * Provides a simplified send function that can be called before events that would
 * refresh page can resolve so that log queue ('logs) can be shipped immediately. This
 * is different than sendOnClose because browser security practices prevent you from
 * listening the process responsible for window navigation actions, in action (e.g., refresh;
 * you can only detect, after the fact, the process responsible for the current window state.
 * @param  {Array} logs   Array of logs to read from.
 * @param  {Object} config Configuration object to be read from.
 */
export function sendOnRefresh(logs, config) {
  if (!config.on) {
    return;
  }
  if (logs.length > 0) {
    sendLogs(logs, config, 1);
  }
}

/**
 * Attempts to flush the remaining logs when the window is closed.
 * @param  {Array} logs   Array of logs to be flushed.
 * @param  {Object} config Configuration object to be read from.
 */
export function sendOnClose(logs, config) {
/** if (!config.on) {
    return;
 } */
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && logs.length > 0) {
      navigator.sendBeacon(config.url, JSON.stringify(logs));
    }
  });
/**
    if (navigator.sendBeacon) {
    window.addEventListener('unload', function() {
      ;
  } else {
    window.addEventListener('beforeunload', function() {
      if (logs.length > 0) {
        sendLogs(logs, config, 1);
      }
    })
  }
*/
}

/**
 * Sends the provided array of logs to the specified url,
 * retrying the request up to the specified number of retries.
 * @param  {Array} logs    Array of logs to send.
 * @param  {string} config     configuration parameters (e.g., to extract URL from & send the POST request to).
 * @param  {Number} retries Maximum number of attempts to send the logs.
 */

// @todo expose config object to sendLogs replate url with config.url
export function sendLogs(logs, config, retries) {
  var req = new XMLHttpRequest();

  // @todo setRequestHeader for Auth
  var data = JSON.stringify(logs);

  req.open('POST', config.url);
  if (config.authHeader) {
    req.setRequestHeader('Authorization', config.authHeader)
  }

  req.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status !== 200) {
      if (retries > 0) {
        sendLogs(logs, config, retries--);
      }
    }
  };

  req.send(data);
}
