## Logging Custom, Non-User Events Examples
UserALE.js' API provides significant customization options; you can use it extend UserALE.js' out-of-the-box capabilities and log non-user events.

### XMLHttpRequests
For user-workflow segmentation or more comprehensive instrumentation, it may be desirable to capture when the client sends requests to other services. 


```JavaScript
    req.onreadystatechange = function () {
      if (req.readyState == XMLHttpRequest.DONE) {
        userale.log({
          clientTime: Date.now(),
          type: 'XMLHttpRequest',
          logType: 'custom',
          userAction: 'false',
          details: JSON.parse(req.response),
          userId: userale.options().userId,
          useraleVersion: userale.options().useraleVersion,
          sessionID: userale.options().sessionID,
        });
      }
    }
```
The example above uses the `userale.log` API, allowing users to script their own log. However, the same effect is achieve with the `userale.packageCustomLog` API, which adds custom user field to the canonical UserALE.js schema.

The method above will similarly work with other types of requests (e.g., fetch, websocket, etc..)

### Custom Integrations
In the example below, custom UserALE.js logs can be used for integration with other instrumentation packages such as [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-js). We can grab traceId's created by OpenTelemetry for tracing client requests throughout distributed systems and associate them with UserALE.js Logs. See the `index.js` for complete example modified from the [OpenTelemetry UserInteraction Plugin](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-user-interaction).
```JavaScript
    req.onreadystatechange = function () {
      if (req.readyState == XMLHttpRequest.DONE) {
        userale.log({
          clientTime: Date.now(),
          type: 'XMLHttpRequest',
          logType: 'custom',
          userAction: 'false',
          details: JSON.parse(req.response),
          userId: userale.options().userId,
          useraleVersion: userale.options().useraleVersion,
          sessionID: userale.options().sessionID,
          traceId: trace.getSpan(context.active())._spanContext.traceId
        });
      }
    }
```