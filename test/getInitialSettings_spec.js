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
import { expect } from "chai";
import "global-jsdom/register";

import { createEnvFromFile, sleep } from "./testUtils";
import { timeStampScale } from "../src/getInitialSettings.js";

describe("getInitialSettings", () => {
  describe("timeStampScale", () => {
    it("no event.timestamp", () => {
      const e = {};
      const ts = timeStampScale(e);
      expect(ts(e.timeStamp)).to.be.closeTo(Date.now(), 50);
    });

    it("zero", () => {
      const e = { timeStamp: 0 };
      const ts = timeStampScale(e);
      expect(ts(e.timeStamp)).to.be.closeTo(Date.now(), 50);
    });

    it("epoch milliseconds", () => {
      const e = { timeStamp: 1451606400000 };
      const ts = timeStampScale(e);
      expect(ts(e.timeStamp)).to.equal(1451606400000);
    });

    it("epoch microseconds", () => {
      const e = { timeStamp: 1451606400000000 };
      const ts = timeStampScale(e);
      expect(ts(e.timeStamp)).to.equal(1451606400000);
    });

    // Currently unsupported in jsdom
    // Chrome specific -- manual testing is clear;
    it("performance navigation time", () => {
      const terriblePolyfill = { timing: { navigationStart: Date.now() } };
      const originalPerformance = global.performance;
      global.performance = terriblePolyfill;
      const e = { timeStamp: 1 };
      const ts = timeStampScale(e);
      expect(ts(e.timeStamp)).to.equal(
        performance.timing.navigationStart + e.timeStamp,
      );
      global.performance = originalPerformance;
    });
  });

  describe("getInitialSettings", () => {
    it("fetches all settings from a script tag", async () => {
      const dom = await createEnvFromFile("getInitialSettings_fetchAll.html");
      const config = dom.window.userale.options();
      expect(config).to.have.property("autostart", true);
      expect(config).to.have.property("url", "http://test.com");
      expect(config).to.have.property("transmitInterval", 100);
      expect(config).to.have.property("logCountThreshold", 10);
      expect(config).to.have.property("userId", "testuser");
      expect(config).to.have.property("version", "1.0.0");
      expect(config).to.have.property("logDetails", false);
      expect(config).to.have.property("resolution", 100);
      expect(config).to.have.property("toolName", "testtool");
      dom.window.close();
    });

    it("grabs user id from params", async () => {
      const dom = await createEnvFromFile("getInitialSettings_userParam.html", {
        url: "file://" + __dirname + "../" + "?user=fakeuser",
      });
      const config = dom.window.userale.options();
      expect(config.userId).to.equal("fakeuser");
      dom.window.close();
    });
  });
});
