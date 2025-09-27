# System Patterns - IdeaNexus

## System Architecture

### Current Foundation
The project is built on a **Nuxt UI SaaS template** that provides:
- Modern Vue 3 + Nuxt 4 framework
- Nuxt UI component library for consistent design
- Nuxt Content for documentation management
- Pre-built SaaS pages (landing, pricing, docs, blog)
- TypeScript support with strong typing
- ESLint configuration for code quality

### Target Architecture
**Transformation Goal**: Convert the SaaS template into a full-featured innovation management platform while maintaining the existing foundation.

```
┌─────────────────────────────────────────────────────────────┐
│                    IdeaNexus Platform                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer (Nuxt UI + Vue 3)                          │
│  ├── Public Pages (Landing, Pricing, Docs)                 │
│  ├── Authentication (Login, Signup, Profile)               │
│  ├── Innovation Dashboard                                   │
│  ├── Idea Management (Submit, View, Track)                 │
│  ├── Evaluation Interface                                   │
│  └── Analytics & Reporting                                 │
├─────────────────────────────────────────────────────────────┤
│  API Layer (Nuxt Server API)                               │
│  ├── Authentication & Authorization                        │
│  ├── Idea CRUD Operations                                  │
│  ├── Evaluation Workflow                                   │
│  ├── Notification System                                   │
│  └── Analytics & Reporting                                 │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── SQLite Database (better-sqlite3)                      │
│  ├── File Storage (for attachments)                        │
│  └── Session Management                                     │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

### Database Strategy
**Decision**: Use SQLite with better-sqlite3 for MVP
**Rationale**: 
- Already included in dependencies
- Perfect for MVP and small-to-medium deployments
- Zero configuration overhead
- Easy migration path to PostgreSQL later
- Excellent performance for expected load

### Authentication Approach
**Decision**: Use Clerk for authentication and user management
**Rationale**:
- Rapid implementation with pre-built features (social logins, MFA, JWT handling)
- Enhanced security and compliance out-of-the-box
- Seamless integration with Nuxt via @clerk/nuxt
- Scalable for future enterprise needs while accelerating MVP delivery
- Reduces custom code maintenance and security risks

### State Management
**Decision**: Use Nuxt's built-in state management with Pinia
**Rationale**:
- Native integration with Nuxt
- TypeScript support
- Server-side rendering compatibility
- Minimal setup required

### Component Strategy
**Decision**: Leverage Nuxt UI components with custom business logic
**Rationale**:
- Consistent design system
- Accessibility built-in
- Rapid development
- Professional appearance

## Design Patterns in Use

### 1. Domain-Driven Design (DDD)
Organize code around business domains:
```
/server/api/
├── ideas/           # Idea management domain
├── evaluations/     # Evaluation process domain
├── users/          # User management domain
├── notifications/  # Communication domain
└── analytics/      # Reporting domain
```

### 2. Repository Pattern
Abstract data access for testability and flexibility:
```typescript
interface IdeaRepository {
  create(idea: CreateIdeaDto): Promise<Idea>
  findById(id: string): Promise<Idea | null>
  findByStatus(status: IdeaStatus): Promise<Idea[]>
  update(id: string, updates: UpdateIdeaDto): Promise<Idea>
}
```

### 3. Service Layer Pattern
Encapsulate business logic in dedicated services:
```typescript
class IdeaService {
  constructor(
    private ideaRepo: IdeaRepository,
    private notificationService: NotificationService
  ) {}
  
  async submitIdea(data: SubmitIdeaDto): Promise<Idea> {
    // Business logic for idea submission
  }
}
```

### 4. Event-Driven Architecture
Use events for loose coupling between domains:
```typescript
// Events for cross-domain communication
type DomainEvent = 
  | IdeaSubmittedEvent
  | IdeaEvaluatedEvent
  | IdeaApprovedEvent
  | IdeaImplementedEvent
```

### 5. Command Query Responsibility Segregation (CQRS)
Separate read and write operations:
```
/server/api/
├── commands/       # Write operations (create, update, delete)
└── queries/        # Read operations (list, search, analytics)
```

## Component Relationships

### Core Entities
```typescript
interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: string
}

interface Idea {
  id: string
  title: string
  description: string
  submitterId: string
  status: IdeaStatus
  createdAt: Date
  updatedAt: Date
}

interface Evaluation {
  id: string
  ideaId: string
  evaluatorId: string
  scores: EvaluationScores
  comments: string
  recommendation: EvaluationRecommendation
}
```

### Relationship Mapping
```
User (1) ──── (many) Idea
User (1) ──── (many) Evaluation
Idea (1) ──── (many) Evaluation
Idea (1) ──── (many) Comment
Idea (1) ──── (many) StatusHistory
```

## Critical Implementation Paths

### 1. Authentication Flow
```
Clerk Registration/SignUp → User Creation Webhook → DB Sync → Dashboard Access
Clerk Login/SignIn → JWT Verification → Role Check (Metadata) → Feature Access
Profile Update → Webhook Sync → RBAC Update
```

### 2. Idea Lifecycle
```
Submission → Validation → Assignment → Evaluation → Decision → Implementation
```

### 3. Evaluation Process
```
Idea Assignment → Evaluator Notification → Scoring → Comments → Recommendation → Approval Workflow
```

### 4. Notification System
```
Event Trigger → Notification Creation → Delivery (Email/In-App) → Read Status Tracking
```

## Technology Integration Patterns

### Nuxt Content Integration
- Use for documentation and help content
- Maintain existing blog structure for company updates
- Create evaluation criteria templates as content

### Nuxt UI Component Usage
- UCard for idea displays
- UForm for submissions and evaluations
- UTable for idea listings
- UModal for detailed views
- UNotification for system feedback

### Database Schema Patterns
```sql
-- Core tables following relational design
users (id, email, name, role, department, created_at)
ideas (id, title, description, submitter_id, status, created_at, updated_at)
evaluations (id, idea_id, evaluator_id, scores, comments, recommendation, created_at)
notifications (id, user_id, type, content, read_at, created_at)
```

### API Design Patterns
- RESTful endpoints for CRUD operations
- Consistent response formats
- Error handling middleware
- Request validation using Zod schemas
- Rate limiting for API protection

### Security Patterns
- Clerk-managed JWT tokens and session security
- Role-based access control (RBAC) via Clerk user metadata
- Input sanitization and validation with Zod
- SQL injection prevention through prepared statements
- XSS protection through Vue's built-in escaping and Clerk's secure components
- Webhook verification for Clerk user sync
- Rate limiting on API endpoints

## Performance Considerations

### Caching Strategy
- Server-side caching for frequently accessed data
- Client-side caching for user preferences
- Static generation for public pages

### Database Optimization
- Proper indexing on frequently queried fields
- Pagination for large result sets
- Efficient query patterns

### Frontend Optimization
- Lazy loading for non-critical components
- Image optimization using Nuxt Image
- Code splitting for better performance
