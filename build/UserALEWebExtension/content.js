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

/* eslint-disable */
// these are default values, which can be overridden by the user on the options page
var userAleHost = 'http://localhost:8000';
var userAleScript = 'userale-2.3.0.min.js';
var toolUser = 'nobody';
var toolName = 'test_app';
var toolVersion = '2.3.0';
/* eslint-enable */

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
var prefix = 'USERALE_';
var CONFIG_CHANGE = prefix + 'CONFIG_CHANGE';
var ADD_LOG = prefix + 'ADD_LOG';

var version = "2.3.0";

/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the 'License'); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var sessionId = null;
/**
 * Extracts the initial configuration settings from the
 * currently executing script tag.
 * @return {Object} The extracted configuration object
 */

function getInitialSettings() {
  var settings = {};

  if (sessionId === null) {
    sessionId = getSessionId('userAleSessionId', 'session_' + String(Date.now()));
  }

  var script = document.currentScript || function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  }();

  var get = script ? script.getAttribute.bind(script) : function () {
    return null;
  };
  settings.autostart = get('data-autostart') === 'false' ? false : true;
  settings.url = get('data-url') || 'http://localhost:8000';
  settings.transmitInterval = +get('data-interval') || 5000;
  settings.logCountThreshold = +get('data-threshold') || 5;
  settings.userId = get('data-user') || null;
  settings.version = get('data-version') || null;
  settings.logDetails = get('data-log-details') === 'true' ? true : false;
  settings.resolution = +get('data-resolution') || 500;
  settings.toolName = get('data-tool') || null;
  settings.userFromParams = get('data-user-from-params') || null;
  settings.time = timeStampScale(document.createEvent('CustomEvent'));
  settings.sessionID = get('data-session') || sessionId;
  settings.authHeader = get('data-auth') || null;
  settings.custIndex = get('data-index') || null;
  return settings;
}
/**
 * defines sessionId, stores it in sessionStorage, checks to see if there is a sessionId in
 * storage when script is started. This prevents events like 'submit', which refresh page data
 * from refreshing the current user session
 *
 */

function getSessionId(sessionKey, value) {
  if (window.sessionStorage.getItem(sessionKey) === null) {
    window.sessionStorage.setItem(sessionKey, JSON.stringify(value));
    return value;
  }

  return JSON.parse(window.sessionStorage.getItem(sessionKey));
}
/**
 * Creates a function to normalize the timestamp of the provided event.
 * @param  {Object} e An event containing a timeStamp property.
 * @return {timeStampScale~tsScaler}   The timestamp normalizing function.
 */

function timeStampScale(e) {
  var tsScaler;

  if (e.timeStamp && e.timeStamp > 0) {
    var delta = Date.now() - e.timeStamp;
    /**
     * Returns a timestamp depending on various browser quirks.
     * @param  {?Number} ts A timestamp to use for normalization.
     * @return {Number} A normalized timestamp.
     */

    if (delta < 0) {
      tsScaler = function tsScaler() {
        return e.timeStamp / 1000;
      };
    } else if (delta > e.timeStamp) {
      var navStart = performance.timing.navigationStart;

      tsScaler = function tsScaler(ts) {
        return ts + navStart;
      };
    } else {
      tsScaler = function tsScaler(ts) {
        return ts;
      };
    }
  } else {
    tsScaler = function tsScaler() {
      return Date.now();
    };
  }

  return tsScaler;
}

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

/**
 * Shallow merges the first argument with the second.
 * Retrieves/updates the userid if userFromParams is provided.
 * @param  {Object} config    Current configuration object to be merged into.
 * @param  {Object} newConfig Configuration object to merge into the current config.
 */
function configure(config, newConfig) {
  var configAutostart = config['autostart'];
  var newConfigAutostart = newConfig['autostart'];
  Object.keys(newConfig).forEach(function (option) {
    if (option === 'userFromParams') {
      var userId = getUserIdFromParams(newConfig[option]);

      if (userId) {
        config.userId = userId;
      }
    }

    config[option] = newConfig[option];
  });

  if (configAutostart === false || newConfigAutostart === false) {
    config['autostart'] = false;
  }
}
/**
 * Attempts to extract the userid from the query parameters of the URL.
 * @param  {string} param The name of the query parameter containing the userid.
 * @return {string|null}       The extracted/decoded userid, or null if none is found.
 */

