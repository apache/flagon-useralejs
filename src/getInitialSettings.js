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

export function getInitialSettings() {
  var dataKeyAdapter = {
    interval: "transmitInterval",
    threshold: "logCountThreshold",
    user: "userId",
    tool: "toolName"
  };

  var settings = {
    url: null,
    autostart: true,
    transmitInterval: 5000,
    logCountThreshold: 5,
    userId: null,
    version: null,
    logDetails: false,
    resolution: 500,
    toolName: 500,
    userFromParams: null,
    time: timeStampScale(document.createEvent('CustomEvent')),
    eventPrefix: "userale"
  };

  var useraleTag = document.getElementById("userale-plugin");
  if (useraleTag) {
    var configurationData = useraleTag.dataset || {};
    for (var key in configurationData) {
      if (configurationData.hasOwnProperty(key)) {
        if (dataKeyAdapter.hasOwnProperty(key)) {
          settings[dataKeyAdapter[key]] = configurationData[key];
        }
        settings[key] = configurationData[key];
      }
    }
  }
  return settings;
}

export function timeStampScale(e) {
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
    tsScaler = function () {
      return Date.now();
    };
  }

  return tsScaler;
}
