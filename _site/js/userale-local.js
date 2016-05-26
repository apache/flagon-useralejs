(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.userale = global.userale || {})));
}(this, function (exports) { 'use strict';

  var startString = '<div class="event"><div class="label"><i class="checkmark icon"></i></div><div class="content">';
  var endString = '</div></div>';

  function localLogger (config) {
    var log = logs.shift();
    $('#log-feed').prepend(startString + JSON.stringify(log) + endString);
  }

  var logs = [];
  var config$1 = {};


  function currentLogCount () {
    return logs.length;
  }


  function setConfigs (c) {
    config$1 = c;
  }


  function getSelector (ele) {
    if (ele.localName) {
      return ele.localName + (ele.id ? ('#' + ele.id) : '') + (ele.className ? ('.' + ele.className) : '');
    } else if (ele.nodeName) {
      return ele.nodeName;
    } else if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
      return "Window";
    } else {
      return "Unknown";
    }
  }


  function selectorizePath (path) {
    if (path) {
      return path.map(function (pathEle) {
        return getSelector(pathEle);
      });
    } else {
      return null;
    }
  }


  function getLocation (e) {
    if (e.pageX != null) {
      return { 'x' : e.pageX, 'y' : e.pageY };
    } else if (e.clientX != null) {
      return { 'x' : document.documentElement.scrollLeft + e.clientX, 'y' : document.documentElement.scrollTop + e.clientY };
    } else {
      return { 'x' : null, 'y' : null };
    }
  }


  function packager (e, detailAccessor) {
    var details = null;
    if (detailAccessor) {
      details = detailAccessor(e);
    }

    var log = {
      'target' : getSelector(e.target),
      'path' : selectorizePath(e.path),
      'clientTime' : (e.timeStamp && e.timeStamp > 0) ? config$1.time(e.timeStamp) : Date.now(),
      'location' : getLocation(e),
      'type' : e.type,
      'userAction' : true,
      'details' : details,
      'userId' : config$1.userId,
      'toolVersion' : config$1.version
    };

    logs.push(log);
    localLogger(config$1);
  }

  function logger (config) {

    setConfigs(config);

    // Events list
    // Keys are event types
    // Values are functions that return details object if applicable
    var events = {
      'click' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
      'dblclick' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
      'mousedown' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
      'mouseup' : function (e) { return { 'clicks' : e.detail, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; },
      'focus' : null,
      'blur' : null,
      'input' : config.logDetails ? function (e) { return { 'value' : e.target.value }; } : null,
      'change' : config.logDetails ? function (e) { return { 'value' : e.target.value }; } : null,
      'dragstart' : null,
      'dragend' : null,
      'drag' : null,
      'drop' : null,
      'keydown' : config.logDetails ? function (e) { return { 'key' : e.keyCode, 'ctrl' : e.ctrlKey, 'alt' : e.altKey, 'shift' : e.shiftKey, 'meta' : e.metaKey }; } : null,
      'mouseover' : null,
      'submit' : null
    };

    Object.keys(events).forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        packager(e, events[ev]);
      }, true);
    });

    var bufferedEvents = {
      'wheel' : function (e) { return { 'x' : e.deltaX, 'y' : e.deltaY, 'z' : e.deltaZ }; },
      'scroll' : function () { return { 'x' : window.scrollX, 'y' : window.scrollY }; },
      'resize' : function () { return { 'width' : window.outerWidth, 'height' : window.outerHeight }; }
    };

    var bufferBools = {};
    Object.keys(bufferedEvents).forEach(function (ev) {
      bufferBools[ev] = true;

      document.addEventListener(ev, function (e) {
        if (bufferBools[ev]) {
          bufferBools[ev] = false;
          packager(e, bufferedEvents[ev]);
          setTimeout(function () { bufferBools[ev] = true; }, config.resolution);
        }
      }, true);
    });

    var windowEvents = ['load', 'blur', 'focus'];
    var windowEvent = function (e) { packager(e, function () { return { 'window' : true }; }); }

    windowEvents.forEach(function (ev) {
      window.addEventListener(ev, windowEvent, true);
    });

    return true;
  }

  var config = {};
  exports.started = false;


  function _init () {
    var script = document.currentScript || (function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

    var options = script ? (script.dataset || {}) : {};

    config.autostart = options.autostart || true;
    config.url = options.url || 'http://localhost:8000/logs';
    config.transmitInterval = options.interval || 5000;
    config.logCountThreshold = options.threshold || 5;
    config.userId = options.user || null;
    config.version = options.version || null;
    config.logDetails = options['log-details'] || false;
    config.resolution = options.resolution || 500;

    if (options['user-from-params'] === 'true') {
      var regex = /[?&]aleuser(=([^&#]*)|&|#|$)/;
      var results = window.location.href.match(regex);

      if (!results || !results[2]) {
        config.userId = null;
      } else {
        config.userId = decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
    }

    config.time = _timeStampScaler();
  }


  function _timeStampScaler () {
    var e = document.createEvent('CustomEvent');

    if (e.timeStamp && e.timeStamp > 0) {

      var delta = Date.now() - e.timeStamp;
      var tsScaler;

      if (delta < 0) {
        tsScaler = function () {
          return e.timeStamp / 1000;
        };
      } else if (delta > e.timeStamp) {
        var navStart = performance.timing.navigationStart;
        tsScaler = function (ts) {
          return ts + navStart;
        }
      } else {
        tsScaler = function (ts) {
          return ts;
        }
      }

    } else {

      tsScaler = function () { return Date.now(); };

    }

    return tsScaler;
  }

  // Initialize Userale
  function start () {
    if (!exports.started) {
      setTimeout(function () {
        var state = document.readyState;
        if (state === 'interactive' || state === 'complete') {
          logger(config);
          // sender(config);
          // sendEnd(config);
          exports.started = true;
          return true;
        } else {
          start();
        }
      }, 100);
    }
  }


  function currentConfigs () {
    return config;
  }

  function logCount () {
    return currentLogCount();
  }

  // Automatically initialize and start up Userale
  (function () {
    _init();
    if (config.autostart) {
      start();
    }
  })();

  exports.start = start;
  exports.currentConfigs = currentConfigs;
  exports.logCount = logCount;

}));
