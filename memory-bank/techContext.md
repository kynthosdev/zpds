# Tech Context - IdeaNexus

## Technology Stack

### Frontend Framework
**Nuxt 4.1.2** - Full-stack Vue framework
- **Vue 3**: Modern reactive framework with Composition API
- **TypeScript**: Strong typing for better development experience
- **Server-Side Rendering**: SEO optimization and performance
- **Auto-imports**: Streamlined development workflow
- **File-based routing**: Intuitive page structure

### UI Framework
**Nuxt UI 4.0.0** - Comprehensive component library
- **Tailwind CSS**: Utility-first styling approach
- **Headless UI**: Accessible component primitives
- **Lucide Icons**: Modern icon set (@iconify-json/lucide)
- **Simple Icons**: Brand icons (@iconify-json/simple-icons)
- **Responsive Design**: Mobile-first approach

### Content Management
**Nuxt Content 3.7.1** - File-based CMS
- **Markdown Support**: Documentation and blog content
- **YAML Frontmatter**: Structured metadata
- **Code Highlighting**: Technical documentation support
- **Search Integration**: Built-in content search

### Database & Storage
**SQLite with better-sqlite3 12.4.1**
- **Embedded Database**: Zero-configuration setup
- **High Performance**: Excellent for MVP and medium-scale deployments
- **ACID Compliance**: Data integrity guarantees
- **Migration Path**: Easy upgrade to PostgreSQL when needed

### Development Tools
**ESLint 9.36.0** with Nuxt ESLint config
- **Code Quality**: Consistent coding standards
- **TypeScript Integration**: Type-aware linting
- **Stylistic Rules**: Automated formatting preferences
- **Vue-specific Rules**: Framework-specific best practices

### Additional Modules
- **@nuxt/image 1.11.0**: Optimized image handling
- **@vueuse/nuxt 13.9.0**: Composition utilities
- **nuxt-og-image 5.1.11**: Social media image generation
- **@nuxt/test-utils 3.19.2**: Testing framework integration

### Validation & Schemas
**Zod 4.1.11** - TypeScript-first schema validation
- **Runtime Validation**: API request/response validation
- **Type Inference**: Automatic TypeScript types from schemas
- **Error Handling**: Detailed validation error messages
- **Form Validation**: Client-side form validation

### Authentication
**Clerk** - User authentication and management service
- **@clerk/nuxt**: Official Nuxt integration module
- **JWT & Sessions**: Secure token handling and session management
- **RBAC Support**: Role-based access via user metadata
- **Webhook Integration**: Sync users with database on events
- **Customization**: Themeable components matching Nuxt UI
- **Environment Vars**: CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY

## Development Setup

### Package Manager
**pnpm 10.17.1** - Fast, disk space efficient package manager
- **Workspace Support**: Monorepo capabilities if needed
- **Strict Dependencies**: Prevents phantom dependencies
- **Fast Installation**: Optimized dependency resolution

### Environment Configuration
```bash
# Clerk Environment Variables (add to .env)
# CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...

# Development server with Turbo
pnpm dev --turbo

# Production build
pnpm build

# Preview production build
pnpm preview

# Code quality
pnpm lint
pnpm typecheck
```

### Project Structure
```
zpds/
├── app/                    # Application source
│   ├── components/         # Vue components
│   ├── layouts/           # Page layouts
│   ├── pages/             # File-based routing
│   ├── assets/            # Static assets
│   └── types/             # TypeScript definitions
├── content/               # Nuxt Content files
├── server/                # Server-side code (to be created)
├── public/                # Static files
└── memory-bank/           # Project documentation
```

## Technical Constraints

### Performance Requirements
- **Page Load Time**: < 2 seconds for initial load
- **Database Queries**: < 100ms for standard operations
- **Concurrent Users**: Support 100+ simultaneous users
- **File Upload**: Support up to 10MB attachments

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

### Security Requirements
- **Authentication**: Clerk-based authentication and session management
- **Authorization**: Role-based access control via Clerk metadata
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Server-side validation for all inputs
- **XSS Prevention**: Content Security Policy implementation

