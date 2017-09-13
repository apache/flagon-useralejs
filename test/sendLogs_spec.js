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
import { expect } from 'chai';
import jsdom from 'jsdom';
import sinon from 'sinon';
import { sendOnInterval, sendOnClose } from '../src/sendLogs';

describe('sendLogs', () => {
  it('sends logs on an interval', (done) => {
    let requests = 0;
    const originalXMLHttpRequest = global.XMLHttpRequest;
    const conf = { on: true, transmitInterval: 500, url: 'test', logCountThreshold: 2 };
    const logs = [];
    const clock = sinon.useFakeTimers();
    const xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    xhr.onCreate = () => { requests++; };

    sendOnInterval(logs, conf);

    clock.tick(conf.transmitInterval * 2);
    // Make sure it doesn't make requests for no raisin
    expect(requests).to.equal(0);

    // Make sure it respects the logCountThreshold
    logs.push({ foo: 'bar1' });   
    clock.tick(conf.transmitInterval);
    expect(logs.length).to.equal(1);

    // Make sure it sends the logs and clears the array
    logs.push({ foo: 'bar2' });
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
    const conf = { on: true, transmitInterval: 500, url: 'test', logCountThreshold: 1 };
    const logs = [];
    const clock = sinon.useFakeTimers();
    const xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    xhr.onCreate = () => { requests++; };

    sendOnInterval(logs, conf);

    // Make sure it respects the logCountThreshold
    logs.push({ foo: 'bar1' });   
    clock.tick(conf.transmitInterval);

    expect(logs.length).to.equal(0);
    expect(requests).to.equal(1);

    conf.on = false;

    logs.push({ foo: 'bar2' });
    clock.tick(conf.transmitInterval);
    expect(logs.length).to.equal(1);
    expect(requests).to.equal(1);

    xhr.restore();
    clock.restore();
    global.XMLHttpRequest = originalXMLHttpRequest;
    done();
  });

  it('sends logs on page exit with navigator', (done) => {
    const html = `<html><head></head><body></body></html>`;
    jsdom.env({
      html,
      done: (err, window) => {
        const originalNavigator = global.navigator;
        const originalWindow = global.window;
        let called = false;
        global.window = window;
        global.navigator = {
          sendBeacon: () => {
            called = true;
          },
        };

        const evt = window.document.createEvent('CustomEvent');
        evt.initEvent('unload', true, true);
        sendOnClose([{ foo: 'bar' }], { on: true, url: 'test' });

        window.dispatchEvent(evt);
        window.close();

        expect(called).to.equal(true);
        global.window = originalWindow;
        global.navigator = originalNavigator;
        done();
      }
    });
  });
  it('sends logs on page exit without navigator', (done) => {
    const html = `<html><head></head><body></body></html>`;
    jsdom.env({
      html,
      done: (err, window) => {
        const originalNavigator = global.navigator;
        const originalXMLHttpRequest = global.XMLHttpRequest;
        const originalWindow = global.window;
        let requests = 0;
        const xhr = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest = xhr;
        global.window = window;
        global.XMLHttpRequest = xhr;
        global.navigator = { sendBeacon: false, };
        xhr.onCreate = () => { requests++; };

        const evt = window.document.createEvent('CustomEvent');
        evt.initEvent('beforeunload', true, true);
        sendOnClose([{ foo: 'bar' }], { on: true, url: 'test' });
        
        window.dispatchEvent(evt);
        window.close();

        expect(requests).to.equal(1);
        global.window = originalWindow;
        global.navigator = originalNavigator;
        global.XMLHttpRequest = originalXMLHttpRequest;
        done();
      }
    });
  });

  it('does not send logs on page exit if config is off', (done) => {
    const html = `<html><head></head><body></body></html>`;
    jsdom.env({
      html,
      done: (err, window) => {
        const originalNavigator = global.navigator;
        const originalXMLHttpRequest = global.XMLHttpRequest;
        const originalWindow = global.window;
        let requests = 0;
        const xhr = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest = xhr;
        global.window = window;
        global.XMLHttpRequest = xhr;
        global.navigator = { sendBeacon: false, };
        xhr.onCreate = () => { requests++; };

        const evt = window.document.createEvent('CustomEvent');
        evt.initEvent('beforeunload', true, true);
        sendOnClose([{ foo: 'bar' }], { on: false, url: 'test' });
        
        window.dispatchEvent(evt);
        window.close();

        expect(requests).to.equal(0);
        global.window = originalWindow;
        global.navigator = originalNavigator;
        global.XMLHttpRequest = originalXMLHttpRequest;
        done();
      }
    });
  });
});
