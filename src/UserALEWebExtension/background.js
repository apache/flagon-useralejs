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
const defaultConfig = {
  useraleConfig: {
    url: 'http://localhost:8000',
    userId: 'pluginUser',
    authHeader: null,
    toolName: 'useralePlugin',
    version: userale.version,
  },
  pluginConfig: {
    // Default to a regex that will match no string
    urlWhitelist: '(?!x)x'
  }
};

var urlWhitelist;

function updateConfig(config) {
  urlWhitelist = new RegExp(config.pluginConfig.urlWhitelist);
  userale.options(config.useraleConfig);
  dispatchTabMessage(config.useraleConfig);
}

function dispatchTabMessage(message) {
  browser.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      browser.tabs.sendMessage(tab.id, message);
    });
  });
}

function filterUrl(log) {
  if(urlWhitelist.test(log.pageUrl)) {
    return log
  }
  return false;
}

browser.storage.local.get(defaultConfig, (res) => {
  userale.addCallbacks({filterUrl:filterUrl});
  updateConfig(res);
});

function filterUrl(log) {
  if(urlWhitelist.test(log.pageUrl)) {
    return log
  }
  return false;
}

browser.storage.local.get(defaultConfig, (res) => {
  userale.addCallbacks({filterUrl:filterUrl});
  updateConfig(res);
});

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    // Handles logs rerouted from content and option scripts 
    case MessageTypes.ADD_LOG:
      let log = message.payload;
      if("tab" in sender && "id" in sender.tab) {
        log["tabId"] = sender.tab.id;
      }
      log = filterUrl(log);
      if(log) {
        userale.log(log);
      }
      break;

    case MessageTypes.CONFIG_CHANGE:
      updateConfig(message.payload);
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