### Scalability Considerations
- **Database**: SQLite for MVP, PostgreSQL migration path
- **File Storage**: Local storage for MVP, cloud storage migration path
- **Caching**: In-memory caching for frequently accessed data
- **CDN**: Static asset delivery optimization

## Dependencies Analysis

### Core Dependencies
```json
{
  "@nuxt/ui": "^4.0.0",           // UI component library
  "@nuxt/content": "^3.7.1",     // Content management
  "@nuxt/image": "^1.11.0",      // Image optimization
  "nuxt": "^4.1.2",              // Core framework
  "better-sqlite3": "^12.4.1",   // Database driver
  "zod": "^4.1.11",              // Schema validation
  "@clerk/nuxt": "^1.0.0"        // Authentication service
}
```

### Development Dependencies
```json
{
  "@nuxt/eslint": "^1.9.0",      // Linting configuration
  "typescript": "^5.9.2",        // Type checking
  "vue-tsc": "^3.0.8"           // Vue TypeScript compiler
}
```

### Utility Dependencies
```json
{
  "@vueuse/nuxt": "^13.9.0",     // Composition utilities
  "nuxt-og-image": "^5.1.11"     // Social media images
}
```

## Tool Usage Patterns

### Development Workflow
1. **Local Development**: `pnpm dev` with hot reload
2. **Type Checking**: Continuous TypeScript validation
3. **Code Quality**: ESLint integration with VS Code
4. **Testing**: Vitest integration through @nuxt/test-utils
5. **Build Process**: Optimized production builds

### Database Management
```typescript
// Database initialization pattern
import Database from 'better-sqlite3'

const db = new Database('ideanexus.db')

// Migration pattern
const migrations = [
  'CREATE TABLE users (...)',
  'CREATE TABLE ideas (...)',
  'CREATE TABLE evaluations (...)'
]
```

### API Development Pattern
```typescript
// Server API route structure
export default defineEventHandler(async (event) => {
  // Request validation with Zod
  const body = await readBody(event)
  const validatedData = schema.parse(body)
  
  // Business logic
  const result = await service.process(validatedData)
  
  // Response formatting
  return { success: true, data: result }
})
```

### Component Development Pattern
```vue
<script setup lang="ts">
// TypeScript with auto-imports
interface Props {
  idea: Idea
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

// Composables usage
const { $fetch } = useNuxtApp()
const toast = useToast()
</script>

<template>
  <!-- Nuxt UI components -->
  <UCard>
    <template #header>
      <h3>{{ idea.title }}</h3>
    </template>
    
    <p>{{ idea.description }}</p>
    
    <template #footer>
      <UButton @click="handleAction">
        Evaluate
      </UButton>
    </template>
  </UCard>
</template>
```

### State Management Pattern
```typescript
// Pinia store pattern
export const useIdeaStore = defineStore('ideas', () => {
  const ideas = ref<Idea[]>([])
  const loading = ref(false)
  
  const fetchIdeas = async () => {
    loading.value = true
    try {
      ideas.value = await $fetch('/api/ideas')
    } finally {
      loading.value = false
    }
  }
  
  return { ideas, loading, fetchIdeas }
})
```

## Configuration Files

### Nuxt Configuration
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image'
  ],
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/docs': { redirect: '/docs/getting-started' }
  }
})
```

### ESLint Configuration
```javascript
// eslint.config.mjs
export default defineNuxtConfig({
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

## Migration Considerations

### Database Migration Path
- **Current**: SQLite for development and MVP
- **Future**: PostgreSQL for production scaling
- **Strategy**: Abstract database layer for easy migration

### Deployment Options
- **Current**: Static generation with Nuxt generate
- **Future**: Server deployment with database
- **Hosting**: Vercel, Netlify, or custom VPS

### Performance Optimization
- **Current**: Nuxt built-in optimizations
- **Future**: CDN integration, caching layers
- **Monitoring**: Performance tracking and optimization
