# Coding Standards

## Critical Fullstack Rules
- **Type Sharing:** For the MVP, manually keep frontend TypeScript types in sync with backend DTOs. For larger projects, consider a shared types package.
- **API Calls:** All frontend API calls must go through the `services` layer. No direct `axios` or `fetch` calls in components.
- **Environment Variables:** Access environment variables through a dedicated config object, not `process.env` or `import.meta.env` directly in components.
- **Error Handling:** All API routes must use the global exception handler in the backend. Frontend API calls must handle potential errors.

## Naming Conventions
| Element | Frontend | Backend | Example |
|---|---|---|---|
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useTasks.ts` |
| API Routes | - | kebab-case | `/api/user-profile` |
| Database Tables | - | snake_case | `user_profiles` |
| Java Classes | - | PascalCase | `TaskService.java` |
