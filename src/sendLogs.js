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

import { updateAuthHeader } from "./utils";
import { updateCustomHeaders } from "./utils/headers";

let sendIntervalId = null;

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
  return setInterval(function () {
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
 * Attempts to flush the remaining logs when the window is closed.
 * @param  {Array} logs   Array of logs to be flushed.
 * @param  {Object} config Configuration object to be read from.
 */
export function sendOnClose(logs, config) {
  window.addEventListener("pagehide", function () {
    if (config.on && logs.length > 0) {
      let header_options = config.authHeader
        ? {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: config.authHeader,
          }
        : { "content-type": "application/json;charset=UTF-8" };

      fetch(config.url, {
        keepalive: true,
        method: "POST",
        headers: header_options,
        body: JSON.stringify(logs),
      });

      logs.splice(0); // clear log queue
    }
  });
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
  const req = new XMLHttpRequest();
  const data = JSON.stringify(logs);

  req.open("POST", config.url);

  // Update headers
  updateAuthHeader(config);
  if (config.authHeader) {
    req.setRequestHeader("Authorization", config.authHeader);
  }
  req.setRequestHeader("Content-type", "application/json;charset=UTF-8");

  // Update custom headers last to allow them to over-write the defaults. This assumes
  // the user knows what they are doing and may want to over-write the defaults.
  updateCustomHeaders(config);
  if (config.headers) {
    Object.entries(config.headers).forEach(([header, value]) => {
      req.setRequestHeader(header, value);
    });
  }

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status !== 200) {
      if (retries > 0) {
        sendLogs(logs, config, retries--);
      }
    }
  };

  req.send(data);
}
