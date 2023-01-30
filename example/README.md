# The UserALE.js Example Utility

This directory provides 
 * example usage for UserALE.js deployed as a **script tag** within a simple HTML Webpage;
 * a testing utility for developers to evaluate UserALE modifications to logged events;
 * a means of viewing log event structure within a simple UserALE logging server;
 * a means of testing UserALE.js API functions within a simple HTML Webpage. 

If you are interested in examples for a **module** deployment methodology, see the README in the [/webpack examples directory](https://github.com/apache/incubator-flagon-useralejs/tree/master/example/webpackUserAleExample). For details about our web extension, see 
our [UserALE.js WebExtension documentation](https://github.com/apache/incubator-flagon-useralejs/tree/master/src/UserALEWebExtension).

## Prerequisites

Ensure that you have [node.js](https://nodejs.org/) installed.

You will need to clone the [UserALE.js repository](https://github.com/apache/incubator-flagon-useralejs) and follow [Installation directions](https://github.com/apache/incubator-flagon-useralejs#installation).

## Using the Example Page 

This Example Page is a simple HTML Webpage with UserALE.js included as a **script tag**. 

To generate UserALE.js logs with the Example Page, you may need to modify the 'src' HTML5 parameter of the UserALE.js script tag.

The `src` parameter should reference the file path to your version of the minified UserALE.js script, in the /build dir of your cloned `incubator-flagon-useralejs` repository or `flagon-userale` node module. See the snippet below.

```
  <script
    src="../build/userale-2.2.0.min.js" #works out of the box if downloaded flagon-userale via npm
    data-url="http://localhost:8000/"
    data-user="example-user"
    data-version="2.2.0"
    data-tool="Apache UserALE.js Example"
  ></script>
```
Once you've modified the script tag `src` field, save `index.html`.

Next open index.html in your browser (you can drag it directly into a tab or double-click it). 

You will see a very simple HTML Webpage with a few interactive features.

On this page, all user events will be captured and sent to the logging server. See instructions below.

## Testing with the Example Page

The UserALE.js Example page can be used to test the structure of logs after instrumentation or UserALE.js src code modification. It can also be used to experiment with UserALE.js API functions.

In order to experiment with various elements of the UserALE.js API, simply modify the well documented API examples in `index.js`. Details about the API can be found at the [UserALE.js parent README](https://github.com/apache/incubator-flagon-useralejs/tree/FLAGON-469). However, a complete list of exported functions in the API can be found below: 

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

NOTE: Each modification of `index.html` or `index.js` will require that you both save the modifications and refresh the webpage in your browser.

See the [Flagon website](http://flagon.incubator.apache.org/) for additional documentation on the [API](http://flagon.incubator.apache.org/docs/useralejs/API/) and [testing for scale](http://flagon.incubator.apache.org/docs/stack/scaling/).

## Capturing Logs Using the Logging Server

The example logging server receives log from any UserALE.js instrumented page at `localhost:8000`.

This means you can test logs from your own instrumented application, the [UserALE.js WebExtension](https://github.com/apache/incubator-flagon-useralejs/tree/master/src/UserALEWebExtension), 
or the UserALE.js Example Page, so long as the `data-url` parameter is set to `localhost:8000`. This is the default setting for both the WebExtension and UserALE.js Example Page. See the example above.

Once your UserALE.js script tag is properly configured to point to a minified UserALE.js script, and `localhost:8000`, you can log to the Example Logging Server.

from the `/example` directory or its parent directory, run the following:

```
$npm run example:watch
```

Once started you will see:

```
> flagon-userale@2.2.0 example:watch ...
> nodemon -w ./example example/server.js

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: ...
[nodemon] starting `node example/server.js`
UserAle Local running on port 8000
```

Then start using your instrumented application, browser, or the UserALE.js Example Page, and you will see logs propagating in the terminal:

```

[ { target: 'body',
    path: [ 'body', 'html' ],
    clientTime: 1504287557492,
    location: { x: 0, y: 0 },
    type: 'keydown',
    userAction: true,
    details: null,
    userId: 'example-user',
    toolVersion: '2.2.0',
    toolName: 'Apache UserALE.js Example',
    useraleVersion: '2.2.0' },
 ...
]
```

Kill the logging script with `^C` or as you would any bash script.

##Reviewing Logs Collected with the Example Server

In addition to showing in your terminal, logs collected by the UserALE.js Example Server are written locally to file. 

Find them in `/logs` under the top level flagon-userale dir. A new log file will appear each time you restart the logging server.

## Contributing

Contributions are welcome!  Simply [submit an issue](https://github.com/apache/incubator-flagon-useralejs/issues) for problems you encounter or submit a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate it into UserALE.js.