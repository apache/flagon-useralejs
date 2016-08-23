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

import { version as userAleVersion } from '../package.json';
import { getInitialSettings } from './getInitialSettings.js';
import { configure } from './configure.js';
import { attachHandlers } from './attachHandlers.js';
import { initPackager } from './packageLogs.js';
import { initSender } from './sendLogs.js';

var config = {};
var logs = [];
export var started = false;


// Start up Userale
config.on = false;
config.useraleVersion = userAleVersion;

configure(config, getInitialSettings());
initPackager(logs, config);

if (config.autostart) {
  setup(config);
}

function setup(config) {
  if (!started) {
    setTimeout(function() {
      var state = document.readyState;

      if (state === 'interactive' || state === 'complete') {
        attachHandlers(config);
        initSender(logs, config);
        started = config.on = true;
      } else {
        setup(config);
      }
    }, 100);
  }
}


// Export the Userale API
export var version = userAleVersion;

export function start() {
  if (!started) {
    setup(config);
  }

  config.on = true;
}

export function stop() {
  config.on = false;
}

export function options(newConfig) {
  if (newConfig !== undefined) {
    configure(config, newConfig);
  }

  return config;
}

export function log(customLog) {
  if (typeof customLog === 'object') {
    logs.push(customLog);
    return true;
  } else {
    return false;
  }
}
