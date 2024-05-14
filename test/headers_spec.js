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
import sinon from "sinon";
import {
  headersCallback,
  registerHeadersCallback,
  resetHeadersCallback,
  updateCustomHeaders,
  verifyHeadersCallback,
} from "../src/utils";

describe("verifyCallback", () => {
  it("should not throw error for valid callback", () => {
    const validCallback = sinon
      .stub()
      .returns({ "x-api-token": "someString", "x-abc-def": "someOtherString" });
    expect(() => verifyHeadersCallback(validCallback)).to.not.throw();
  });

  it("should throw error for non-function callback", () => {
    const nonFunctionCallback = "notAFunction";
    expect(() => verifyHeadersCallback(nonFunctionCallback)).to.throw(
      "Userale headers callback must be a function",
    );
  });

  it("should throw error for non-object callback return", () => {
    const invalidReturnCallback = sinon.stub().returns(123);
    expect(() => verifyHeadersCallback(invalidReturnCallback)).to.throw(
      "Userale headers callback must return an object",
    );
  });

  it("should throw error for incorrect headers object return", () => {
    const invalidReturnCallback = sinon
      .stub()
      .returns({ "x-not-a-proper-value": 123 });
    expect(() => verifyHeadersCallback(invalidReturnCallback)).to.throw(
      "Userale header callback must return an object with string keys and values",
    );
  });

  it("should not throw error for valid callback with empty object return", () => {
    const validCallback = sinon.stub().returns({});
    expect(() => verifyHeadersCallback(validCallback)).to.not.throw();
  });
});

describe("registerHeadersCallback", () => {
  afterEach(() => {
    resetHeadersCallback();
  });

  it("should register a valid callback", () => {
    const validCallback = sinon
      .stub()
      .returns({ "x-api-token": "someString", "x-abc-def": "someOtherString" });
    expect(registerHeadersCallback(validCallback)).to.be.true;
    expect(headersCallback).to.equal(validCallback);
  });

  it("should not register a non-function callback", () => {
    const nonFunctionCallback = "notAFunction";
    expect(registerHeadersCallback(nonFunctionCallback)).to.be.false;
    expect(headersCallback).to.be.null;
  });

  it("should not register a callback with invalid return type", () => {
    const invalidReturnCallback = sinon.stub().returns(123);
    expect(registerHeadersCallback(invalidReturnCallback)).to.be.false;
    expect(headersCallback).to.be.null;
  });

  it("should register a callback with empty object return", () => {
    const validCallback = sinon.stub().returns({});
    expect(registerHeadersCallback(validCallback)).to.be.true;
    expect(headersCallback).to.equal(validCallback);
  });
});

describe("updateCustomHeader", () => {
  let config;

  beforeEach(() => {
    // Initialize config object before each test
    config = { headers: null };
  });

  afterEach(() => {
    resetHeadersCallback();
  });

  it("should update custom headers when headersCallback is provided", () => {
    const customHeaders = {
      "x-api-token": "someString",
      "x-abc-def": "someOtherString",
    };
    const validCallback = sinon.stub().returns(customHeaders);
    registerHeadersCallback(validCallback);
    updateCustomHeaders(config, headersCallback);
    expect(config.headers).to.equal(customHeaders);
  });

  it("should not update custom headers when headersCallback is not provided", () => {
    updateCustomHeaders(config, headersCallback);
    expect(config.headers).to.be.null;
  });

  it("should not update custom headers when headersCallback returns non-object", () => {
    const invalidReturnCallback = sinon.stub().returns(123);
    registerHeadersCallback(invalidReturnCallback);
    updateCustomHeaders(config, headersCallback);
    expect(config.headers).to.be.null;
  });

  it("should update custom headers with empty string return from headersCallback", () => {
    const validCallback = sinon.stub().returns({});
    registerHeadersCallback(validCallback);
    updateCustomHeaders(config, headersCallback);
    expect(config.headers).to.deep.equal({});
  });

  it("should handle errors thrown during headersCallback execution", () => {
    const errorThrowingCallback = sinon
      .stub()
      .throws(new Error("Callback execution failed"));
    registerHeadersCallback(errorThrowingCallback);
    updateCustomHeaders(config, headersCallback);
    expect(config.headers).to.be.null;
  });

  it("should not update custom headers after unregistering headersCallback", () => {
    const customHeaders = {
      "x-api-token": "someString",
      "x-abc-def": "someOtherString",
    };
    const validCallback = sinon.stub().returns(customHeaders);
    registerHeadersCallback(validCallback);
    updateCustomHeaders(config, headersCallback);
    expect(config.headers).to.equal(customHeaders);

    // Unregister headersCallback
    updateCustomHeaders(config, null);
    expect(config.headers).to.equal(customHeaders);
  });
});
