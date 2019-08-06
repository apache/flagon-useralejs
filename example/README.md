# This UserALE.js Example Utility

This directory provides 
 * example usage for UserALE.js within a simple HTML Webpage;
 * a testing utility for developers to evaluate UserALE modifications to logged events;
 * a means of viewing log event structure within a simple UserALE logging server;
 * a means of testing UserALE.js API functions within a simple HTML Webpage. 

## Prerequisites

Ensure that you have [node.js](https://nodejs.org/) installed.

You will need to clone the [UserALE.js repository](https://github.com/apache/incubator-flagon-useralejs) and install npm dev dependencies to run the Example Utility.

Please see the [Prerequsites](https://github.com/apache/incubator-flagon-useralejs#prerequsites) for additional details.

## Using the Example Page 

The UserALE.js Example Page is a simple HTML Webpage with a simple DOM, including a single button. 

To generate UserALE.js logs with the Example Page, you will need to modify the 'src' HTML5 parameter of the UserALE.js script tag.

The `src` parameter should reference the complete file path to your version of the minified UserALE.js script (userale-2.0.2.min.js), usually in the /build dir of your cloned incubator-flagon-useralejs repository. See the snippet below.

ProTip: An easy way to find the complete path to your minified UserALE.js script is to simply drag userale-2.0.2.min.js into your browser, copy the URL, and paste into the `src` parameter.

```
  <script
    src="file:///{your file path}/incubator-flagon-useralejs/build/userale-2.0.2.min.js" #REPLACE WITH YOUR PATH
    data-url="http://localhost:8000/"
    data-user="example-user"
    data-version="2.0.2"
    data-tool="Apache UserALE.js Example"
  ></script>
```
Once you've modified the script tag `src` field, save `index.html`.

Next open index.html in your browser (you can drag it directly into a tab or double-click it). 

You will see a very simple HTML Webpage with a button labeled, "Click Me!".

On this page, all user events will be captured and sent to the logging server. See instructions below.

## Testing with the Example Page

The UserALE.js Example page can be used to test the structure of logs after instrumentation or UserALE.js src code modification. It can also be used to experiment with UserALE.js API functions.

In order to experiment with the `filter` API, simply un-alias the relevant code snippet hard-coded in the UserALE.js Example Page. Manipulating the arguments in this code block allows you to experiment with omitting various event and log types from your UserALE.js data stream. See below:

```
    <script type="text/javascript">
    window.userale.filter(function (log) {
      var type_array = ['mouseup', 'mouseover', 'dblclick', 'blur', 'focus']
      var logType_array = ['interval']
      return !type_array.includes(log.type) && !logType_array.includes(log.logType);
    });
  </script>
```

Repeat the same steps on the next code block to experiment with the `mapper` API. Manipulating the arguments in this code block allows you to experiment with modifying and adding fields in UserALE.js' [data schema](http://flagon.incubator.apache.org/docs/useralejs/dataschema/).

See the [Flagon website](http://flagon.incubator.apache.org/) for additional documentation on the [API](http://flagon.incubator.apache.org/docs/useralejs/API/) and [testing for scale](http://flagon.incubator.apache.org/docs/stack/scaling/).

## Capturing Logs Using the Logging Server

The example logging server receives log from any UserALE.js instrumented page at `localhost:8000`.

This means you can test logs from your own instrumented application, the [UserALE.js WebExtension](https://github.com/apache/incubator-flagon-useralejs/tree/master/src/UserALEWebExtension), or the UserALE.js Example Page, so long as the `data-url` parameter is set to `localhost:8000`. This is the default setting for both the WebExtension and UserALE.js Example Page. See below:

```
  <script
    src="file:///{your file path}/incubator-flagon-useralejs/build/userale-2.0.2.min.js" #REPLACE WITH YOUR PATH
    data-url="http://localhost:8000/" #MUST BE SET TO 'localhost:8000'
    data-user="example-user"
    data-version="2.0.2"
    data-tool="Apache UserALE.js Example"
  ></script>
```

Once your UserALE.js script tag is properly configured to point to a minified UserALE.js script, and `localhost:8000`, you can log to the Example Logging Server.

Simply navigate to your cloned `incubator-flagon-useralejs` repository and run the following:

```
$npm run example:watch
```

Once started you will see:

```
> flagon-userale@2.0.2 example:watch /Users/jpoore/Documents/Apache_Flagon/prod/incubator-flagon-useralejs
> nodemon -w ./example example/server.js

[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: /Users/jpoore/Documents/Apache_Flagon/prod/incubator-flagon-useralejs/example/**/*
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
    toolVersion: '2.0.2',
    toolName: 'Apache UserALE.js Example',
    useraleVersion: '1.0.0' },
 ...
]
```

Kill the logging script with `^C` or as you would any bash script.

##Reviewing Logs Collected with the Example Server

In addition to showing in your terminal, logs collected by the UserALE.js Example Server are written locally to file. 

Find them in your cloned `incubator-flagon-useralejs` in the `/logs` dir. A new log file will appear each time you restart the logging server.

## Contributing

Contributions are welcome!  Simply [submit an issue report](https://issues.apache.org/jira/browse/FLAGON) for problems you encounter or a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate it into UserALE.js.