function getUserIdFromParams(param) {
  var userField = param;
  var regex = new RegExp('[?&]' + userField + '(=([^&#]*)|&|#|$)');
  var results = window.location.href.match(regex);

  if (results && results[2]) {
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  } else {
    return null;
  }
}

var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BrowserInfo = /** @class */ (function () {
    function BrowserInfo(name, version, os) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.type = 'browser';
    }
    return BrowserInfo;
}());
var NodeInfo = /** @class */ (function () {
    function NodeInfo(version) {
        this.version = version;
        this.type = 'node';
        this.name = 'node';
        this.os = process.platform;
    }
    return NodeInfo;
}());
var SearchBotDeviceInfo = /** @class */ (function () {
    function SearchBotDeviceInfo(name, version, os, bot) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.bot = bot;
        this.type = 'bot-device';
    }
    return SearchBotDeviceInfo;
}());
var BotInfo = /** @class */ (function () {
    function BotInfo() {
        this.type = 'bot';
        this.bot = true; // NOTE: deprecated test name instead
        this.name = 'bot';
        this.version = null;
        this.os = null;
    }
    return BotInfo;
}());
var ReactNativeInfo = /** @class */ (function () {
    function ReactNativeInfo() {
        this.type = 'react-native';
        this.name = 'react-native';
        this.version = null;
        this.os = null;
    }
    return ReactNativeInfo;
}());
// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
    ['aol', /AOLShield\/([0-9\._]+)/],
    ['edge', /Edge\/([0-9\._]+)/],
    ['edge-ios', /EdgiOS\/([0-9\._]+)/],
    ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
    ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['silk', /\bSilk\/([0-9._-]+)\b/],
    ['miui', /MiuiBrowser\/([0-9\.]+)$/],
    ['beaker', /BeakerBrowser\/([0-9\.]+)/],
    ['edge-chromium', /EdgA?\/([0-9\.]+)/],
    [
        'chromium-webview',
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
    ],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
    ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['fxios', /FxiOS\/([0-9\.]+)/],
    ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
    ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
    ['pie', /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
    ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
    ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
    ['ie', /MSIE\s(7\.0)/],
    ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['facebook', /FB[AS]V\/([0-9\.]+)/],
    ['instagram', /Instagram\s([0-9\.]+)/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ['curl', /^curl\/([0-9\.]+)$/],
    ['searchbot', SEARCHBOX_UA_REGEX],
];
var operatingSystemRules = [
    ['iOS', /iP(hone|od|ad)/],
    ['Android OS', /Android/],
    ['BlackBerry OS', /BlackBerry|BB10/],
    ['Windows Mobile', /IEMobile/],
    ['Amazon OS', /Kindle/],
    ['Windows 3.11', /Win16/],
    ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
    ['Windows 98', /(Windows 98)|(Win98)/],
    ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
    ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
    ['Windows Server 2003', /(Windows NT 5.2)/],
    ['Windows Vista', /(Windows NT 6.0)/],
    ['Windows 7', /(Windows NT 6.1)/],
    ['Windows 8', /(Windows NT 6.2)/],
    ['Windows 8.1', /(Windows NT 6.3)/],
    ['Windows 10', /(Windows NT 10.0)/],
    ['Windows ME', /Windows ME/],
    ['Windows CE', /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
    ['Open BSD', /OpenBSD/],
    ['Sun OS', /SunOS/],
    ['Chrome OS', /CrOS/],
    ['Linux', /(Linux)|(X11)/],
    ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
    ['QNX', /QNX/],
    ['BeOS', /BeOS/],
    ['OS/2', /OS\/2/],
];
function detect(userAgent) {
    if (!!userAgent) {
        return parseUserAgent(userAgent);
    }
    if (typeof document === 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative') {
        return new ReactNativeInfo();
    }
    if (typeof navigator !== 'undefined') {
        return parseUserAgent(navigator.userAgent);
    }
    return getNodeVersion();
}
function matchUserAgent(ua) {
    // opted for using reduce here rather than Array#first with a regex.test call
    // this is primarily because using the reduce we only perform the regex
    // execution once rather than once for the test and for the exec again below
    // probably something that needs to be benchmarked though
    return (ua !== '' &&
        userAgentRules.reduce(function (matched, _a) {
            var browser = _a[0], regex = _a[1];
            if (matched) {
                return matched;
            }
            var uaMatch = regex.exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false));
}
function parseUserAgent(ua) {
    var matchedRule = matchUserAgent(ua);
    if (!matchedRule) {
        return null;
    }
    var name = matchedRule[0], match = matchedRule[1];
    if (name === 'searchbot') {
        return new BotInfo();
    }
    // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
    var versionParts = match[1] && match[1].split('.').join('_').split('_').slice(0, 3);
    if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
            versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
        }
    }
    else {
        versionParts = [];
    }
    var version = versionParts.join('.');
    var os = detectOS(ua);
    var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
    if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
    }
    return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
    for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
        var _a = operatingSystemRules[ii], os = _a[0], regex = _a[1];
        var match = regex.exec(ua);
        if (match) {
            return os;
        }
    }
    return null;
}
function getNodeVersion() {
    var isNode = typeof process !== 'undefined' && process.version;
    return isNode ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
    var output = [];
    for (var ii = 0; ii < count; ii++) {
        output.push('0');
    }
    return output;
}

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
var browser$1 = detect();
var logs$1;
var config$1; // Interval Logging Globals

