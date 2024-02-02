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

userale.addCallbacks({reroute: rerouteLog});

function setConfig(e) {
  browser.storage.local.set(
    {useraleConfig: {
      url: document.getElementById("url").value,
      userId: document.getElementById("user").value,
      toolName: document.getElementById("tool").value,
      version: document.getElementById("version").value
    }},
    () => {getConfig()}
  );
}

function getConfig() {
  browser.storage.local.get("useraleConfig", (res) => {
    let config = res.useraleConfig;
  
    document.getElementById("url").value = config.url;
    document.getElementById("user").value = config.userId;
    document.getElementById("tool").value = config.toolName;
    document.getElementById("version").value = config.version;

    userale.options(config);
    browser.runtime.sendMessage({ type: MessageTypes.CONFIG_CHANGE, payload: config });

  });
}

document.addEventListener('DOMContentLoaded', getConfig);
document.addEventListener("submit", setConfig);

/* eslint-enable */