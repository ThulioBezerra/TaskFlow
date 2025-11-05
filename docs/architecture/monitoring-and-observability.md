# Monitoring and Observability

## Monitoring Stack
For the local-only MVP, monitoring will be minimal.
- **Frontend Monitoring:** N/A. Browser DevTools will be used for debugging.
- **Backend Monitoring:** Spring Boot Actuator will be enabled.
- **Error Tracking:** N/A. Errors will be logged to the console.
- **Performance Monitoring:** N/A.

## Key Metrics

**Frontend Metrics:**
- N/A for MVP.

**Backend Metrics (via Actuator):**
- JVM memory usage
- CPU usage
- HTTP request traces (last 100)
- Health endpoint (`/actuator/health`)