var intervalID;
var intervalType;
var intervalPath;
var intervalTimer;
var intervalCounter;
var intervalLog;
var filterHandler = null;
var mapHandler = null;
/**
 * Assigns a handler to transform logs from their default structure.
 * @param  {Function} callback The handler to invoke when logging.
 */

function setLogMapper(callback) {
  mapHandler = callback;
}
/**
 * Assigns the config and log container to be used by the logging functions.
 * @param  {Array} newLogs   Log container.
 * @param  {Object} newConfig Configuration to use while logging.
 */

function initPackager(newLogs, newConfig) {
  logs$1 = newLogs;
  config$1 = newConfig;
  filterHandler = null;
  mapHandler = null;
  intervalID = null;
  intervalType = null;
  intervalPath = null;
  intervalTimer = null;
  intervalCounter = 0;
  intervalLog = null;
}
/**
 * Transforms the provided HTML event into a log and appends it to the log queue.
 * @param  {Object} e         The event to be logged.
 * @param  {Function} detailFcn The function to extract additional log parameters from the event.
 * @return {boolean}           Whether the event was logged.
 */

function packageLog(e, detailFcn) {
  if (!config$1.on) {
    return false;
  }

  var details = null;

  if (detailFcn) {
    details = detailFcn(e);
  }

  var timeFields = extractTimeFields(e.timeStamp && e.timeStamp > 0 ? config$1.time(e.timeStamp) : Date.now());
  var log = {
    'target': getSelector(e.target),
    'path': buildPath(e),
    'pageUrl': window.location.href,
    'pageTitle': document.title,
    'pageReferrer': document.referrer,
    'browser': detectBrowser(),
    'clientTime': timeFields.milli,
    'microTime': timeFields.micro,
    'location': getLocation(e),
    'scrnRes': getSreenRes(),
    'type': e.type,
    'logType': 'raw',
    'userAction': true,
    'details': details,
    'userId': config$1.userId,
    'toolVersion': config$1.version,
    'toolName': config$1.toolName,
    'useraleVersion': config$1.useraleVersion,
    'sessionID': config$1.sessionID
  };

  if (typeof filterHandler === 'function' && !filterHandler(log)) {
    return false;
  }

  if (typeof mapHandler === 'function') {
    log = mapHandler(log, e);
  }

  logs$1.push(log);
  return true;
}
/**
 * Packages the provided customLog to include standard meta data and appends it to the log queue.
 * @param  {Object} customLog        The behavior to be logged.
 * @param  {Function} detailFcn     The function to extract additional log parameters from the event.
 * @param  {boolean} userAction     Indicates user behavior (true) or system behavior (false)
 * @return {boolean}           Whether the event was logged.
 */

function packageCustomLog(customLog, detailFcn, userAction) {
  if (!config$1.on) {
    return false;
  }

  var details = null;

  if (detailFcn) {
    details = detailFcn();
  }

  var metaData = {
    'pageUrl': window.location.href,
    'pageTitle': document.title,
    'pageReferrer': document.referrer,
    'browser': detectBrowser(),
    'clientTime': Date.now(),
    'scrnRes': getSreenRes(),
    'logType': 'custom',
    'userAction': userAction,
    'details': details,
    'userId': config$1.userId,
    'toolVersion': config$1.version,
    'toolName': config$1.toolName,
    'useraleVersion': config$1.useraleVersion,
    'sessionID': config$1.sessionID
  };
  var log = Object.assign(metaData, customLog);

  if (typeof filterHandler === 'function' && !filterHandler(log)) {
    return false;
  }

  if (typeof mapHandler === 'function') {
    log = mapHandler(log);
  }

  logs$1.push(log);
  return true;
}
/**
 * Extract the millisecond and microsecond portions of a timestamp.
 * @param  {Number} timeStamp The timestamp to split into millisecond and microsecond fields.
 * @return {Object}           An object containing the millisecond
 *                            and microsecond portions of the timestamp.
 */

