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
import chai, {expect} from 'chai';
import chaiSubset from 'chai-subset';
import {JSDOM} from 'jsdom';
import sinon from 'sinon';
import {initSender, sendOnInterval, sendOnClose} from '../src/sendLogs';
import {registerAuthCallback, registerHeadersCallback} from '../src/utils';
import 'global-jsdom/register'

chai.use(chaiSubset);

describe('sendLogs', () => {
    it('sends logs on an interval', (done) => {
        let requests = 0;
        const originalXMLHttpRequest = global.XMLHttpRequest;
        const conf = {on: true, transmitInterval: 500, url: 'test', logCountThreshold: 2};
        const logs = [];
        const clock = sinon.useFakeTimers();
        const xhr = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest = xhr;
        xhr.onCreate = () => {
            requests++;
        };

        sendOnInterval(logs, conf);

        clock.tick(conf.transmitInterval * 2);
        // Make sure it doesn't make requests for no raisin
        expect(requests).to.equal(0);

        // Make sure it respects the logCountThreshold
        logs.push({foo: 'bar1'});
        clock.tick(conf.transmitInterval);
        expect(logs.length).to.equal(1);

        // Make sure it sends the logs and clears the array
        logs.push({foo: 'bar2'});
        clock.tick(conf.transmitInterval);
        expect(logs.length).to.equal(0);
        expect(requests).to.equal(1);

        xhr.restore();
        clock.restore();
        global.XMLHttpRequest = originalXMLHttpRequest;
        done();
    });

    it('does not send logs if the config is off', (done) => {
        let requests = 0;
        const originalXMLHttpRequest = global.XMLHttpRequest;
        const conf = {on: true, transmitInterval: 500, url: 'test', logCountThreshold: 1};
        const logs = [];
        const clock = sinon.useFakeTimers();
        const xhr = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest = xhr;
        xhr.onCreate = () => {
            requests++;
        };

        sendOnInterval(logs, conf);

        // Make sure it respects the logCountThreshold
        logs.push({foo: 'bar1'});
        clock.tick(conf.transmitInterval);

        expect(logs.length).to.equal(0);
        expect(requests).to.equal(1);

        conf.on = false;

        logs.push({foo: 'bar2'});
        clock.tick(conf.transmitInterval);
        expect(logs.length).to.equal(1);
        expect(requests).to.equal(1);

        xhr.restore();
        clock.restore();
        global.XMLHttpRequest = originalXMLHttpRequest;
        done();
    });

    it('sends logs on page exit with navigator', () => {
        const sendBeaconSpy = sinon.spy()
        global.navigator = {
            sendBeacon: sendBeaconSpy
        };
        sendOnClose([], {on: true, url: 'test'})
        sendOnClose([{foo: 'bar'}], {on: true, url: 'test'});
        global.window.dispatchEvent(new window.CustomEvent('pagehide'))
        sinon.assert.calledOnce(sendBeaconSpy)
    });

    it('does not send logs on page exit when config is off', () => {
        const sendBeaconSpy = sinon.spy()
        global.navigator = {
            sendBeacon: sendBeaconSpy
        };
        sendOnClose([{foo: 'bar'}], {on: false, url: 'test'});
        global.window.dispatchEvent(new window.CustomEvent('pagehide'))
        sinon.assert.notCalled(sendBeaconSpy)
    });

    it('sends logs with proper auth header when using registerAuthCallback', (done) => {
        let requests = []
        const originalXMLHttpRequest = global.XMLHttpRequest;
        const conf = { on: true, transmitInterval: 500, url: 'test', logCountThreshold: 1 };
        const logs = [];
        const clock = sinon.useFakeTimers();
        const xhr = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest = xhr;
        xhr.onCreate = (xhr) => {
            requests.push(xhr);
        };
    
        // Mock the authCallback function
        const authCallback = sinon.stub().returns('fakeAuthToken');
        
        // Register the authCallback
        registerAuthCallback(authCallback);
    
        // Initialize sender with logs and config
        initSender(logs, conf);
    
        // Simulate log entry
        logs.push({ foo: 'bar' });
    
        // Trigger interval to send logs
        clock.tick(conf.transmitInterval);

        // Verify that the request has the proper auth header
        expect(requests.length).to.equal(1);
        expect(requests[0].requestHeaders.Authorization).to.equal('fakeAuthToken');
    
        // Restore XMLHttpRequest and clock
        xhr.restore();
        clock.restore();
        global.XMLHttpRequest = originalXMLHttpRequest;
        done()
      });

      it('sends logs with proper custom headers when using registerHeadersCallback', (done) => {
        let requests = []
        const originalXMLHttpRequest = global.XMLHttpRequest;
        const conf = { on: true, transmitInterval: 500, url: 'test', logCountThreshold: 1 };
        const logs = [];
        const clock = sinon.useFakeTimers();
        const xhr = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest = xhr;
        xhr.onCreate = (xhr) => {
            requests.push(xhr);
        };
    
        // Mock the authCallback function
        const customHeaders = {'x-api-token': 'someString', 'x-abc-def': 'someOtherString'}
        const headersCallback = sinon.stub().returns(customHeaders);
        
        // Register the authCallback
        registerHeadersCallback(headersCallback);
    
        // Initialize sender with logs and config
        initSender(logs, conf);
    
        // Simulate log entry
        logs.push({ foo: 'bar' });
    
        // Trigger interval to send logs
        clock.tick(conf.transmitInterval);

        // Verify that the request has the proper auth header
        expect(requests.length).to.equal(1);
        expect(requests[0].requestHeaders).to.containSubset(customHeaders);
    
        // Restore XMLHttpRequest and clock
        xhr.restore();
        clock.restore();
        global.XMLHttpRequest = originalXMLHttpRequest;
        done()
      });
});
