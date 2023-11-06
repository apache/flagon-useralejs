import { B3Propagator } from "@opentelemetry/propagator-b3";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";

const providerWithZone = new WebTracerProvider();

providerWithZone.addSpanProcessor(
  new SimpleSpanProcessor(new ConsoleSpanExporter())
);

providerWithZone.register({
  contextManager: new ZoneContextManager(),
  propagator: new B3Propagator(),
});

const defaultInstrumentConfig = {
  ignoreUrls: [/localhost/],
  propagateTraceHeaderCorsUrls: ["http://localhost:8090"],
};

// Realias the instrumentation classes to make them accessible via a single interface
export {
  FetchInstrumentation as Fetch,
  XMLHttpRequestInstrumentation as XMLHttpRequest,
  HttpInstrumentation as Http,
  registerInstrumentations,
  providerWithZone,
  defaultInstrumentConfig,
};
