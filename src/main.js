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

import {version as userAleVersion} from '../package.json';
import {getInitialSettings} from './getInitialSettings.js';
import {configure} from './configure.js';
import {attachHandlers} from './attachHandlers.js';
import {initPackager, packageCustomLog} from './packageLogs.js';
import {initSender} from './sendLogs.js';

const config = {};
const logs = [];
const startLoadTimestamp = Date.now()
let endLoadTimestamp
window.onload = function () {
    endLoadTimestamp = Date.now()
}

export let started = false;
export {defineCustomDetails as details} from './attachHandlers.js';
export {
    setLogMapper as map,
    setLogFilter as filter,
    packageLog as packageLog,
    packageCustomLog as packageCustomLog,
    getSelector as getSelector,
    buildPath as buildPath,
} from './packageLogs.js';


// Start up Userale
config.on = false;
config.useraleVersion = userAleVersion;

configure(config, getInitialSettings());
initPackager(logs, config);

if (config.autostart) {
    setup(config);
}

/**
 * Hooks the global event listener, and starts up the
 * logging interval.
 * @param  {Object} config Configuration settings for the logger
 */
function setup(config) {
    if (!started) {
        setTimeout(function () {
            const state = document.readyState;

            if (config.autostart && (state === 'interactive' || state === 'complete')) {
                attachHandlers(config);
                initSender(logs, config);
                started = config.on = true;
                packageCustomLog({
                    type: 'load',
                    logType: 'raw',
                    pageLoadTime: endLoadTimestamp - startLoadTimestamp
                    }, () => {},false)
            } else {
                setup(config);
            }
        }, 100);
    }
}


// Export the Userale API
export const version = userAleVersion;

/**
 * Used to start the logging process if the
 * autostart configuration option is set to false.
 */
export function start() {
    if (!started || config.autostart === false) {
        started = config.on = true;
        config.autostart = true;
    }
}

/**
 * Halts the logging process. Logs will no longer be sent.
 */
export function stop() {
    started = config.on = false;
    config.autostart = false;
}

/**
 * Updates the current configuration
 * object with the provided values.
 * @param  {Object} newConfig The configuration options to use.
 * @return {Object}           Returns the updated configuration.
 */
export function options(newConfig) {
    if (newConfig !== undefined) {
        configure(config, newConfig);
    }

    return config;
}

/**
 * Appends a log to the log queue.
 * @param  {Object} customLog The log to append.
 * @return {boolean}          Whether the operation succeeded.
 */
export function log(customLog) {
    if (customLog !== null && typeof customLog === 'object') {
        logs.push(customLog);
        return true;
    } else {
        return false;
    }
}
