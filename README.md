# Apache Flagon UserALE.js (Incubating)

[![Build Status](https://builds.apache.org/job/useralejs-ci/badge/icon?style=plastic)](https://builds.apache.org/job/useralejs-ci?)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The official JavaScript client for [Apache Flagon UserALE](https://github.com/apache/incubator-flagon-userale).  

UserALE.js is a client side instrumentation library written in JavaScript. It is designed to be an easy-to-use, lightweight, and dependency-free way to quickly gather logs from your web applications.

Additional documentation can be found at our [project website](http://flagon.incubator.apache.org/userale/).

## Prerequsites

To build UserALE.js, you will need to download our source (here), our [release distributions](http://flagon.incubator.apache.org/releases/) or include in your project via the [flagon-userale NPM module](https://www.npmjs.com/package/flagon-userale).

UserALE.js utilizes NPM for package and dependency management. Execute the following to install dependencies.
```
#install required packages
npm install

#review major dependencies
npm ls --depth=0
```

Pre-tested and pre-built UserALE.js script are included in the [/build dir](https://github.com/apache/incubator-flagon-useralejs/tree/master/build) in our repositories, release artifiacts, and our [NPM module](https://www.npmjs.com/package/flagon-userale). However, you can modify and build your own versions of these scripts with the following steps:

## Build

To build UserALE.js:

```
#Build UserALE.js
npm run build
```

## Test

To test UserALE.js:
```
#Run UserALE.js unit tests
npm run test
```
... you'll see something like:
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
Any failing tests will also be logged in the terminal. If there are failing tests, please consider [logging an issue in JIRA](https://issues.apache.org/jira/projects/FLAGON).

## Use and Configure

To start logging with UserALE.js, you can either include our script in the web application to be logged, or use our [WebExtension](https://github.com/apache/incubator-flagon-useralejs/tree/master/src/UserALEWebExtension) to gather logs across any page a user visits.

To collect logs from a specific project, simply include this script tag on the page:

```html
<script src="/path/to/userale-2.0.0.min.js"></script>
```
UserALE.js is designed to be easily configured to fit your use case. We use HTML data parameters to pass configuration options to the library. For example, to set the logging URL:

```html
<script src="/path/to/userale-2.0.0.min.js" data-url="http://yourLoggingUrl"></script>
```

The complete list of configurable options is:

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

If you're interested in using our WebExtension to log user activity across all pages they visit, check out our browser specific instructions [here](https://github.com/apache/incubator-flagon-useralejs/blob/FLAGON-336/src/UserALEWebExtension/README.md).

You can also test out UserALE.js behavior with different script tag parameters using our ['example' test utility](https://github.com/apache/incubator-flagon-useralejs/tree/master/example).

## Customizing your logs

For some applications, it may be desirable to filter logs based on some runtime parameters or to enhance the logs with information available to the app. To support this use-case, there is an API exposed against the global UserALE object.

The [flagon-useralejs NPM module](https://www.npmjs.com/package/flagon-userale) exposes UserALE.js functions for use in the NPM environment. However, this API is a cleaner, more intuitive way of modifying UserALE.js behavior to suite your needs.

The two functions exposed are the `setLogFilter` and `setLogMapper` functions. These allow dynamic modifications to the logs at runtime, but before they are shipped to the server.

Here is an example of a filter that bounces out unwanted log and event types from your logging stream:
```html
<html>
  <head>
    <script src="/path/to/userale-2.0.0.min.js" data-url="http://yourLoggingUrl"></script>
<!--
Modify the array page-by-page to curate your log stream:
by adding unwanted event 'types' in type_array;
by adding unwanted log classes to eliminate 'raw' or 'interval' logs from your stream.
-->
  <script type="text/javascript">
    var type_array = ['mouseup', 'mouseover', 'dblclick', 'blur', 'focus']
    var logType_array = ['interval']
    window.userale.filter(function (log) {
      return !type_array.includes(log.type) && !logType_array.includes(log.logType);
    });
  </script>
  <body>
    <div id="app">
      <!-- application goes here -->
    </div>
  </body>
</html>
```

Here is an example of a mapping function that adds customizable labels to events detected on specific DOM elements:
```html
    <script type="text/javascript">
      window.userale.map(function (log) {
        var targetsForLabels = ["button#test_button"];
        if (targetsForLabels.includes(log.target)) {
            return Object.assign({}, log, { CustomLabel: "Click me!" });
        } else {
            return log;  
        } 
      });
    </script>
```

Even with this small API, it is possible to compose very powerful logging capabilities and progressively append additionally app-specific logic to your logs.

You can experiment with these functions in our [example test utility](https://github.com/apache/incubator-flagon-useralejs/tree/master/example).

## Contributing

Contributions are welcome!  Simply [submit an issue report](https://issues.apache.org/jira/browse/FLAGON) for problems you encounter or a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate it into UserALE.js. If you want to become a contributor to the project, see our [contribution guide](http://flagon.incubator.apache.org/docs/contributing/). 

Join the conversation: tell us your needs, wishes, and interests by joining our [mailing list](dev-subscribe@flagon.incubator.apache.org)!

## License

Apache Flagon UserALE.js is provided under Apache License version 2.0. See LICENSE and NOTICE files at MASTER for more details.