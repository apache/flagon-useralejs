import { expect } from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';

describe('Userale API', () => {
  var file = 'file://' + __dirname + '/main.html';
  var html = fs.readFileSync(__dirname + '/main.html');

  it('provides configs', function(done) {
    jsdom.env({
      html : html,
      url : file,
      features : {
        FetchExternalResources : ['script'],
        ProcessExternalResources : ['script']
      },
      done : function(err, window) {
        var config = window.userale.options();
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

  it('edits configs', function(done) {
    jsdom.env({
      html : html,
      url : file,
      features : {
        FetchExternalResources : ['script'],
        ProcessExternalResources : ['script']
      },
      done : function(err, window) {
        var config = window.userale.options();
        var interval = config.transmitInterval;
        window.userale.options({
          transmitInterval : interval + 10
        });
        var newConfig = window.userale.options();

        expect(newConfig.transmitInterval).to.equal(interval + 10);
        window.close();
        done();
      }
    });
  });

  it('starts + stops', function(done) {
    jsdom.env({
      html : html,
      url : file,
      features : {
        FetchExternalResources : ['script'],
        ProcessExternalResources : ['script']
      },
      done : function(err, window) {
        setTimeout(function() {
          var userale = window.userale;
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

  it('sends custom logs');
});
