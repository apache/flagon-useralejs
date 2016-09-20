import { expect } from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';

describe('Userale API', () => {
  var file = 'file://' + __dirname + '/main.html';
  var html = fs.readFileSync(__dirname + '/main.html');

  it('provides configs', (done) => {
    jsdom.env({
      html : html,
      url : file,
      features : {
        FetchExternalResources : ['script'],
        ProcessExternalResources : ['script']
      },
      done : (err, window) => {
        const config = window.userale.options();
        expect(config).to.be.an('object');
        expect(config).to.have.all.keys([
          'on',
          'useraleVersion',
          'autostart',
          'url',
          'transmitInterval',
          'logCountThreshold',
          'userId',
          'version',
          'logDetails',
          'resolution',
          'toolName',
          'userFromParams',
          'time',
        ]);
        window.close();
        done();
      }
    });
  });

  it('edits configs', (done) => {
    jsdom.env({
      html : html,
      url : file,
      features : {
        FetchExternalResources : ['script'],
        ProcessExternalResources : ['script']
      },
      done : (err, window) => {
        const config = window.userale.options();
        const interval = config.transmitInterval;
        window.userale.options({
          transmitInterval : interval + 10
        });
        const newConfig = window.userale.options();

        expect(newConfig.transmitInterval).to.equal(interval + 10);
        window.close();
        done();
      }
    });
  });

  it('starts + stops', (done) => {
    jsdom.env({
      html : html,
      url : file,
      features : {
        FetchExternalResources : ['script'],
        ProcessExternalResources : ['script']
      },
      done : (err, window) => {
        setTimeout(() => {
          const { userale } = window;
          expect(userale.options().on).to.equal(true);

          userale.stop();
          expect(userale.options().on).to.equal(false);

          userale.start();
          expect(userale.options().on).to.equal(true);

          window.close();
          done();
        }, 200);
      }
    });
  });

  it('sends custom logs', (done) => {
    jsdom.env({
      html: html,
      url: file,
      features : {
        FetchExternalResources : ['script'],
        ProcessExternalResources : ['script']
      },
      done: (err, window) => {
        const { userale } = window;

        expect(userale.log({})).to.equal(true);
        expect(userale.log()).to.equal(false);
        expect(userale.log(null)).to.equal(false);

        window.close();
        done();
      }
    });
  });
});
