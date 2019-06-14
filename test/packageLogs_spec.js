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
import fs from 'fs';
import {
  packageLog, initPackager, getLocation, getSelector, buildPath, selectorizePath,
  extractTimeFields, filterHandler, mapHandler, setLogFilter, setLogMapper, logs,
} from '../src/packageLogs';

describe('packageLogs', () => {
  const url = 'file://' + __dirname + '/packageLogs.html';
  const html = fs.readFileSync(__dirname + '/packageLogs.html');

  describe('setLogFilter', () => {
    it('assigns the handler to the provided value', () => {
      const func = x => true;
      setLogFilter(func);
      expect(filterHandler).to.equal(func);
    });
    it('allows the handler to be nulled', () => {
      setLogFilter(x => true);
      setLogFilter(null);
      expect(filterHandler).to.equal(null);
    });
  });

  describe('setLogMapper', () => {
    it('assigns the handler to the provided value', () => {
      const func = x => true;
      setLogMapper(func);
      expect(mapHandler).to.equal(func);
    });
    it('allows the handler to be nulled', () => {
      setLogMapper(x => true);
      setLogMapper(null);
      expect(mapHandler).to.equal(null);
    });
  });

  describe('packageLog', () => {
    it('only executes if on', (done) => {
      initPackager([], { on: true });
      const evt = { target: {}, type: 'test' };
      expect(packageLog(evt)).to.equal(true);

      initPackager([], { on: false });
      expect(packageLog({})).to.equal(false);

      done();
    });
    it('calls detailFcn with the event as an argument if provided', (done) => {
      initPackager([], { on: true });
      let called = false;
      const evt = { target: {}, type: 'test' };
      const detailFcn = (e) => {
        called = true;
        expect(e).to.equal(evt);
      };
      packageLog(evt, detailFcn);
      expect(called).to.equal(true);
      done();
    });
    it('packages logs', (done) => {
      initPackager([], { on: true });
      const evt = {
        target: {},
        type: 'test'
      };
      expect(packageLog(evt)).to.equal(true);
      done();
    });

    it('filters logs when a handler is assigned and returns false', () => {
      let filterCalled = false;
      const filter = (log) => {
        filterCalled = true;
        return false;
      };

      const evt = {
        target: {},
        type: 'test',
      };

      initPackager([], { on: true });
      packageLog(evt);

      expect(logs.length).to.equal(1);

      setLogFilter(filter);
      packageLog(evt);

      expect(logs.length).to.equal(1);
    });

    it('assigns logs to the mapper\'s return value if a handler is assigned', () => {
      let mapperCalled = false;

      const mappedLog = { type: 'foo' };
      const mapper = (log) => {
        mapperCalled = true;
        return mappedLog;
      };

      const evt = {
        target: {},
        type: 'test',
      };

      initPackager([], { on: true });

      setLogMapper(mapper);
      packageLog(evt);

      expect(mapperCalled).to.equal(true);
      expect(logs.indexOf(mappedLog)).to.equal(0);
    });

    it('does not call the map handler if the log is filtered out', () => {
      let mapperCalled = false;
      const filter = () => false;
      const mapper = (log) => {
        mapperCalled = true;
        return log;
      };

      const evt = {
        target: {},
        type: 'test',
      };

      initPackager([], { on: true });
      setLogFilter(filter);
      setLogMapper(mapper);

      packageLog(evt);

      expect(mapperCalled).to.equal(false);
    });

    it('does not attempt to call a non-function filter/mapper', () => {
      let filterCalled = false;
      let mapperCalled = false;
      const filter = () => {
        filterCalled = true;
        return true;
      };
      const mapper = (log) => {
        mapperCalled = true;
        return log;
      };

      const evt = {
        target: {},
        type: 'test',
      };

      initPackager([], { on: true });
      setLogFilter(filter);
      setLogMapper(mapper);

      packageLog(evt);

      expect(filterCalled).to.equal(true);
      expect(mapperCalled).to.equal(true);

      setLogFilter('foo');
      setLogMapper('bar');

      packageLog(evt);
      expect(logs.length).to.equal(2);
    });
  });

  describe('extractTimeFields', () => {
    it('returns the millisecond and microsecond portions of a timestamp', () => {
      const timeStamp = 123.456;
      const fields = { milli: 123, micro: 0.456 };
      const ret = extractTimeFields(timeStamp);

      expect(ret.milli).to.equal(fields.milli);
      expect(ret.micro).to.equal(fields.micro);
    });
    it('sets micro to 0 when no decimal is present', () => {
      const timeStamp = 123;
      const fields = { milli: 123, micro: 0 };
      const ret = extractTimeFields(timeStamp);

      expect(ret.milli).to.equal(fields.milli);
      expect(ret.micro).to.equal(fields.micro);
    });
    it('always returns an object', () => {
      const stampVariants = [
        null,
        'foobar',
        { foo: 'bar' },
        undefined,
        ['foo', 'bar'],
        123,
      ];

      stampVariants.forEach((variant) => {
        const ret = extractTimeFields(variant);
        expect(!!ret).to.equal(true);
        expect(typeof ret).to.equal('object');
      });
    });
  });

  describe('getLocation', () => {
    it('returns event page location', (done) => {
      jsdom.env({
        url, html,
        done: (err, window) => {
          const document = window.document;
          const ele = document.createElement('div');
          const evt = new window.MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          document.body.appendChild(ele);
          ele.addEventListener('click', (e) => {
            e.pageX = 0;
            e.pageY = 0;
            expect(getLocation(e)).to.deep.equal({ x: 0, y: 0 });
            done();
          });
          ele.dispatchEvent(evt);
        },
      });
    });

    it('calculates page location if unavailable', (done) => {
      jsdom.env({
        url, html,
        done: (err, window) => {
          const document = window.document;
          const ele = document.createElement('div');
          const evt = new window.MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          document.body.appendChild(ele);
          ele.addEventListener('click', (e) => {
            document.documentElement.scrollLeft = 0;
            document.documentElement.scrollTop = 0;
            const originalDocument = global.document;
            global.document = document;
            expect(getLocation(e)).to.deep.equal({ x: 0, y: 0 });
            global.document = originalDocument;
            done();
          });
          ele.dispatchEvent(evt);
        },
      });
    });

    it('fails to null', (done) => {
      let hadError = false;
      try {
        getLocation(null);
      } catch (e) {
        hadError = true;
      }
      expect(hadError).to.equal(true);
      done();
    });
  });

  describe('selectorizePath', () => {
    it('returns a new array of the same length provided', (done) => {
      const arr = [{}, {}];
      const ret = selectorizePath(arr);
      expect(ret).to.be.instanceof(Array);
      expect(ret).to.not.equal(arr);
      expect(ret.length).to.equal(arr.length);
      done();
    });
  });

  describe('getSelector', () => {
    it('builds a selector', (done) => {
      jsdom.env({
        url, html,
        done: (err, window) => {
          const document = window.document;
          const element = document.createElement('div');
          expect(getSelector(element)).to.equal('div');
          element.id = 'bar';
          expect(getSelector(element)).to.equal('div#bar');
          element.removeAttribute('id');
          element.classList.add('baz');
          expect(getSelector(element)).to.equal('div.baz');
          element.id = 'bar';
          expect(getSelector(element)).to.equal('div#bar.baz');
          done();
        },
      });
    });

    it('identifies window', (done) => {
      jsdom.env({
        url, html,
        done: (err, window) => {
          expect(getSelector(window)).to.equal('Window');
          done();
        },
      });
    });

    it('handles a non-null unknown value', (done) => {
      expect(getSelector('foo')).to.equal('Unknown');
      done();
    });
  });

  describe('buildPath', () => {
    it('builds a path', (done) => {
      jsdom.env({
        url, html,
        done: (err, window) => {
          const document = window.document;
          const ele = document.createElement('div');
          const evt = document.createEvent('CustomEvent');
          evt.initEvent('testEvent', true, true);
          document.body.appendChild(ele);
          ele.dispatchEvent(evt);
          expect(buildPath(evt)).to.deep.equal(['div', 'body', 'html']);
          done();
        },
      });
    });

    it('defaults to path if available', (done) => {
      jsdom.env({
        url, html,
        done: (err, window) => {
          const document = window.document;
          const ele = document.createElement('div');
          const evt = document.createEvent('CustomEvent');
          document.body.appendChild(ele);
          evt.initEvent('testEvent', true, true);
          ele.dispatchEvent(evt);
          evt.path = [ele, ele.parentElement, ele.parentElement.parentElement];
          expect(buildPath(evt)).to.deep.equal(['div', 'body', 'html']);
          done();
        },
      });
    });
  });
});
