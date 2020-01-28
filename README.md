# Apache Flagon UserALE.js (Incubating)

[![Build Status](https://builds.apache.org/job/useralejs-ci/badge/icon?style=flat)](https://builds.apache.org/job/useralejs-ci?)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/flagon-userale)
![Maintenance](https://img.shields.io/maintenance/yes/2020)
![npm](https://img.shields.io/npm/v/flagon-userale)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

Apache UserALE.js is part of the [Apache Flagon Project](http://flagon.incubator.apache.org/). It is a client side instrumentation library written in JavaScript designed for easy deployment and lightweight configuration in gathering logs from your web applications for user behavioral analytics.

Once included in your project, Apache UserALE.js provides a comprehensive behavioral logging capability, capturing every event on every element rendered in your DOM.

Additional documentation and a demonstration can be found at the [Apache Flagon website](http://flagon.incubator.apache.org/userale/).

### Table of Contents
[What's New](https://github.com/apache/incubator-flagon-useralejs#whats-new-in-version-202)  
[Installation](https://github.com/apache/incubator-flagon-useralejs#installation)  
[Configure](https://github.com/apache/incubator-flagon-useralejs#configure)  
[Usage](https://github.com/apache/incubator-flagon-useralejs#usage)  
[Examples](https://github.com/apache/incubator-flagon-useralejs#examples)  
[Indexing and Storage](https://github.com/apache/indexing-and-storage)
[Modifying Source](https://github.com/apache/incubator-flagon-useralejs#modifying-source)   
[Contributing](https://github.com/apache/incubator-flagon-useralejs#contributing)  
[License](https://github.com/apache/incubator-flagon-useralejs#license)

## What's New in Version 2.1.0?

- Module package-bundler deployment support (include UserALE.js via 'import' & 'require')
- Updated existing example page to include a range of HTML elements
- New example page for including UserALE.js as a module (Webpack example)
- Added support for logging from HTML Forms
- Added SessionId persistence via SessionStorage
- Exposes a wide range of functions to support custom logging with UserALE.js
- Added support for passing Auth-headers via log pipeline to back-end
- Added additional log fields: browser type and version, inner width/height (for heatmaps)

See our [CHANGELOG](https://github.com/apache/incubator-flagon-useralejs/blob/master/CHANGELOG.md) for a complete list of changes.

## Installation

Either through cloning our [source repo](https://github.com/apache/incubator-flagon-useralejs) or by using npm:

```html
npm install flagon-userale
```

To include UserALE.js in your project, include as a `module`:

```html
import * as userale from 'flagon-userale';

or

const userale = require('flagon-userale');
```

You can also include UserALE.js as a `script-tag`. A pre-built version of the userale script is included in our package and
repositories:

```html
<script src="./node_modules/flagon-userale/build/userale-2.1.0.min.js"></script>
```

If you include UserALE.js as a `script-tag`, consider installing via npm as a development dependency, instead:

```html
npm install --save-dev flagon-userale
```

We also support a [WebExtension](https://github.com/apache/incubator-flagon-useralejs/tree/master/src/UserALEWebExtension) that can be added to your browser in developer mode. Follow the link for instructions.

## Configure

Some configuration is necessary. At minimum you will need to provide UserALE.js an end-point to ship logs to; default behavior is to ship logs to `localhost:8000`.

**NOTE**: In order to facilitate testing configuration and usage of UserALE.js, we have included an [example logging server](https://github.com/apache/incubator-flagon-useralejs/tree/master/example#capturing-logs-using-the-logging-server) in our 
[example directory](https://github.com/apache/incubator-flagon-useralejs/tree/master/example). This is a very helpful utility
that works with both included [module examples](https://github.com/apache/incubator-flagon-useralejs/tree/master/example/webpackUserAleExample)
and [script-tag examples](https://github.com/apache/incubator-flagon-useralejs/tree/master/example). We strongly recommend experimenting with it.

Configuration details follow:

If you have included UserALE.js in your project as a `module`, you will need to use our 'userale.options' function, which exposes library configuration options through our API:

```html
const changeMe = "me";
userale.options({
    "userId": changeMe,
    "url": "http://localhost:8000/",
    "version": "next",
    "logDetails": false,
    "sessionID": "this one"
});
```

The complete list of configurable parameters that can be configured via 'userale.options' is:

| Param | Description | Default |
|---|---|---|
| url | Logging URL | http://localhost:8000 |
| autostart | Should UserALE.js start on page load | true |
| transmitInterval | Delay between transmit checks | 5000 (ms) |
| logCountThreshold | Minimum number of logs to send | 5 |
| userId | User identifier | null |
| sessionID | Session identifier | null |
| version | Application version identifier | null |
| logDetails | Toggle detailed logs (keys pressed and input/change values) | false |
| resolution | Delay between instances of high frequency logs (mouseover, scroll, etc.) | 500 (ms) |
| userFromParams | Query param in the page URL to fetch userId from | null |
| toolName | Name of tool being logged | null |
| authHeader | Authorization header to be passed to logging endpoint | null |

If you have included UserALE.js as a `script-tag` in your project, you can use HTML data parameters to pass configuration options to the library through the script tag. For example:

```html
  <script
          src="./node_modules/flagon-userale/build/userale-2.1.0.min.js"
          data-url="http://localhost:8000/"
          data-user="example-user"
          data-version="2.1.0"
          data-tool="Apache UserALE.js Example"
  ></script>
```

You have access to the same parameters listed above, however, naming conventions vary slightly for use in HTML:

| Param | Description | Default |
|---|---|---|
| data-url | Logging URL | http://localhost:8000 |
| data-autostart | Should UserALE.js start on page load | true |
| data-interval | Delay between transmit checks | 5000 (ms) |
| data-threshold | Minimum number of logs to send | 5 |
| data-user | User identifier | null |
| data-version | Application version identifier | null |
| data-log-details | Toggle detailed logs (keys pressed and input/change values) | false |
| data-resolution | Delay between instances of high frequency logs (mouseover, scroll, etc.) | 500 (ms) |
| data-user-from-params | Query param in the page URL to fetch userId from | null |
| data-tool | Name of tool being logged | null |
| data-auth | Authorization header to be passed to logging endpoint | null |

If you are using our [WebExtension](https://github.com/apache/incubator-flagon-useralejs/tree/master/src/UserALEWebExtension),
you can modify some of these parameters via the extensions' 'options' page.

## Usage

Including UserALE.js in your project as a `module` attaches the UserALE.js script as an object to the page.

We have exposed a number of functions that assist you in modifying, filtering, and customizing logs 

A complete list of available functions are as follows:

| Function | Description | Notes |
|---|---|---|
| userale.options | modify userale's configuration option | see top level README for complete list of options |
| userale.filter | filters out logs from logging queue by keys or values | filters are callbacks with global scope |
| userale.map | modify/add log keys or values | mappings are callbacks with global scope |
| userale.log | appends a custom log to the log queue | the custom log object is an object key:value pairs |
| userale.packageLog | transforms the provided event into a log and appends it to the log queue | designed for HTML events |
| userale.packageCustomLog | packages the provided customLog to include standard meta data and appends it to the log queue | designed for non HTML events| 
| userale.details | defines the way information is extracted from various events | supports packageLog/packageCustomLog 'details' |
| userale.getSelector | builds a string CSS selector from the provided HTML element id | populates 'target' field in packaged logs |
| userale.buildPath| builds an array of elements from the provided event target, to the root element (DOM path) | populates the 'path' field in packaged logs |
| userale.start | used to start the logging process if | unecessary if 'autostart' is set to true in initial setting (default) |
| userale.stop | halts the logging process. Logs will no longer be sent | will need to invoke userale.start to restart logging |

Including UserALE.js as a `script-tag` provides you access to the same functions listed above. However, UserALE.js essentially 
becomes a property of the DOM. As such, you'll need to call functions as a window property:

```html
userale.options = window.userale.options
```

## Examples

We provide a number of examples to illustrate how the [functions above](https://github.com/apache/incubator-flagon-useralejs#usage) 
can be used with sample webpages and logging servers. These are tailored for [module examples](https://github.com/apache/incubator-flagon-useralejs/tree/master/example/webpackUserAleExample)
and [script-tag examples](https://github.com/apache/incubator-flagon-useralejs/tree/master/example).
Select examples are below:

Filter your logs with `userale.filter`:

```html
userale.filter(function (log) {
    var type_array = ['mouseup', 'mouseover', 'mousedown', 'keydown', 'dblclick', 'blur', 'focus', 'input', 'wheel'];
    var logType_array = ['interval'];
    return !type_array.includes(log.type) && !logType_array.includes(log.logType);
});
```

Modify (add/remove) log fields with surgical precision using `userale.map`:

```html
userale.map(function (log) {
        var targetsForLabels = ["button#test_button"];
        if (targetsForLabels.includes(log.target)) {
            return Object.assign({}, log, { CustomLabel: "Click me!" });
        } else {
            return log;  
        } 
      });
```

Generate custom logs with `userale.log`:

```html
document.addEventListener('change', function(e) {
    if (e.target.value === 'log') {
        userale.log({
            target: userale.getSelector(e.target),
            path: userale.buildPath(e),
            type: e.type,
            logType: 'custom',
            userAction: false,
            details: 'I can make this log look like anything I want',
            customField1: 'foo',
            customField2: 'bar',
            userId: userale.options().userId,
            toolVersion: userale.options().version,
            toolName: userale.options().toolName,
            useraleVersion: userale.options().useraleVersion,
            sessionID: userale.options().sessionID,
            customLabel: "(custom) Log Example"
        });
    }
});
```

User our own log packaging pipeline to streamline custom HTML event logging with `userale.packageLog`:

```html
document.addEventListener('change', function(e){
    if (e.target.value === 'packageLog') {
        /**You can then use the 'Mapping' API function to modify custom logs created with the packageLog function*/
        userale.map(function (log) {
            var targetsForLabels = ['change'];
            if (targetsForLabels.includes(log.type)) {
                return Object.assign({}, log, { logType: 'custom', customLabel: 'packageLog Example' });
            } else {
                return log;
            }
        });
        /**You can also use the details function to package additional log meta data, or add custom details*/
        userale.packageLog(e, userale.details(userale.options(),'change'));
    } else {
        return false
    }
});
``` 

Again, see [Usage](https://github.com/apache/incubator-flagon-useralejs#usage) for differences in invoking these functions with `module` and `script-tag` includes.

You can find additional examples on our [website](http://flagon.incubator.apache.org/docs/useralejs/API/).

## Indexing and Storing Logs

We recommend Elastic products, specifically an [ELK cluster](https://github.com/apache/incubator-flagon-useralejs#examples), for indexing and storing logs in productions. 

You can find a 'sand-box' ELK build, configuration files, and visualization/dashboards tailored for UserALE.js in the [Apache Flagon parent repository](https://github.com/apache/incubator-flagon/tree/master/docker).

We also provide some documentation about stack-considerations on our [project website](http://flagon.incubator.apache.org/docs/stack/).

## Modifying Source

You may wish to modify UserALE.js to suite your needs. After making modification to [UserALE.js src](https://github.com/apache/incubator-flagon-useralejs/tree/master/src),
you will need to rebuild the UserALE.js script (and run tests).

To (re)build UserALE.js:

```
npm run build
```

To run UserALE.js unit tests:
```
npm run test
```

We use gulp-mocha for unit tests. The results will print to your terminal:
```
...
    attachHandlers
    ✓ attaches all the event handlers without duplicates
    ✓ debounces bufferedEvents (505ms)
    defineDetails
      - configures high detail events correctly
...

  45 passing (954ms)
  1 pending
```
Any failing tests will also be logged in the terminal. If there are failing tests, please consider [submitting an issue report via JIRA](https://issues.apache.org/jira/browse/FLAGON) or adding a note [in GitHub](https://github.com/apache/incubator-flagon-useralejs/projects/1).


## Contributing

Contributions are welcome!  Simply [submit an issue report via JIRA](https://issues.apache.org/jira/browse/FLAGON) or adding a note [in GitHub](https://github.com/apache/incubator-flagon-useralejs/projects/1) for problems you encounter. Pull requests are welcome.  The core team will review it and work with you to incorporate it into UserALE.js. If you want to become a contributor to the project, see our [contribution guide](http://flagon.incubator.apache.org/docs/contributing/). 

Join the conversation: tell us your needs, wishes, and interests by joining our [mailing list](dev-subscribe@flagon.incubator.apache.org)!

## License

Apache Flagon UserALE.js is provided under Apache License version 2.0. See LICENSE and NOTICE files at MASTER for more details.