function extractTimeFields(timeStamp) {
  return {
    milli: Math.floor(timeStamp),
    micro: Number((timeStamp % 1).toFixed(3))
  };
}
/**
 * Track intervals and gather details about it.
 * @param {Object} e
 * @return boolean
 */

function packageIntervalLog(e) {
  var target = getSelector(e.target);
  var path = buildPath(e);
  var type = e.type;
  var timestamp = Math.floor(e.timeStamp && e.timeStamp > 0 ? config$1.time(e.timeStamp) : Date.now()); // Init - this should only happen once on initialization

  if (intervalID == null) {
    intervalID = target;
    intervalType = type;
    intervalPath = path;
    intervalTimer = timestamp;
    intervalCounter = 0;
  }

  if (intervalID !== target || intervalType !== type) {
    // When to create log? On transition end
    // @todo Possible for intervalLog to not be pushed in the event the interval never ends...
    intervalLog = {
      'target': intervalID,
      'path': intervalPath,
      'pageUrl': window.location.href,
      'pageTitle': document.title,
      'pageReferrer': document.referrer,
      'browser': detectBrowser(),
      'count': intervalCounter,
      'duration': timestamp - intervalTimer,
      // microseconds
      'startTime': intervalTimer,
      'endTime': timestamp,
      'type': intervalType,
      'logType': 'interval',
      'targetChange': intervalID !== target,
      'typeChange': intervalType !== type,
      'userAction': false,
      'userId': config$1.userId,
      'toolVersion': config$1.version,
      'toolName': config$1.toolName,
      'useraleVersion': config$1.useraleVersion,
      'sessionID': config$1.sessionID
    };

    if (typeof filterHandler === 'function' && !filterHandler(intervalLog)) {
      return false;
    }

    if (typeof mapHandler === 'function') {
      intervalLog = mapHandler(intervalLog, e);
    }

    logs$1.push(intervalLog); // Reset

    intervalID = target;
    intervalType = type;
    intervalPath = path;
    intervalTimer = timestamp;
    intervalCounter = 0;
  } // Interval is still occuring, just update counter


  if (intervalID == target && intervalType == type) {
    intervalCounter = intervalCounter + 1;
  }

  return true;
}
/**
 * Extracts coordinate information from the event
 * depending on a few browser quirks.
 * @param  {Object} e The event to extract coordinate information from.
 * @return {Object}   An object containing nullable x and y coordinates for the event.
 */

function getLocation(e) {
  if (e.pageX != null) {
    return {
      'x': e.pageX,
      'y': e.pageY
    };
  } else if (e.clientX != null) {
    return {
      'x': document.documentElement.scrollLeft + e.clientX,
      'y': document.documentElement.scrollTop + e.clientY
    };
  } else {
    return {
      'x': null,
      'y': null
    };
  }
}
/**
 * Extracts innerWidth and innerHeight to provide estimates of screen resolution
 * @return {Object} An object containing the innerWidth and InnerHeight
 */

function getSreenRes() {
  return {
    'width': window.innerWidth,
    'height': window.innerHeight
  };
}
/**
 * Builds a string CSS selector from the provided element
 * @param  {HTMLElement} ele The element from which the selector is built.
 * @return {string}     The CSS selector for the element, or Unknown if it can't be determined.
 */

function getSelector(ele) {
  if (ele.localName) {
    return ele.localName + (ele.id ? '#' + ele.id : '') + (ele.className ? '.' + ele.className : '');
  } else if (ele.nodeName) {
    return ele.nodeName + (ele.id ? '#' + ele.id : '') + (ele.className ? '.' + ele.className : '');
  } else if (ele && ele.document && ele.location && ele.alert && ele.setInterval) {
    return "Window";
  } else {
    return "Unknown";
  }
}
/**
 * Builds an array of elements from the provided event target, to the root element.
 * @param  {Object} e Event from which the path should be built.
 * @return {HTMLElement[]}   Array of elements, starting at the event target, ending at the root element.
 */

