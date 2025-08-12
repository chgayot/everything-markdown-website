import { WebTracerProvider, BatchSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";

// Set up simple browser-compatible tracing
const endpoint = import.meta.env.VITE_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;

const provider = new WebTracerProvider();

// Simple batch processor without zone context
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({ 
      url: endpoint, 
      headers: {} 
    })
  )
);

// Register provider without zone context manager (uses default context)
provider.register();

// Register browser-compatible instrumentations
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: [/.*/],
    }),
    new XMLHttpRequestInstrumentation({
      propagateTraceHeaderCorsUrls: [/.*/],
    }),
  ],
});

export {};
