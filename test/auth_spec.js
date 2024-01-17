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
import {expect} from 'chai';
import sinon from 'sinon';
import {authCallback, registerAuthCallback, resetAuthCallback, updateAuthHeader, verifyCallback} from '../src/auth';

describe('verifyCallback', () => {
    it('should not throw error for valid callback', () => {
        const validCallback = sinon.stub().returns('someString');
        expect(() => verifyCallback(validCallback)).to.not.throw();
    });

    it('should throw error for non-function callback', () => {
        const nonFunctionCallback = 'notAFunction';
        expect(() => verifyCallback(nonFunctionCallback)).to.throw('Userale auth callback must be a function');
    });

    it('should throw error for non-string callback return', () => {
        const invalidReturnCallback = sinon.stub().returns(123);
        expect(() => verifyCallback(invalidReturnCallback)).to.throw('Userale auth callback must return a string');
    });

    it('should not throw error for valid callback with empty string return', () => {
        const validCallback = sinon.stub().returns('');
        expect(() => verifyCallback(validCallback)).to.not.throw();
    });
});

describe('registerAuthCallback', () => {
    afterEach(() => {
      resetAuthCallback();
    });
  
    it('should register a valid callback', () => {
      const validCallback = sinon.stub().returns('someString');
      expect(registerAuthCallback(validCallback)).to.be.true;
      expect(authCallback).to.equal(validCallback);
    });
  
    it('should not register a non-function callback', () => {
      const nonFunctionCallback = 'notAFunction';
      expect(registerAuthCallback(nonFunctionCallback)).to.be.false;
      expect(authCallback).to.be.null;
    });
  
    it('should not register a callback with invalid return type', () => {
      const invalidReturnCallback = sinon.stub().returns(123);
      expect(registerAuthCallback(invalidReturnCallback)).to.be.false;
      expect(authCallback).to.be.null;
    });
  
    it('should register a callback with empty string return', () => {
      const validCallback = sinon.stub().returns('');
      expect(registerAuthCallback(validCallback)).to.be.true;
      expect(authCallback).to.equal(validCallback);
    });
});

describe('updateAuthHeader', () => {
    let config;
  
    beforeEach(() => {
      // Initialize config object before each test
      config = { authHeader: null };
    });

    afterEach(() => {
      resetAuthCallback();
    });
  
    it('should update auth header when authCallback is provided', () => {
      const validCallback = sinon.stub().returns('someString');
      registerAuthCallback(validCallback);
      updateAuthHeader(config, authCallback);
      expect(config.authHeader).to.equal('someString');
    });
  
    it('should not update auth header when authCallback is not provided', () => {
      updateAuthHeader(config, authCallback);
      expect(config.authHeader).to.be.null;
    });
  
    it('should not update auth header when authCallback returns non-string', () => {
      const invalidReturnCallback = sinon.stub().returns(123);
      registerAuthCallback(invalidReturnCallback);
      updateAuthHeader(config, authCallback);
      expect(config.authHeader).to.be.null;
    });
  
    it('should update auth header with empty string return from authCallback', () => {
      const validCallback = sinon.stub().returns('');
      registerAuthCallback(validCallback);
      updateAuthHeader(config, authCallback);
      expect(config.authHeader).to.equal('');
    });
  
    it('should handle errors thrown during authCallback execution', () => {
      const errorThrowingCallback = sinon.stub().throws(new Error('Callback execution failed'));
      registerAuthCallback(errorThrowingCallback);
      updateAuthHeader(config, authCallback);
      expect(config.authHeader).to.be.null;
    });
  
    it('should not update auth header after unregistering authCallback', () => {
      const validCallback = sinon.stub().returns('someString');
      registerAuthCallback(validCallback);
      updateAuthHeader(config, authCallback);
      expect(config.authHeader).to.equal('someString');
      
      // Unregister authCallback
      updateAuthHeader(config, null);
      expect(config.authHeader).to.equal('someString');
    });
  });