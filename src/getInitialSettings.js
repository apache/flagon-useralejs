/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the 'License'); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let sessionId = null;

/**
 * Extracts the initial configuration settings from the
 * currently executing script tag.
 * @return {Object} The extracted configuration object
 */
export function getInitialSettings() {
    const settings = {};

    if (sessionId === null) {
        sessionId = getSessionId('userAleSessionId', 'session_' + String(Date.now()));
    }

    const script = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    const get = script ? script.getAttribute.bind(script) : function () {
        return null;
    };
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
    settings.sessionID = get('data-session') || sessionId;
    settings.authHeader = get('data-auth') || null;
    settings.custIndex = get('data-index') || null;
    settings.sendProtocol = get('data-protocol') === 'fetch' ? false : 'XMLHttpRequest';
    return settings;
}

/**
 * defines sessionId, stores it in sessionStorage, checks to see if there is a sessionId in
 * storage when script is started. This prevents events like 'submit', which refresh page data
 * from refreshing the current user session
 *
 */
export function getSessionId(sessionKey, value) {
    if (window.sessionStorage.getItem(sessionKey) === null) {
        window.sessionStorage.setItem(sessionKey, JSON.stringify(value));
        return value;
    }

    return JSON.parse(window.sessionStorage.getItem(sessionKey));
}


/**
 * Creates a function to normalize the timestamp of the provided event.
 * @param  {Object} e An event containing a timeStamp property.
 * @return {timeStampScale~tsScaler}   The timestamp normalizing function.
 */
export function timeStampScale(e) {
    let tsScaler;
    if (e.timeStamp && e.timeStamp > 0) {
        const delta = Date.now() - e.timeStamp;
        /**
         * Returns a timestamp depending on various browser quirks.
         * @param  {?Number} ts A timestamp to use for normalization.
         * @return {Number} A normalized timestamp.
         */

        if (delta < 0) {
            tsScaler = function () {
                return e.timeStamp / 1000;
            };
        } else if (delta > e.timeStamp) {
            const navStart = performance.timing.navigationStart;
            tsScaler = function (ts) {
                return ts + navStart;
            }
        } else {
            tsScaler = function (ts) {
                return ts;
            }
        }
    } else {
        tsScaler = function () {
            return Date.now();
        };
    }

    return tsScaler;
}
