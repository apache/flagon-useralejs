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

/* eslint-disable */
import * as MessageTypes from './messageTypes.js';
import * as userale from '../main.js'
import { rerouteLog, browser } from './globals.js';

userale.addCallbacks({rerouteLog});

// TODO: Warn users when setting credentials with unsecured connection.
const mitmWarning = "Setting credentials with http will expose you to a MITM attack. Are you sure you want to continue?";

function setConfig() {
  let config = {
    url: document.getElementById("url").value,
    userId: document.getElementById("user").value,
    toolName: document.getElementById("tool").value,
    toolVersion: document.getElementById("version").value
  };

  // Set a basic auth header if given credentials.
  const password = document.getElementById("password").value;
  if(config.userId && password) {
    config.authHeader = "Basic " + btoa(`${config.userId}:${password}`);
  }

  let payload = {
    useraleConfig: config,
    pluginConfig: {urlWhitelist: document.getElementById("filter").value}
  };

  browser.storage.local.set(payload, () => {
    userale.options(config);
    browser.runtime.sendMessage({ type: MessageTypes.CONFIG_CHANGE, payload });
  });
}

function getConfig() {
  browser.storage.local.get("useraleConfig", (res) => {
    let config = res.useraleConfig;
  
    userale.options(config);
    document.getElementById("url").value = config.url;
    document.getElementById("user").value = config.userId;
    document.getElementById("tool").value = config.toolName;
    document.getElementById("version").value = config.toolVersion;
  });
  browser.storage.local.get("pluginConfig", (res) => {
    document.getElementById("filter").value = res.pluginConfig.urlWhitelist;
  });
}

document.addEventListener("DOMContentLoaded", getConfig);
document.addEventListener("submit", setConfig);

/* eslint-enable */