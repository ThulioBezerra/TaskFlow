# Technical Assumptions

## Repository Structure: Monorepo

## Service Architecture: Monolith

## Testing Requirements: Unit + Integration with 95% Coverage

## Additional Technical Assumptions and Requests

*   **Frontend Framework:** React with TypeScript, specifically using **Vite** for tooling.
*   **Backend Framework:** Spring Boot (Java).
*   **Database:** PostgreSQL (Relational Database).
*   **Hosting/Infrastructure:** Local only initially; no specific cloud deployment targets for the MVP.
*   **Real-Time Communication:** WebSockets with STOMP.
*   **Authentication:** JWT-based authentication.
*   **API Layer:** The architecture should be designed with a clear API layer.
*   **API Documentation:** Use **Swagger (SpringDOC)**, documented in a `ClassNameOpenApi.java` file.
