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

/**
 * Extracts the initial configuration settings from the
 * currently executing script tag.
 * @return {Object} The extracted configuration object
 */
export function getInitialSettings() {
  var settings = {};

  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var get = script ? script.getAttribute.bind(script) : function() { return null; };

  settings.autostart = get('data-autostart') === 'false' ? false : true;
  settings.url = get('data-url') || 'http://localhost:8000';
  settings.transmitInterval = +get('data-interval') || 5000;
  settings.logCountThreshold = +get('data-threshold') || 5;
  settings.userId = get('data-user') || null;
  settings.version = get('data-version') || null;
  settings.logDetails = get('data-log-details') === 'true' ? true : false;
  settings.resolution = +get('data-resolution') || 500;
  settings.toolName = get('data-tool') || null;
  settings.userFromParams = get('data-user-from-params') || null;
  settings.time = timeStampScale(document.createEvent('CustomEvent'));
  settings.sessionID = get('data-session') || 'session_' + String(Date.now());

  return settings;
}

/**
 * Creates a function to normalize the timestamp of the provided event.
 * @param  {Object} e An event containing a timeStamp property.
 * @return {timeStampScale~tsScaler}   The timestamp normalizing function.
 */
export function timeStampScale(e) {
  if (e.timeStamp && e.timeStamp > 0) {
    var delta = Date.now() - e.timeStamp;
    /**
     * Returns a timestamp depending on various browser quirks.
     * @param  {?Number} ts A timestamp to use for normalization.
     * @return {Number} A normalized timestamp.
     */
    var tsScaler;

    if (delta < 0) {
      tsScaler = function () {
        return e.timeStamp / 1000;
      };
    } else if (delta > e.timeStamp) {
      var navStart = performance.timing.navigationStart;
      tsScaler = function (ts) {
        return ts + navStart;
      }
    } else {
      tsScaler = function (ts) {
        return ts;
      }
    }
  } else {
    tsScaler = function () { return Date.now(); };
  }

  return tsScaler;
}