function buildPath(e) {
  var path = [];

  if (e.path) {
    path = e.path;
  } else {
    var ele = e.target;

    while (ele) {
      path.push(ele);
      ele = ele.parentElement;
    }
  }

  return selectorizePath(path);
}
/**
 * Builds a CSS selector path from the provided list of elements.
 * @param  {HTMLElement[]} path Array of HTMLElements from which the path should be built.
 * @return {string[]}      Array of string CSS selectors.
 */

function selectorizePath(path) {
  var i = 0;
  var pathEle;
  var pathSelectors = [];

  while (pathEle = path[i]) {
    pathSelectors.push(getSelector(pathEle));
    ++i;
  }

  return pathSelectors;
}
function detectBrowser() {
  return {
    'browser': browser$1 ? browser$1.name : '',
    'version': browser$1 ? browser$1.version : ''
  };
}

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
var events;
var bufferBools;
var bufferedEvents; //@todo: Investigate drag events and their behavior

var intervalEvents = ['click', 'focus', 'blur', 'input', 'change', 'mouseover', 'submit'];
var refreshEvents;
var windowEvents = ['load', 'blur', 'focus'];
/**
 * Maps an event to an object containing useful information.
 * @param  {Object} e Event to extract data from
 */

function extractMouseEvent(e) {
  return {
    'clicks': e.detail,
    'ctrl': e.ctrlKey,
    'alt': e.altKey,
    'shift': e.shiftKey,
    'meta': e.metaKey //    'text' : e.target.innerHTML

  };
}
/**
 * Defines the way information is extracted from various events.
 * Also defines which events we will listen to.
 * @param  {Object} config Configuration object to read from.
 */

function defineDetails(config) {
  // Events list
  // Keys are event types
  // Values are functions that return details object if applicable
  events = {
    'click': extractMouseEvent,
    'dblclick': extractMouseEvent,
    'mousedown': extractMouseEvent,
    'mouseup': extractMouseEvent,
    'focus': null,
    'blur': null,
    'input': config.logDetails ? function (e) {
      return {
        'value': e.target.value
      };
    } : null,
    'change': config.logDetails ? function (e) {
      return {
        'value': e.target.value
      };
    } : null,
    'dragstart': null,
    'dragend': null,
    'drag': null,
    'drop': null,
    'keydown': config.logDetails ? function (e) {
      return {
        'key': e.keyCode,
        'ctrl': e.ctrlKey,
        'alt': e.altKey,
        'shift': e.shiftKey,
        'meta': e.metaKey
      };
    } : null,
    'mouseover': null
  };
  bufferBools = {};
  bufferedEvents = {
    'wheel': function wheel(e) {
      return {
        'x': e.deltaX,
        'y': e.deltaY,
        'z': e.deltaZ
      };
    },
    'scroll': function scroll() {
      return {
        'x': window.scrollX,
        'y': window.scrollY
      };
    },
    'resize': function resize() {
      return {
        'width': window.outerWidth,
        'height': window.outerHeight
      };
    }
  };
  refreshEvents = {
    'submit': null
  };
}
/**
 * Hooks the event handlers for each event type of interest.
 * @param  {Object} config Configuration object to use.
 * @return {boolean}        Whether the operation succeeded
 */

function attachHandlers(config) {
  defineDetails(config);
  Object.keys(events).forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      packageLog(e, events[ev]);
    }, true);
  });
  intervalEvents.forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      packageIntervalLog(e);
    }, true);
  });
  Object.keys(bufferedEvents).forEach(function (ev) {
    bufferBools[ev] = true;
    window.addEventListener(ev, function (e) {
      if (bufferBools[ev]) {
        bufferBools[ev] = false;
        packageLog(e, bufferedEvents[ev]);
        setTimeout(function () {
          bufferBools[ev] = true;
        }, config.resolution);
      }
    }, true);
  });
  Object.keys(refreshEvents).forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      packageLog(e, events[ev]);
    }, true);
  });
  windowEvents.forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      packageLog(e, function () {
        return {
          'window': true
        };
      });
    }, true);
  });
  return true;
}

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
var sendIntervalId = null;
/**
 * Initializes the log queue processors.
 * @param  {Array} logs   Array of logs to append to.
 * @param  {Object} config Configuration object to use when logging.
 */

function initSender(logs, config) {
  if (sendIntervalId !== null) {
    clearInterval(sendIntervalId);
  }

  sendIntervalId = sendOnInterval(logs, config);
  sendOnClose(logs, config);
}
/**
 * Checks the provided log array on an interval, flushing the logs
 * if the queue has reached the threshold specified by the provided config.
 * @param  {Array} logs   Array of logs to read from.
 * @param  {Object} config Configuration object to be read from.
 * @return {Number}        The newly created interval id.
 */

