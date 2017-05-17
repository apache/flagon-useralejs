# UserALE.js

[![Build Status](https://builds.apache.org/job/useralejs-ci/badge/icon?style=plastic)](https://builds.apache.org/job/useralejs-ci?)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The official JavaScript client for UserAle.  

Additional documentation can be found at http://draperlaboratory.github.io/useralejs/

## Use and Configure

To include Userale.js in your project:

```
<script src="http://draperlaboratory.github.io/useralejs/userale.min.js"></script>
```

HTML5 Data Parameters are used to configure Userale.js.  For example, to set the logging URL:

```
<script src="userale.js" data-url="http://yourLoggingUrl"></script>
```

The complete list of configurable options is:

| Param | Description | Default |
|---|---|---|
| data-url | Logging URL | http://localhost:8000 |
| data-autostart | Should Userale.js start on page load | true |
| data-interval | Delay between transmit checks | 5000 (ms) |
| data-threshold | Minimum number of logs to send | 5 |
| data-user | User identifier | null |
| data-version | Application version identifier | null |
| data-log-details | Toggle detailed logs (keys pressed and input/change values) | false |
| data-resolution | Delay between instances of high frequency logs (mouseover, scroll, etc.) | 500 (ms) |
| data-user-from-params | Query param in the page URL to fetch userId from | null |
| data-tool | Name of tool being logged | null |

## Next Up

Our top priority is to improve the testing system and to complete test coverage.  After that is complete:

- Use web workers to remove load from main thread if available
- Update the example server to present a simple test app/interface
- Release Userale.js through channels like NPM, Bower, etc.  

## Contributing

Contributions are welcome!  Simply submit an issue report for problems you encounter or a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate it into Userale.js.  

## License

Copyright 2016 The Charles Stark Draper Laboratory, Inc.

Userale.js is released under the Apache v2.0 License.  See the LICENSE file for more information.  
