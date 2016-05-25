var expect = require('chai').expect;
var jsdom = require('jsdom');
var fs = require('fs');
var path = require('path');
var useralePath = path.join(__dirname, '/test.html');
var htmlSource = fs.readFileSync(useralePath, 'utf8');


describe('userale', function () {

  describe('configuration', function () {
    it('dataset is unsupported by jsdom', function (done) {
      this.timeout(1000);

      var document = jsdom.jsdom(htmlSource, {
        url: 'file://' + useralePath
      });
      var window = document.defaultView;

      setTimeout(function () {
        // dataset API is not currently supported by jsdom

        expect(window.userale.currentConfigs().version).to.equal(null);
        done();
      }, 100);

    });
  });


  describe('logging', function () {
    it('records a click event', function (done) {
      this.timeout(1000);

      var document = jsdom.jsdom(htmlSource, {
        url: 'file://' + useralePath
      });
      var window = document.defaultView;

      setTimeout(function () {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        document.getElementById('test').dispatchEvent(clickEvent);

        setTimeout(function () {
          expect(window.userale.logCount()).to.equal(1);
          done();
        }, 50);
      }, 200);
    });
  });

});
