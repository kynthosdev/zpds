# IdeaNexus - Innovation Management Platform

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![Clerk](https://img.shields.io/badge/Auth%20with-Clerk-1E40AF?logo=clerk&labelColor=020420)](https://clerk.com)

IdeaNexus is a streamlined SaaS platform for small and medium-sized businesses (SMBs) to systematically capture, evaluate, and implement innovative ideas. Built following lean startup principles, it addresses unstructured innovation processes in South African SMEs. Powered by Nuxt 4, Nuxt UI components, Clerk authentication, and PostgreSQL with Drizzle ORM for production-ready database operations.

For detailed project context, see the [memory-bank/projectbrief.md](memory-bank/projectbrief.md) and other documentation files.

## Quick Start

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/ideanexus.git  # Replace with actual repo URL
cd ideanexus
pnpm install
```

Set up environment variables (see Setup section below), then start the development server.

## Setup

Install dependencies:

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
# Add other vars as needed (e.g., DATABASE_URL for future migrations)
```

- Get Clerk keys from your [Clerk dashboard](https://dashboard.clerk.com).
- For development, use test keys; switch to live for production.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

Note: Authentication is required for protected routes (e.g., dashboard). Sign up/login via Clerk to test.

## Core Features (MVP)

The MVP focuses on essential innovation lifecycle management:

| Feature | Description | Status |
|---------|-------------|--------|
| Idea Submission Portal | Simple form for title, description, benefits, and submitter info | Planned |
| Idea Repository | Searchable database of submitted ideas | Planned |
| Basic Evaluation Framework | Scoring on impact, feasibility, resources | ✅ Implemented |
| Status Tracking | Visual board for idea progression (submitted → implemented) | ✅ Implemented |
| Email Notifications | Automated updates on submissions and status changes | Planned |
| Simple Analytics Dashboard | Metrics on idea flow, approvals, implementation times | ✅ Implemented |

See [memory-bank/projectbrief.md](memory-bank/projectbrief.md) for full user stories and wireframes.

## Tech Stack

- **Framework**: Nuxt 4.1.2 (Vue 3, TypeScript, SSR)
- **UI**: Nuxt UI 4.0.0 (Tailwind CSS, Headless UI, Lucide Icons)
- **Content**: Nuxt Content 3.7.1 (Markdown/YAML for docs/blog)
- **Database**: PostgreSQL with Drizzle ORM 0.30.0 (Cloud-hosted via Neon for scalability)
- **Authentication**: Clerk (@clerk/nuxt) with RBAC via metadata (Frontend implemented, backend integration deferred)
- **Validation**: Zod 4.1.11 for schemas and forms
- **Tools**: pnpm 10.17.1, ESLint 9.36.0, @nuxt/image, @vueuse/nuxt
- **Other**: nuxt-og-image for social previews

For full details, see [memory-bank/techContext.md](memory-bank/techContext.md).

## Production

Build the application for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

### Deployment

- **Recommended**: Vercel or Netlify for Nuxt apps.
- Configure Clerk webhooks for user sync with database.
- PostgreSQL database already implemented via Neon serverless platform.
- See [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for more.

## Code Quality

Run linting:

```bash
pnpm lint
```

Type checking:

```bash
pnpm typecheck
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/idea-submission`).
3. Commit changes (`git commit -m 'Add idea submission form'`).
4. Push to the branch (`git push origin feature/idea-submission`).
5. Open a Pull Request.

Current progress tracked in [memory-bank/progress.md](memory-bank/progress.md). Focus on authentication completion before core features.

## License

MIT License. See [LICENSE](LICENSE) for details (create if missing).

## Current Status

**System Status**: ✅ OPERATIONAL - Database and API fully functional
**Development Phase**: Testing & Validation (October 2025)

- Database migration to PostgreSQL + Drizzle ORM completed (October 13, 2025)
- Evaluation system fully implemented with Pinia store integration
- Dashboard and analytics components operational
- Frontend Clerk authentication implemented (backend integration deferred)
- System ready for comprehensive testing and validation

## Next Steps

- Complete system testing with real data
- Validate end-to-end workflows (submission → evaluation → approval)
- Conduct internal user testing
- Prepare for beta launch with functional MVP
- Complete Clerk backend integration (webhooks, API protection) - Post-MVP
- Landing page development - Post-MVP

For questions, refer to memory-bank files or open an issue.
