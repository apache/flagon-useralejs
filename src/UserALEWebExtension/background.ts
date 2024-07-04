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

import * as MessageTypes from "@/UserALEWebExtension/messageTypes";
import * as userale from "@/main";
import { browser, configKey } from "@/UserALEWebExtension/globals";
import { Extension, Logging } from "@/types";

// Initalize userale plugin options
const defaultConfig: Extension.ConfigPayload = {
  useraleConfig: {
    url: "http://localhost:8000",
    userId: "pluginUser",
    authHeader: null,
    toolName: "useralePlugin",
    toolVersion: userale.version,
  },
  pluginConfig: {
    // Default to a regex that will match no string
    urlWhitelist: "(?!x)x",
  },
};

let urlWhitelist: RegExp;
const tabToHttpSession: { [id: string]: any } = {};
let browserSessionId: string | null = null;

/**
 * Add log to UserALE buffer for sending to backend
 * @param {any} message The message to send
 * @return {void}
 */
function addLog(message: any) {
  let log = message.payload;
  log.browserSessionId = browserSessionId;
  // Apply url filter to logs generated outside the background page.
  log = filterUrl(log);
  if (log) {
    userale.log(log);
  }
}

/**
 * add tab id to http session id mapping
 * @param {any} message The message to send
 * @param {browser.runtime.MessageSender} sender The sender of the message
 * @return {void}
 */
function updateTabToHttpSessionMapping(
  message: any,
  sender: browser.runtime.MessageSender,
) {
  if (sender.tab?.id) {
    tabToHttpSession[sender.tab.id] = message.payload;
  }
}
/**
 * Apply the extension config to both the background and content instances of userale
 * @param {Extension.ConfigPayload} config The extension config to apply
 * @return {void}
 */
function updateConfig(payload: Extension.ConfigPayload) {
  urlWhitelist = new RegExp(payload.pluginConfig.urlWhitelist);
  userale.options(payload.useraleConfig);
  browser.storage.local.set({ [configKey]: payload });
  dispatchTabMessage({
    type: MessageTypes.CONFIG_CHANGE,
    payload: payload.useraleConfig,
  });
}

/**
 * Send a message to all tabs
 * @param {any} message The message to send
 * @return {void}
 */
function dispatchTabMessage(message: any) {
  // @ts-expect-error Typescript is not aware that firefox's broswer is overloaded
  // to support chromium style MV2 callbacks
  browser.tabs.query({}, function (tabs: browser.tabs.Tab[]) {
    tabs.forEach(function (tab) {
      if (!tab.id) return;
      browser.tabs.sendMessage(tab.id, message);
    });
  });
}

/**
 * Callback for filtering out logs with urls that do not match the regex defined in extension options.
 * @param {Logging.Log} log The candidate log
 * @return {Object} The transformed log
 */
function filterUrl(log: Logging.Log) {
  if (urlWhitelist.test(log.pageUrl as string)) {
    return log;
  }
  return false;
}

/**
 * Callback for setting the session id's of tab logs to that of the target tab
 * @param {Logging.Log} log The candidate log
 * @return {Object} The transformed log
 */
function injectSessions(log: Logging.Log) {
  const id = (log.details as Logging.JSONObject)?.id as string | undefined;
  if (id && id in tabToHttpSession) {
    log.httpSessionId = tabToHttpSession[id];
  } else {
    log.httpSessionId = null;
  }
  log.browserSessionId = browserSessionId;
  return log;
}
// @ts-expect-error Typescript is not aware that firefox's broswer is overloaded
// to support chromium style MV2 callbacks
browser.storage.local.get([configKey], (res) => {
  if (res[configKey]) {
    updateConfig(res[configKey]);
  } else {
    updateConfig(defaultConfig);
  }

  // Apply url filter to logs generated by the background page.
  userale.addCallbacks({ filterUrl, injectSessions });
  const userAleHttpSessionId = window.sessionStorage.getItem(
    "userAleHttpSessionId",
  );
  browserSessionId = userAleHttpSessionId
    ? JSON.parse(userAleHttpSessionId)
    : null;
});

browser.runtime.onMessage.addListener(function (message, sender) {
  switch (message.type) {
    case MessageTypes.ADD_LOG:
      addLog(message);
      break;

    case MessageTypes.HTTP_SESSION:
      updateTabToHttpSessionMapping(message, sender);
      break;

    case MessageTypes.CONFIG_CHANGE:
      updateConfig(message.payload);
      break;

    default:
      console.log("got unknown message type ", message);
  }
});

/**
 * Extract tab details then log a tab event
 * @param {integer} tabId The id of the target tab
 * @param {Logging.CustomLog} data The data of the tab event
 * @param {String} type The type of tab event
 * @return {undefined}
 */
function packageTabLog(tabId: number, data: Logging.CustomLog, type: string) {
  // @ts-expect-error Typescript is not aware that firefox's broswer is overloaded
  // to support chromium style MV2 callbacks
  browser.tabs.get(tabId, (tab) => {
    packageDetailedTabLog(tab, data, type);
  });
}

/**
 * Log a tab event with tab details
 * @param {browser.tabs.Tab} tab The target tab object
 * @param {Logging.CustomLog} data The data of the tab event
 * @param {String} type The type of tab event
 * @return {undefined}
 */
function packageDetailedTabLog(
  tab: Partial<browser.tabs.Tab>,
  data: Logging.CustomLog,
  type: string,
) {
  Object.assign(data, { type });
  // Two fields in the Tab interface do not match our serializable JSONObject interface
  // remove them before create custom log
  const { mutedInfo, sharingState, ...restOfTab } = tab;
  const payload: Logging.JSONObject = { ...restOfTab };

  userale.packageCustomLog(
    data,
    () => {
      return payload;
    },
    true,
  );
}

// Attach Handlers for tab events
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs
browser.tabs.onActivated.addListener((activeInfo) => {
  // Adds needed string indexing signature to payload that to
  // make it conform to the JSONObject interface
  const payload: Logging.CustomLog = { ...activeInfo };
  packageTabLog(activeInfo.tabId, payload, "tabs.onActivated");
});

browser.tabs.onAttached.addListener((tabId, attachInfo) => {
  const payload: Logging.CustomLog = { ...attachInfo };
  packageTabLog(tabId, payload, "tabs.onAttached");
});

browser.tabs.onCreated.addListener((tab) => {
  packageDetailedTabLog(tab, {}, "tabs.onCreated");
});

browser.tabs.onDetached.addListener((tabId, detachInfo) => {
  const payload: Logging.CustomLog = { ...detachInfo };
  packageTabLog(tabId, payload, "tabs.onDetached");
});

browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  const payload: Logging.CustomLog = { ...moveInfo };
  packageTabLog(tabId, payload, "tabs.onMoved");
});

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  const payload: Logging.CustomLog = { ...removeInfo };
  packageDetailedTabLog({ id: tabId }, payload, "tabs.onRemoved");
});

browser.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  const { mutedInfo, sharingState, ...restOfTab } = changeInfo;
  const payload: Logging.JSONObject = { ...restOfTab };
  packageDetailedTabLog(tab, payload, "tabs.onUpdated");
});

browser.tabs.onZoomChange.addListener((ZoomChangeInfo) => {
  const { zoomSettings, ...restOfTab } = ZoomChangeInfo;
  const payload: Logging.CustomLog = { ...restOfTab };
  packageTabLog(ZoomChangeInfo.tabId, payload, "tabs.onZoomChange");
});
