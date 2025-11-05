# Security and Performance

## Security Requirements

**Frontend Security:**
- **CSP Headers:** Not implemented for MVP, but recommended for production.
- **XSS Prevention:** React inherently protects against XSS by escaping content. Developers must avoid using `dangerouslySetInnerHTML`.
- **Secure Storage:** JWT will be stored in a secure, HTTP-only cookie or in memory. Avoid `localStorage`.

**Backend Security:**
- **Input Validation:** Use Spring Validation (`@Valid`) on DTOs to prevent invalid data.
- **Rate Limiting:** Not implemented for MVP. Consider libraries like Bucket4j for production.
- **CORS Policy:** Configure Spring Security to allow requests only from the frontend's origin.

**Authentication Security:**
- **Token Storage:** See Frontend Security.
- **Token Expiration:** JWTs will have a short expiration (e.g., 15 minutes) with a refresh token mechanism for seamless re-authentication (as per NFR8).
- **Password Policy:** Passwords will be hashed and salted using bcrypt (as per NFR9).

## Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** Keep initial bundle under 500KB. Vite provides good code splitting by default.
- **Loading Strategy:** Use code splitting for routes (`React.lazy`) to only load necessary code.
- **Caching Strategy:** Leverage browser caching for static assets. Use TanStack Query for server state caching.

**Backend Performance:**
- **Response Time Target:** P95 response time < 200ms for most API calls.
- **Database Optimization:** Add indexes to foreign keys and frequently queried columns (see schema).
- **Caching Strategy:** Not implemented for MVP. Consider Redis or Caffeine for production.
