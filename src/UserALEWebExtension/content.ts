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
import type { Settings } from "@/types";

browser.storage.local.get(
  "useraleConfig",
  // @ts-expect-error Typescript is not aware that firefox's broswer is overloaded
  // to support chromium style MV2 callbacks
  (res: { useraleConfig: Settings.Config }) => {
    userale.options(res.useraleConfig);
    userale.addCallbacks({ rerouteLog });

    // Send httpSession to background scirpt to inject into tab events.
    const userAleHttpSessionId = window.sessionStorage.getItem(
      "userAleHttpSessionId",
    );
    if (userAleHttpSessionId) {
      browser.runtime.sendMessage({
        type: MessageTypes.HTTP_SESSION,
        payload: JSON.parse(userAleHttpSessionId),
      });
    }
  },
);

// TODO: Add types for message
browser.runtime.onMessage.addListener(function (message) {
  if (message.type === MessageTypes.CONFIG_CHANGE) {
    userale.options(message.payload);
  }
});
