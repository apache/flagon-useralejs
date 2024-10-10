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

import { version as userAleVersion } from "../package.json";
import { Configuration } from "@/configure";
import { attachHandlers } from "@/attachHandlers";
import { initPackager, packageCustomLog } from "@/packageLogs";
import { initSender, sendOnClose } from "@/sendLogs";

import type { Settings, Logging } from "@/types";

const config = Configuration.getInstance();
const logs: Array<Logging.Log> = [];

const startLoadTimestamp = Date.now();
let endLoadTimestamp: number;
window.onload = function() {
  endLoadTimestamp = Date.now();
};

export let started = false;
export let wsock: WebSocket;
export { defineCustomDetails as details } from "@/attachHandlers";
export { registerAuthCallback as registerAuthCallback } from "@/utils";
export {
  addCallbacks as addCallbacks,
  removeCallbacks as removeCallbacks,
  packageLog as packageLog,
  packageCustomLog as packageCustomLog,
  getSelector as getSelector,
  buildPath as buildPath,
} from "@/packageLogs";

config.update({
  useraleVersion: userAleVersion,
});
initPackager(logs, config);
getWebsocketsEnabled(config);
if (config.autostart) {
  setup(config);
}

/**
 * Hooks the global event listener, and starts up the
 * logging interval.
 * @param  {Configuration} config Configuration settings for the logger
 */
function setup(config: Configuration) {
  if (!started) {
    setTimeout(function() {
      const state = document.readyState;

      if (
        config.autostart &&
        (state === "interactive" || state === "complete")
      ) {
        attachHandlers(config);
        initSender(logs, config);
        started = config.on = true;
        packageCustomLog(
          {
            type: "load",
            details: { pageLoadTime: endLoadTimestamp - startLoadTimestamp },
          },
          () => ({}),
          false,
        );
      } else {
        setup(config);
      }
    }, 100);
  }
}

/**
 * Checks to see if the specified backend URL supporsts Websockets
 * and updates the config accordingly
 */
function getWebsocketsEnabled(config: Configuration) {
  wsock = new WebSocket(config.url.replace("http://", "ws://"));
  wsock.onerror = () => {
    console.log("no websockets detected");
  };
  wsock.onopen = () => {
    console.log("connection established with websockets");
    config.websocketsEnabled = true;
  };
  wsock.onclose = () => {
    sendOnClose(logs, config);
  };
}

// Export the Userale API
export const version = userAleVersion;

/**
 * Used to start the logging process if the
 * autostart configuration option is set to false.
 */
export function start(): void {
  if (!started || config.autostart === false) {
    started = config.on = true;
    config.update({ autostart: true });
  }
}

/**
 * Halts the logging process. Logs will no longer be sent.
 */
export function stop(): void {
  started = config.on = false;
  config.update({ autostart: false });
}

/**
 * Updates the current configuration
 * object with the provided values.
 * @param  {Partial<Settings.Config>} newConfig The configuration options to use.
 * @return {Settings.Config}           Returns the updated configuration.
 */
export function options(
  newConfig: Partial<Settings.Config> | undefined,
): Settings.Config {
  if (newConfig) {
    config.update(newConfig);
  }

  return config;
}

/**
 * Appends a log to the log queue.
 * @param  {Logging.CustomLog} customLog The log to append.
 * @return {boolean}          Whether the operation succeeded.
 */
export function log(customLog: Logging.CustomLog | undefined) {
  if (customLog) {
    logs.push(customLog);
    return true;
  } else {
    return false;
  }
}
