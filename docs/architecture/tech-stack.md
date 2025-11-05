# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|---|---|---|---|---|
| Frontend Language | TypeScript | ~5.x | Type safety for JavaScript | Enhances code quality and maintainability. |
| Frontend Framework | React | ~18.x | Building user interfaces | Modern, component-based, and widely adopted. Specified in PRD. |
| UI Component Library | Material-UI (MUI) | ~5.x | Pre-built UI components | Accelerates development with a modern, professional look. |
| State Management | Zustand | ~4.x | Global state management | Simple, unopinionated, and less boilerplate than Redux. Good for MVP. |
| Backend Language | Java | 17 | General-purpose backend language | Mature, robust, and performant. Specified in PRD. |
| Backend Framework | Spring Boot | ~3.x | Building backend applications | Rapid development, extensive ecosystem. Specified in PRD. |
| Backend Utility | Lombok | ~1.18.x | Boilerplate code reduction | Reduces boilerplate (getters, setters, etc.) for cleaner models. |
| API Style | REST | N/A | Client-server communication | Mature, well-understood standard. Specified in PRD. |
| Database | PostgreSQL | 15+ | Relational data storage | Powerful, open-source, and reliable. Specified in PRD. |
| Cache | N/A | N/A | N/A | Not required for MVP. Can be added later if performance bottlenecks are identified. |
| File Storage | Local Filesystem | N/A | Storing task attachments | Sufficient for local-only MVP. Will be replaced by a cloud service (e.g., S3) for production. |
| Authentication | JWT | N/A | Secure API authentication | Stateless, industry-standard approach. Specified in PRD. |
| Frontend Testing | Vitest / RTL | Latest | Unit & Component Testing | Fast, modern testing framework that integrates well with Vite. |
| Backend Testing | JUnit 5 / Mockito | Latest | Unit & Integration Testing | Standard testing stack for Java/Spring Boot. |
| E2E Testing | Playwright | Latest | End-to-end testing | Modern, reliable, and fast E2E testing framework. |
| Build Tool | Maven | ~3.8.x | Backend dependency management | Standard build tool for Java projects. |
| Bundler | Vite | ~5.x | Frontend build/dev server | Fast, modern, and specified in PRD. |
| IaC Tool | N/A | N/A | N/A | Not required for local-only MVP. |
| CI/CD | N/A | N/A | N/A | Not required for local-only MVP. |
| Monitoring | Spring Boot Actuator | ~3.x | Basic backend monitoring | Provides basic health checks and metrics for local debugging. |
| Logging | SLF4J with Logback | Bundled | Application logging | Standard logging facade for Spring Boot. |
| CSS Framework | Emotion | ~11.x | CSS-in-JS styling | Comes integrated with Material-UI for flexible styling. |
