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

import * as globals from './globals';
import * as MessageTypes from './messageTypes.js';
import { timeStampScale } from '../getInitialSettings.js';
import { extractTimeFields, initPackager, packageLog } from '../packageLogs.js';
import { initSender } from '../sendLogs.js';

// inherent dependency on globals.js, loaded by the webext

// browser is defined in firefox, but not in chrome. In chrome, they use
// the 'chrome' global instead. Let's map it to browser so we don't have
// to have if-conditions all over the place.

var browser = browser || chrome;
var logs = [];
var config = {
  autostart: true,
  url: 'http://localhost:8000',
  transmitInterval: 5000,
  logCountThreshold: 5,
  userId: null,
  version: null,
  resolution: 500,
  time: timeStampScale({}),
  on: true,
  sendProtocol: 'fetch'
};
var sessionId = 'session_' + Date.now();

var getTimestamp = ((typeof performance !== 'undefined') && (typeof performance.now !== 'undefined'))
  ? function () { return performance.now() + performance.timeOrigin; }
  : Date.now;

browser.storage.local.set({ sessionId: sessionId });

var store = browser.storage.local.get({
  userAleHost: globals.userAleHost,
  userAleScript: globals.userAleScript,
  toolUser: globals.toolUser,
  toolName: globals.toolName,
  toolVersion: globals.toolVersion,
}, storeCallback);
        
function storeCallback(item) {
  config = Object.assign({}, config, {
    url: item.userAleHost,
    userId: item.toolUser,
    sessionID: sessionId,
    toolName: item.toolName,
    toolVersion: item.toolVersion
  });

  initPackager(logs, config);
  initSender(logs, config);
}

function dispatchTabMessage(message) {
  browser.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      browser.tabs.sendMessage(tab.id, message);
    });
  });
}

function packageBrowserLog(type, logDetail) {
  var timeFields = extractTimeFields(getTimestamp());

  logs.push({
    'target' : null,
    'path' : null,
    'clientTime' : timeFields.milli,
    'microTime' : timeFields.micro,
    'location' : null,
    'type' : 'browser.' + type,
    'logType': 'raw',
    'userAction' : true,
    'details' : logDetail,
    'userId' : globals.toolUser,
    'toolVersion': null,
    'toolName': null,
    'useraleVersion': null,
    'sessionID': sessionId,
  });
}

browser.runtime.onMessage.addListener(function (message) {
  switch (message.type) {
    case MessageTypes.CONFIG_CHANGE:
      (function () {
        var updatedConfig = Object.assign({}, config, {
          url: message.payload.userAleHost,
          userId: message.payload.toolUser,
          toolName: message.payload.toolName,
          toolVersion: message.payload.toolVersion
        });
        initPackager(logs, updatedConfig);
        initSender(logs, updatedConfig);
        dispatchTabMessage(message);
      })();
      break;

    case MessageTypes.ADD_LOG:
      (function () {
        logs.push(message.payload);
      })();
      break;

    default:
      console.log('got unknown message type ', message);
  }
});

function getTabDetailById(tabId, onReady) {
  browser.tabs.get(tabId, function (tab) {
    onReady({
      active: tab.active,
      audible: tab.audible,
      incognito: tab.incognito,
      index: tab.index,
      muted: tab.mutedInfo ? tab.mutedInfo.muted : null,
      pinned: tab.pinned,
      selected: tab.selected,
      tabId: tab.id,
      title: tab.title,
      url: tab.url,
      windowId: tab.windowId,
    });
  });
}

browser.tabs.onActivated.addListener(function (e) {
  getTabDetailById(e.tabId, function (detail) {
    packageBrowserLog('tabs.onActivated', detail);
  });
});

browser.tabs.onCreated.addListener(function (tab, e) {
  packageBrowserLog('tabs.onCreated', {
    active: tab.active,
    audible: tab.audible,
    incognito: tab.incognito,
    index: tab.index,
    muted: tab.mutedInfo ? tab.mutedInfo.muted : null,
    pinned: tab.pinned,
    selected: tab.selected,
    tabId: tab.id,
    title: tab.title,
    url: tab.url,
    windowId: tab.windowId,
  });
});

browser.tabs.onDetached.addListener(function (tabId) {
  getTabDetailById(tabId, function (detail) {
    packageBrowserLog('tabs.onDetached', detail);
  });
});

browser.tabs.onMoved.addListener(function (tabId) {
  getTabDetailById(tabId, function (detail) {
    packageBrowserLog('tabs.onMoved', detail);
  });
});

browser.tabs.onRemoved.addListener(function (tabId) {
  packageBrowserLog('tabs.onRemoved', { tabId: tabId });
});

browser.tabs.onZoomChange.addListener(function (e) {
  getTabDetailById(e.tabId, function (detail) {
    packageBrowserLog('tabs.onZoomChange', Object.assign({}, {
      oldZoomFactor: e.oldZoomFactor,
      newZoomFactor: e.newZoomFactor,
    }, detail));
  });
});

/*
 eslint-enable
 */