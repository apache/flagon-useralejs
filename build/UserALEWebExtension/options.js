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
// these are default values, which can be overridden by the user on the options page
var userAleHost = 'http://localhost:8000';
var userAleScript = 'userale-2.3.0.min.js';
var toolUser = 'nobody';
var toolName = 'test_app';
var toolVersion = '2.3.0';
/* eslint-enable */

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
var prefix = 'USERALE_';
var CONFIG_CHANGE = prefix + 'CONFIG_CHANGE';

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

if (chrome) {
  browser = chrome;
} // creates a Future for retrieval of the named keys
// the value specified is the default value if one doesn't exist in the storage


browser.storage.local.get({
  userAleHost: userAleHost,
  userAleScript: userAleScript,
  toolUser: toolUser,
  toolName: toolName,
  toolVersion: toolVersion
}, storeCallback);

function storeCallback(item) {
  document.getElementById("host").value = item.userAleHost;
  document.getElementById("clientScript").value = item.userAleScript;
  document.getElementById("toolUser").value = item.toolUser;
  document.getElementById("toolName").value = item.toolName;
  document.getElementById("toolVersion").value = item.toolVersion;
}

function saveOptions(e) {
  var updatedConfig = {
    userAleHost: document.getElementById("host").value,
    userAleScript: document.getElementById("clientScript").value,
    toolUser: document.getElementById("toolUser").value,
    toolName: document.getElementById("toolName").value,
    toolVersion: document.getElementById("toolVersion").value
  };
  browser.storage.local.set(updatedConfig);
  browser.runtime.sendMessage({
    type: CONFIG_CHANGE,
    payload: updatedConfig
  });
}

document.addEventListener("submit", function () {
  saveOptions();
});
/* eslint-enable */