function sendOnInterval(logs, config) {
  return setInterval(function () {
    if (!config.on) {
      return;
    }

    if (logs.length >= config.logCountThreshold) {
      sendLogs(logs.slice(0), config, 0); // Send a copy

      logs.splice(0); // Clear array reference (no reassignment)
    }
  }, config.transmitInterval);
}
/**
 * Attempts to flush the remaining logs when the window is closed.
 * @param  {Array} logs   Array of logs to be flushed.
 * @param  {Object} config Configuration object to be read from.
 */

function sendOnClose(logs, config) {
  window.addEventListener('pagehide', function () {
    if (logs.length > 0) {
      navigator.sendBeacon(config.url, JSON.stringify(logs));
      logs.splice(0); // clear log queue
    }
  });
}
/**
 * Sends the provided array of logs to the specified url,
 * retrying the request up to the specified number of retries.
 * @param  {Array} logs    Array of logs to send.
 * @param  {string} config     configuration parameters (e.g., to extract URL from & send the POST request to).
 * @param  {Number} retries Maximum number of attempts to send the logs.
 */
// @todo expose config object to sendLogs replate url with config.url

function sendLogs(logs, config, retries) {
  var req = new XMLHttpRequest(); // @todo setRequestHeader for Auth

  var data = JSON.stringify(logs);
  req.open('POST', config.url);

  if (config.authHeader) {
    req.setRequestHeader('Authorization', config.authHeader);
  }

  req.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status !== 200) {
      if (retries > 0) {
        sendLogs(logs, config, retries--);
      }
    }
  };

  req.send(data);
}

var config = {};
var logs = [];
var startLoadTimestamp = Date.now();
var endLoadTimestamp;

window.onload = function () {
  endLoadTimestamp = Date.now();
};

var started = false;

config.on = false;
config.useraleVersion = version;
configure(config, getInitialSettings());
initPackager(logs, config);

if (config.autostart) {
  setup(config);
}
/**
 * Hooks the global event listener, and starts up the
 * logging interval.
 * @param  {Object} config Configuration settings for the logger
 */


function setup(config) {
  if (!started) {
    setTimeout(function () {
      var state = document.readyState;

      if (config.autostart && (state === 'interactive' || state === 'complete')) {
        attachHandlers(config);
        initSender(logs, config);
        started = config.on = true;
        packageCustomLog({
          type: 'load',
          logType: 'raw',
          pageLoadTime: endLoadTimestamp - startLoadTimestamp
        }, function () {}, false);
      } else {
        setup(config);
      }
    }, 100);
  }
} // Export the Userale API
/**
 * Updates the current configuration
 * object with the provided values.
 * @param  {Object} newConfig The configuration options to use.
 * @return {Object}           Returns the updated configuration.
 */

function options(newConfig) {
  if (newConfig !== undefined) {
    configure(config, newConfig);
  }

  return config;
}

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
// the 'chrome' global instead. Let's map it to browser so we don't have
// to have if-conditions all over the place.

var browser = browser || chrome; // creates a Future for retrieval of the named keys
// the value specified is the default value if one doesn't exist in the storage

browser.storage.local.get({
  sessionId: null,
  userAleHost: userAleHost,
  userAleScript: userAleScript,
  toolUser: toolUser,
  toolName: toolName,
  toolVersion: toolVersion
}, storeCallback);

function storeCallback(item) {
  injectScript({
    url: item.userAleHost,
    userId: item.toolUser,
    sessionID: item.sessionId,
    toolName: item.toolName,
    toolVersion: item.toolVersion
  });
}

function queueLog(log) {
  browser.runtime.sendMessage({
    type: ADD_LOG,
    payload: log
  });
}

function injectScript(config) {
  options(config); //  start();  not necessary given that autostart in place, and option is masked from WebExt users

  setLogMapper(function (log) {
    queueLog(Object.assign({}, log, {
      pageUrl: document.location.href
    }));
    console.log(log);
    return false;
  });
}

browser.runtime.onMessage.addListener(function (message) {
  if (message.type === CONFIG_CHANGE) {
    options({
      url: message.payload.userAleHost,
      userId: message.payload.toolUser,
      toolName: message.payload.toolName,
      toolVersion: message.payload.toolVersion
    });
  }
});
/*
 eslint-enable
 */
//Add additional custom scripts below this line
//=============================================
