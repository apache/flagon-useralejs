# UserALE.js

[![Build Status](https://builds.apache.org/job/useralejs-ci/badge/icon?style=plastic)](https://builds.apache.org/job/useralejs-ci?)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The official JavaScript client for UserAle.  

UserALE.js is a client side instrumentation library written in JavaScript. It is designed to be an easy-to-use, lightweight, and dependency-free way to quickly gather logs from your web applications.

Additional documentation can be found at http://senssoft.incubator.apache.org/userale/

## Build

To build UserALE.js:

```
npm run build
```

## Use and Configure

To start logging with UserALE.js, you can either include our script in the web application to be logged, or use our WebExtension to gather logs across any page a user visits.

To instrument a specific project, simply include this script tag on the page:

```
<script src="/path/to/userale-1.0.0.min.js"></script>
```
UserALE.js is designed to be easily configured to fit your use case. We use HTML data parameters to pass configuration options to the library. For example, to set the logging URL:

```
<script src="/path/to/userale-1.0.0.min.js" data-url="http://yourLoggingUrl"></script>
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

If you're interested in using our WebExtension to log user activity across all pages they visit, check out our browser specific instructions [here](https://github.com/apache/incubator-senssoft-useralejs/blob/SENSSOFT-192/src/UserALEWebExtension/README.md).

## Next Up

Our top priority is to improve the testing system and to complete test coverage.  After that is complete:

- Use web workers to remove load from main thread if available
- Update the example server to present a simple test app/interface
- Release UserALE.js through channels like NPM, Bower, etc.

## Contributing

Contributions are welcome!  Simply submit an issue report for problems you encounter or a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate it into UserALE.js.

## License

Copyright © 2017 The Apache Software Foundation, Licensed under the Apache License, Version 2.0. Software as a Sensor is a trademark of the Charles Stark Draper Laboratory, Inc.