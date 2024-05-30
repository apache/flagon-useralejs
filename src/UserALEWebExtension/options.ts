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
import { rerouteLog, browser } from "@/UserALEWebExtension/globals";
import { Configuration } from "@/configure";
import { Extension } from "@/types";

userale.addCallbacks({ rerouteLog });

// TODO: Warn users when setting credentials with unsecured connection.
// const mitmWarning =
//   "Setting credentials with http will expose you to a MITM attack. Are you sure you want to continue?";

function setConfig() {
  const config = Configuration.getInstance();
  config.update({
    url: (document.getElementById("url") as HTMLInputElement).value,
    userId: (document.getElementById("user") as HTMLInputElement).value,
    toolName: (document.getElementById("tool") as HTMLInputElement).value,
    toolVersion: (document.getElementById("toolVersion") as HTMLInputElement)
      .value,
  });

  // Set a basic auth header if given credentials.
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;
  if (config.userId && password) {
    config.update({
      authHeader: "Basic " + btoa(`${config.userId}:${password}`),
    });
  }

  const payload: Extension.ConfigPayload = {
    useraleConfig: config,
    pluginConfig: {
      urlWhitelist: (document.getElementById("filter") as HTMLInputElement)
        .value,
    },
  };

  // @ts-expect-error Typescript is not aware that firefox's broswer is overloaded
  // to support chromium style MV2 callbacks
  browser.storage.local.set(payload, () => {
    userale.options(config);
    browser.runtime.sendMessage({ type: MessageTypes.CONFIG_CHANGE, payload });
  });
}

function getConfig() {
  // @ts-expect-error Typescript is not aware that firefox's broswer is overloaded
  // to support chromium style MV2 callbacks
  browser.storage.local.get("useraleConfig", (res: Extension.ConfigPayload) => {
    const config = res.useraleConfig;

    userale.options(config);
    (document.getElementById("url") as HTMLInputElement).value = config.url;
    (document.getElementById("user") as HTMLInputElement).value =
      config.userId as string;
    (document.getElementById("tool") as HTMLInputElement).value =
      config.toolName as string;
    (document.getElementById("toolVersion") as HTMLInputElement).value =
      config.toolVersion as string;
  });

  browser.storage.local.get(
    "pluginConfig",
    // @ts-expect-error Typescript is not aware that firefox's broswer is overloaded
    // to support chromium style MV2 callbacks
    (res: { pluginConfig: Extension.PluginConfig }) => {
      (document.getElementById("filter") as HTMLInputElement).value =
        res.pluginConfig.urlWhitelist;
    },
  );
}

document.addEventListener("DOMContentLoaded", getConfig);
document.addEventListener("submit", setConfig);
