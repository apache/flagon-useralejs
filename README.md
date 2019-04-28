# Apache Flagon UserALE.js (Incubating)

[![Build Status](https://builds.apache.org/job/useralejs-ci/badge/icon?style=plastic)](https://builds.apache.org/job/useralejs-ci?)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The official JavaScript client for [Apache Flagon UserALE](https://github.com/apache/incubator-flagon-userale).  

UserALE.js is a client side instrumentation library written in JavaScript. It is designed to be an easy-to-use, lightweight, and dependency-free way to quickly gather logs from your web applications.

Additional documentation can be found at our [project website](http://flagon.incubator.apache.org/userale/).

## Prerequsites

To build UserALE.js, you will need to install [NPM and Node.js](https://nodejs.org/).

UserALE.js utilizes NPM for package and dependency management. Execute the following to install dependencies.
```
#install required packages
npm install

#review major dependencies
npm ls --depth=0
```

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

  configure
    ✓ merges new configs into main config object
    ✓ includes a userid if present in the window.location
    getUserIdFromParams
      ✓ fetches userId from URL params
      ✓ returns null if no matching param

  getInitialSettings
    timeStampScale
      ✓ no event.timestamp
      ✓ zero
      ✓ epoch milliseconds
      ✓ epoch microseconds
      ✓ performance navigation time
    getInitialSettings
      ✓ fetches all settings from a script tag (122ms)
      ✓ grabs user id from params

  Userale API
    ✓ provides configs
    ✓ edits configs
    ✓ starts + stops (214ms)
    ✓ sends custom logs

  packageLogs
    setLogFilter
      ✓ assigns the handler to the provided value
      ✓ allows the handler to be nulled
    setLogMapper
      ✓ assigns the handler to the provided value
      ✓ allows the handler to be nulled
    packageLog
      ✓ only executes if on
      ✓ calls detailFcn with the event as an argument if provided
      ✓ packages logs
      ✓ filters logs when a handler is assigned and returns false
      ✓ assigns logs to the mapper's return value if a handler is assigned
      ✓ does not call the map handler if the log is filtered out
      ✓ does not attempt to call a non-function filter/mapper
    extractTimeFields
      ✓ returns the millisecond and microsecond portions of a timestamp
      ✓ sets micro to 0 when no decimal is present
      ✓ always returns an object
    getLocation
      ✓ returns event page location
      ✓ calculates page location if unavailable
      ✓ fails to null
    selectorizePath
      ✓ returns a new array of the same length provided
    getSelector
      ✓ builds a selector
      ✓ identifies window
      ✓ handles a non-null unknown value
    buildPath
      ✓ builds a path
      ✓ defaults to path if available

  sendLogs
    ✓ sends logs on an interval
    ✓ does not send logs if the config is off
    ✓ sends logs on page exit with navigator
    ✓ sends logs on page exit without navigator
    ✓ does not send logs on page exit if config is off


  45 passing (954ms)
  1 pending
```
Any failing tests will also be logged in the terminal. If there are failing tests, please consider [logging an issue in JIRA](https://issues.apache.org/jira/projects/FLAGON).

## Use and Configure

To start logging with UserALE.js, you can either include our script in the web application to be logged, or use our WebExtension to gather logs across any page a user visits.

To instrument a specific project, simply include this script tag on the page:

```html
<script src="/path/to/userale-1.0.0.min.js"></script>
```
UserALE.js is designed to be easily configured to fit your use case. We use HTML data parameters to pass configuration options to the library. For example, to set the logging URL:

```html
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

If you're interested in using our WebExtension to log user activity across all pages they visit, check out our browser specific instructions [here](https://github.com/apache/incubator-flagon-useralejs/blob/FLAGON-336/src/UserALEWebExtension/README.md).

## Customizing your logs

For some applications, it may be desirable to filter logs based on some runtime parameters or to enhance the logs with information available to the app. To support this use-case, there is an API exposed against the global UserALE object.

The two functions exposed are the `setLogFilter` and `setLogMapper` functions. These allow dynamic modifications to the logs at runtime, but before they are shipped to the server.

Here is an example of a filter that only keeps every second log (odd-even):
```html
<html>
  <head>
    <script src="/path/to/userale-1.0.0.min.js" data-url="http://yourLoggingUrl"></script>

    <script type="text/javascript">
      var logCounter = 0;
      window.userale.filter(function (log) {
        return (logCounter++ % 2);
      });
    </script>
  </head>
  <body>
    <div id="app">
      <!-- application goes here -->
    </div>
  </body>
</html>
```

Here is an example of a mapping function that adds runtime information about the current "score":
```html
<html>
  <head>
    <script src="/path/to/userale-1.0.0.min.js" data-url="http://yourLoggingUrl"></script>
  </head>
  <body>
    <div id="app">
      <button id="increment">+</button>
      <button id="decrement">-</button>
      <div id="scoreboard"></div>
    </div>

    <script type="text/javascript">
      var score = 0;
      var scoreBoard = document.getElementById('scoreboard');
      scoreBoard.innerText = '0';

      function setScore(nextScore) {
        score = nextScore;
        scoreBoard.innerText = String(score);
      }

      document.getElementById('increment').addEventListener('click', function () {
        setScore(score + 1);
      });

      document.getElementById('decrement').addEventListener('click', function () {
        if (score) {
          setScore(score - 1);
        }
      });

      window.userale.map(function (log) {
        return Object.assign({}, log, { score: score }); // Add the "score" property to the log
      });
    </script>
  </body>
</html>
```

Even with this small API, it is possible to compose very powerful logging capabilities and progressively append additionally app-specific logic to your logs.

## Next Up

Our top priority is to improve the testing system and to complete test coverage.  After that is complete:

- Use web workers to remove load from main thread if available
- Update the example server to present a simple test app/interface
- Release UserALE.js through channels like NPM, Bower, etc.

## Contributing

Contributions are welcome!  Simply [submit an issue report](https://issues.apache.org/jira/browse/FLAGON) for problems you encounter or a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate it into UserALE.js.

## License

Apache Flagon UserALE.js is provided under Apache License version 2.0. See LICENSE and NOTICE files at MASTER for more details.