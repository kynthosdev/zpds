# Active Context - IdeaNexus

## Current Work Focus
Authentication System Implementation using Clerk. The project has pivoted from custom JWT-based authentication to Clerk to accelerate MVP delivery, enhance security, and reduce maintenance overhead. This decision aligns with lean principles by leveraging a proven third-party service for core user management, allowing faster focus on business logic like idea submission and evaluation workflows.

## Recent Changes
- Updated development plan to prioritize Clerk integration for authentication (September 27, 2025).
- Memory Bank updates completed to document the Clerk pivot across relevant files.
- Implemented prioritized Clerk frontend auth: Account config, @clerk/nuxt install, app.vue wrapper, login/signup/profile components, protected routes (September 27, 2025).
- Partial RBAC in AppHeader.vue; full backend deferred.

## Next Steps
1. Complete frontend refinements (full RBAC in UI, testing basic flows).
2. Implement deferred backend: Webhook sync for DB, API protection with getAuth, full RBAC enforcement.
3. Database schema design with clerk_user_id for user table.
4. Test end-to-end auth (login → protected dashboard → logout).
5. Proceed to core app structure (authenticated dashboard, navigation).
6. Update activeContext.md with learnings from testing.

## Important Patterns and Preferences
- **Authentication Pattern**: Use Clerk's `<ClerkProvider>` wrapper in app.vue for global context. Protect routes with Clerk middleware or `<Protect>` components.
- **RBAC Implementation**: Store roles in Clerk user metadata; verify in Nuxt server API using getAuth() for protected endpoints.
- **Data Sync**: On user events (create/update), use Clerk webhooks to insert/update records in the users table, linking via clerk_user_id.
- **UI Integration**: Customize Clerk components with Nuxt UI and Tailwind for brand consistency; use Pinia for caching user data.
- **Security Preferences**: Rely on Clerk for JWT handling, password policies, and MFA; add custom validation with Zod for any extended fields.

## Learnings and Project Insights
- Clerk reduces custom auth boilerplate by ~70%, freeing resources for core features; frontend integration took ~4 hours as planned.
- Seamless Nuxt setup via @clerk/nuxt; components like <SignIn /> integrate easily with Nuxt UI layouts.
- Env var management critical—use .env.local to avoid commits; test keys early to prevent build errors.
- Partial RBAC via useUser() metadata works for UI; backend verification needed for APIs.
- Potential for future scalability: Clerk supports organizations for team-based access, useful for SMB multi-department setups.
- Risk: Vendor dependency—mitigate by abstracting auth calls in a service layer (e.g., AuthService) for easy swaps.
- Alignment Check: Supports UX goals in productContext.md (seamless login for contributors) and architecture in systemPatterns.md (API-first with external service integration).
