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
import { Configuration } from "@/configure";
import { initSender, sendOnInterval, sendOnClose } from "@/sendLogs";
import { registerAuthCallback, registerHeadersCallback } from "@/utils";

import type { Logging } from "@/types";

const config = Configuration.getInstance();
let xhrMock: Partial<XMLHttpRequest>;

describe("sendLogs", () => {
  beforeEach(() => {
    config.reset();
    xhrMock = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status: 200,
      responseText: "response",
    };
    jest
      .spyOn(window, "XMLHttpRequest")
      .mockImplementation(() => xhrMock as XMLHttpRequest);
  });

  it("sends logs on an interval", (done) => {
    config.update({
      on: true,
      transmitInterval: 500,
      url: "test",
      logCountThreshold: 2,
    });
    const logs: Array<Logging.Log> = [];
    jest.useFakeTimers();

    sendOnInterval(logs, config);

    jest.advanceTimersByTime(config.transmitInterval * 2);
    // Make sure it doesn't make requests for no reason
    expect(xhrMock.send).not.toHaveBeenCalled();

    // Make sure it respects the logCountThreshold
    logs.push({ foo: "bar1" });
    jest.advanceTimersByTime(config.transmitInterval);
    expect(logs.length).toEqual(1);

    // Make sure it sends the logs and clears the array
    logs.push({ foo: "bar2" });
    jest.advanceTimersByTime(config.transmitInterval);
    expect(logs.length).toEqual(0);
    expect(xhrMock.send).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
    done();
  });

  it("does not send logs if the config is off", (done) => {
    const logs: Array<Logging.Log> = [];
    config.update({
      on: true,
      transmitInterval: 500,
      url: "test",
      logCountThreshold: 1,
    });
    jest.useFakeTimers();

    sendOnInterval(logs, config);

    // Make sure it respects the logCountThreshold
    logs.push({ foo: "bar1" });
    jest.advanceTimersByTime(config.transmitInterval);

    expect(logs.length).toEqual(0);
    expect(xhrMock.send).toHaveBeenCalledTimes(1);

    config.on = false;

    logs.push({ foo: "bar2" });
    jest.advanceTimersByTime(config.transmitInterval);
    expect(logs.length).toEqual(1);
    expect(xhrMock.send).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
    done();
  });

  it("sends logs on page exit with navigator", () => {
    const sendBeaconSpy = jest.fn();
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: sendBeaconSpy },
      writable: true,
    });

    config.update({ on: true, url: "test" });
    sendOnClose([], config);
    config.update({ on: true, url: "test" });
    sendOnClose([{ foo: "bar" }], config);
    global.window.dispatchEvent(new window.CustomEvent("pagehide"));

    expect(sendBeaconSpy).toHaveBeenCalledTimes(1);
  });

  it("does not send logs on page exit when config is off", () => {
    const sendBeaconSpy = jest.fn();
    Object.defineProperty(global, "navigator", {
      value: { sendBeacon: sendBeaconSpy },
      writable: true,
    });

    config.update({ on: false, url: "test" });
    sendOnClose([{ foo: "bar" }], config);
    global.window.dispatchEvent(new window.CustomEvent("pagehide"));

    expect(sendBeaconSpy).not.toHaveBeenCalled();
  });

  it("sends logs with proper auth header when using registerAuthCallback", (done) => {
    const logs: Array<Logging.Log> = [];
    config.update({
      on: true,
      transmitInterval: 500,
      url: "test",
      logCountThreshold: 1,
    });
    jest.useFakeTimers();

    // Mock the authCallback function
    const authCallback = jest.fn().mockReturnValue("fakeAuthToken");

    // Register the authCallback
    registerAuthCallback(authCallback);

    // Initialize sender with logs and config
    initSender(logs, config);

    // Simulate log entry
    logs.push({ foo: "bar" });

    // Trigger interval to send logs
    jest.advanceTimersByTime(config.transmitInterval);

    // Verify that the request has the proper auth header
    expect(xhrMock.send).toHaveBeenCalledTimes(1);
    expect(xhrMock.setRequestHeader).toHaveBeenCalledWith(
      "Authorization",
      "fakeAuthToken",
    );

    // Restore XMLHttpRequest and clock
    jest.useRealTimers();
    done();
  });

  it("sends logs with proper custom headers when using registerHeadersCallback", (done) => {
    const logs: Array<Logging.Log> = [];
    config.update({
      on: true,
      transmitInterval: 500,
      url: "test",
      logCountThreshold: 1,
    });
    jest.useFakeTimers();

    // Mock the authCallback function
    const customHeaders = {
      "x-api-token": "someString",
      "x-abc-def": "someOtherString",
    };
    const headersCallback = jest.fn().mockReturnValue(customHeaders);

    // Register the authCallback
    registerHeadersCallback(headersCallback);

    // Initialize sender with logs and config
    initSender(logs, config);

    // Simulate log entry
    logs.push({ foo: "bar" });

    // Trigger interval to send logs
    jest.advanceTimersByTime(config.transmitInterval);

    // Verify that the request has the proper auth header
    expect(xhrMock.send).toHaveBeenCalledTimes(1);
    for (const [key, value] of Object.entries(customHeaders)) {
      expect(xhrMock.setRequestHeader).toHaveBeenCalledWith(key, value);
    }

    jest.useRealTimers();
    done();
  });
});
