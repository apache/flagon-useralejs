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

import {default as logger} from './logger.js';
import {sender, sendEnd} from './sender.js';
import {currentLogCount} from './packager.js';

var config = {};
export var started = false;


function _init () {
  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var options = script ? (script.dataset || {}) : {};

  config.autostart = options.autostart || true;
  config.url = options.url || 'http://localhost:8000/logs';
  config.transmitInterval = options.interval || 5000;
  config.logCountThreshold = options.threshold || 5;
  config.userId = options.user || null;
  config.version = options.version || null;
  config.logDetails = options['log-details'] || false;
  config.resolution = options.resolution || 500;

  if (options['user-from-params'] === 'true') {
    var regex = /[?&]aleuser(=([^&#]*)|&|#|$)/;
    var results = window.location.href.match(regex);

    if (!results || !results[2]) {
      config.userId = null;
    } else {
      config.userId = decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }

  config.time = _timeStampScaler();
}


function _timeStampScaler () {
  var e = document.createEvent('CustomEvent');

  if (e.timeStamp && e.timeStamp > 0) {

    var delta = Date.now() - e.timeStamp;
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

// Initialize Userale
export function start () {
  if (!started) {
    setTimeout(function () {
      var state = document.readyState;
      if (state === 'interactive' || state === 'complete') {
        logger(config);
        sender(config);
        sendEnd(config);
        started = true;
        return true;
      } else {
        start();
      }
    }, 100);
  }
}


export function currentConfigs () {
  return config;
}

export function logCount () {
  return currentLogCount();
}

// Automatically initialize and start up Userale
(function () {
  _init();
  if (config.autostart) {
    start();
  }
})();
