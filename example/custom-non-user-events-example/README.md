## Logging Non-User Events Examples

First, OpenTelemetry can be installed as follows:

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

Then, OpenTelemetry can be automatically instrumented using the following code from the <a href="https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/web/opentelemetry-instrumentation-user-interaction">Open Telemetry GitHub Repository</a>:
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