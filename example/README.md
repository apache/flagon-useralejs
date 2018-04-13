# UserALE.js Example

This directory provides 
 * example usage for UserALE.js within a simple HTML Webpage,
 * how users can expect to log UserALE events, and
 * what log events looks like within a simple UserALE logging server.

## Prerequisites

Please see the [Prerequsites](https://github.com/apache/incubator-senssoft-useralejs#prerequsites)

## Running the Logging Server

Assuming you have [node.js](https://nodejs.org/) installed, simply run

```
npm run example:watch
```

## Running the Example

Simply open index.html in your browser... you will see a very simply HTML Webpage with a button.

When you click the button, the events will be logged to the server (in memory), logs looks similar to the following

```

[ { target: 'body',
    path: [ 'body', 'html' ],
    clientTime: 1504287557492,
    location: { x: 0, y: 0 },
    type: 'keydown',
    userAction: true,
    details: null,
    userId: 'example-user',
    toolVersion: '1.0.0',
    toolName: 'Apache UserALE.js Example',
    useraleVersion: '1.0.0' },
  { target: '#document',
    path: [ '#document' ],
    clientTime: 1504287558304,
    location: { x: 0, y: 0 },
    type: 'blur',
    userAction: true,
    details: { window: true },
    userId: 'example-user',
    toolVersion: '1.0.0',
    toolName: 'Apache UserALE.js Example',
    useraleVersion: '1.0.0' },
  { target: '#document',
    path: [ '#document' ],
    clientTime: 1504287558304,
    location: { x: 0, y: 0 },
    type: 'blur',
    userAction: true,
    details: null,
    userId: 'example-user',
    toolVersion: '1.0.0',
    toolName: 'Apache UserALE.js Example',
    useraleVersion: '1.0.0' },
 ...
]

```

## Contributing

Contributions are welcome!  Simply [submit an issue report](https://issues.apache.org/jira/browse/senssoft) for problems you encounter or a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate it into UserALE.js.