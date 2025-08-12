import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trace } from "@opentelemetry/api";

export default function RouteTracer() {
  const location = useLocation();

  useEffect(() => {
    const tracer = trace.getTracer("website-blog");
    const span = tracer.startSpan("route_change", {
      attributes: {
        path: location.pathname,
      },
    });
    span.end();
  }, [location.pathname]);

  return null;
}
