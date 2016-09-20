import { expect } from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';
import * as mod from '../src/packageLogs';

describe('packageLogs', () => {
  const url = 'file://' + __dirname + '/packageLogs.html';
  const html = fs.readFileSync(__dirname + '/packageLogs.html');

  describe('packageLog', () => {
    it('only executes if on', (done) => {
      mod.initPackager([], { on: true });
      const evt = { target: {}, type: 'test' };
      expect(mod.packageLog(evt)).to.equal(true);

      mod.initPackager([], { on: false });
      expect(mod.packageLog({})).to.equal(false);

      done();
    });
    it('calls detailFcn with the event as an argument if provided', (done) => {
      mod.initPackager([], { on: true });
      let called = false;
      const evt = { target: {}, type: 'test' };
      const detailFcn = (e) => {
        called = true;
        expect(e).to.equal(evt);
      };
      mod.packageLog(evt, detailFcn);
      expect(called).to.equal(true);
      done();
    });
    it('packages logs', (done) => {
      mod.initPackager([], { on: true });
      const evt = {
        target: {},
        type: 'test'
      };
      expect(mod.packageLog(evt)).to.equal(true);
      done();
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
            expect(mod.getLocation(e)).to.deep.equal({ x: 0, y: 0 });
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
            expect(mod.getLocation(e)).to.deep.equal({ x: 0, y: 0 });
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
        mod.getLocation(null);
      } catch (e) {
        hadError = true;
      }
      expect(hadError).to.equal(true);
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
          expect(mod.getSelector(element)).to.equal('div');
          element.id = 'bar';
          expect(mod.getSelector(element)).to.equal('div#bar');
          element.removeAttribute('id');
          element.classList.add('baz');
          expect(mod.getSelector(element)).to.equal('div.baz');
          element.id = 'bar';
          expect(mod.getSelector(element)).to.equal('div#bar.baz');
          done();
        },
      });
    });

    it('identifies window', (done) => {
      jsdom.env({
        url, html,
        done: (err, window) => {
          expect(mod.getSelector(window)).to.equal('Window');
          done();
        },
      });
    });

    it('handles a non-null unknown value', (done) => {
      expect(mod.getSelector('foo')).to.equal('Unknown');
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
          ele.addEventListener('testEvent', (e) => {
            expect(mod.buildPath(e)).to.deep.equal(['div', 'body', 'html']);
            done();
          });
          ele.dispatchEvent(evt);
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
          evt.initEvent('testEvent', true, true);
          document.body.appendChild(ele);
          ele.addEventListener('testEvent', (e) => {
            e.path = [ele, ele.parentElement, ele.parentElement.parentElement];
            expect(mod.buildPath(e)).to.deep.equal(['div', 'body', 'html']);
            done();
          });
          ele.dispatchEvent(evt);
        },
      });
    });
  });
});
