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
import * as globals from './globals.js';
import * as MessageTypes from './messageTypes.js';

if (chrome) {
  browser = chrome;
}

// creates a Future for retrieval of the named keys
// the value specified is the default value if one doesn't exist in the storage
let store = browser.storage.local.get({
  userAleHost: globals.userAleHost,
  userAleScript: globals.userAleScript,
  toolUser: globals.toolUser,
  toolName: globals.toolName,
  toolVersion: globals.toolVersion,
}, storeCallback);

function storeCallback(item) {
  document.getElementById("host").value = item.userAleHost;
  document.getElementById("clientScript").value = item.userAleScript;
  document.getElementById("toolUser").value = item.toolUser;
  document.getElementById("toolName").value = item.toolName;
  document.getElementById("toolVersion").value = item.toolVersion;
}

function onError(error) {
  console.log(error);
}

function saveOptions(e) {
  const updatedConfig = {
    userAleHost: document.getElementById("host").value,
    userAleScript: document.getElementById("clientScript").value,
    toolUser: document.getElementById("toolUser").value,
    toolName: document.getElementById("toolName").value,
    toolVersion: document.getElementById("toolVersion").value,
  };

  browser.storage.local.set(updatedConfig);

  browser.runtime.sendMessage({ type: MessageTypes.CONFIG_CHANGE, payload: updatedConfig });
}

document.addEventListener("submit", function() {
  saveOptions();
});

/* eslint-enable */
