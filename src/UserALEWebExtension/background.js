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

/*
 eslint-disable
 */

import * as MessageTypes from './messageTypes.js';
import * as userale from '../main.js';
import { browser } from './globals.js';

// Initalize userale plugin options
const defaultConfig = {useraleConfig: {
  url: 'http://localhost:8000',
  userId: 'pluginUser',
  toolName: 'useralePlugin',
  version: userale.version,
}};

browser.storage.local.get(defaultConfig, (res) => {
  userale.options(res.useraleConfig);
});

function dispatchTabMessage(message) {
  browser.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      browser.tabs.sendMessage(tab.id, message);
    });
  });
}

browser.runtime.onMessage.addListener(function (message) {
  switch (message.type) {
    // Handles logs rerouted from content and option scripts 
    case MessageTypes.ADD_LOG:
      userale.log(message.payload);
      break;

    case MessageTypes.CONFIG_CHANGE:
      userale.options(message.payload)
      dispatchTabMessage(message);
      break;

    case MessageTypes.AUTH_CHANGE:
      userale.options({authHeader: message.payload});
      break;

    default:
      console.log('got unknown message type ', message);
  }
});

// Helper functions for logging tab events
function packageTabLog(tabId, data, type) {
  browser.tabs.get(tabId, (tab) => {
    packageDetailedTabLog(tab, data, type);
  });
}

function packageDetailedTabLog(tab, data, type) {
  Object.assign(data, {'tabEvent': type});
  userale.packageCustomLog(data, ()=>{return tab}, true);
}

// Attach Handlers for tab events
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs
browser.tabs.onActivated.addListener((activeInfo) => {
  packageTabLog(activeInfo.tabId, activeInfo, "tabs.onActivated");
});

browser.tabs.onAttached.addListener((tabId, attachInfo) => {
  packageTabLog(tabId, attachInfo, "tabs.onAttached");
});

browser.tabs.onCreated.addListener((tab) => {
  packageDetailedTabLog(tab, {}, "tabs.onCreated");
});

browser.tabs.onDetached.addListener((tabId, detachInfo) => {
  packageTabLog(tabId, detachInfo, "tabs.onDetached");
});

browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  packageTabLog(tabId, moveInfo, "tabs.onMoved");
});

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  packageDetailedTabLog({id: tabId}, removeInfo, "tabs.onRemoved");
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  packageDetailedTabLog(tab, changeInfo, "tabs.onUpdated");
});

browser.tabs.onZoomChange.addListener((ZoomChangeInfo) => {
  packageTabLog(ZoomChangeInfo.tabId, ZoomChangeInfo, "tabs.onZoomChange");
});

/*
 eslint-enable
 */