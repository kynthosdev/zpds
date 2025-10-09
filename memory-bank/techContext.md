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
      ideas.value = await $fetch('/api/dashboard/ideas')
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

## Landing Page Technical Stack

### Core Technologies for Landing Page

**Frontend Framework**:
- **Nuxt 4.1.2**: Server-side rendering for SEO optimization
- **Vue 3**: Reactive components for interactive elements
- **TypeScript**: Type-safe component development

**UI Components**:
- **Nuxt UI 4.0.0**: Pre-built components (UCard, UButton, UForm, UAccordion)
- **Tailwind CSS**: Utility-first styling for rapid development
- **Lucide Icons**: Modern icon set for visual elements

**Content Management**:
- **Nuxt Content 3.7.1**: Manage testimonials and case studies as YAML/Markdown files
- **File-based CMS**: Easy updates without database complexity
- **Query API**: Fetch and filter testimonials programmatically

### Form Handling & Validation

**Clerk Integration for Demo Requests**:
```typescript
// Dependencies
"@clerk/nuxt": "^1.0.0"  // Authentication service

// Environment Variables Required
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Form Validation**:
```typescript
// Zod 4.1.11 for schema validation
import { z } from 'zod'

const demoRequestSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  workEmail: z.string()
    .email('Invalid email')
    .refine(
      (email) => !['gmail.com', 'yahoo.com', 'hotmail.com'].some(
        domain => email.endsWith(domain)
      ),
      'Please use your work email'
    ),
  company: z.string().min(2, 'Company name is required'),
  companySize: z.enum(['5-20', '21-50', '51-100', '100+'])
})
```

**Clerk User Metadata Pattern**:
```typescript
// Store demo request data in Clerk user metadata
await signUp.create({
  emailAddress: formData.workEmail,
  firstName: formData.fullName.split(' ')[0],
  lastName: formData.fullName.split(' ').slice(1).join(' '),
  unsafeMetadata: {
    company: formData.company,
    companySize: formData.companySize,
    demoRequested: true,
    requestedAt: new Date().toISOString(),
    source: 'landing_page'
  }
})
```

### Analytics & Tracking

**Google Analytics 4 Setup**:
```typescript
// Install via Nuxt module
// pnpm add -D @nuxtjs/google-analytics

// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/google-analytics'],
  googleAnalytics: {
    id: 'G-XXXXXXXXXX'
  }
})
```

**Event Tracking Implementation**:
```typescript
// Custom analytics composable
export const useAnalytics = () => {
  const trackPageView = (pageName: string) => {
    gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    })
  }
  
  const trackCTAClick = (location: string, text: string) => {
    gtag('event', 'cta_click', {
      cta_location: location,
      cta_text: text
    })
  }
  
  const trackConversion = () => {
    gtag('event', 'conversion', {
      send_to: 'AW-XXXXXXXX/XXXXX',
      event_category: 'lead',
      event_label: 'demo_request_submitted'
    })
  }
  
  return { trackPageView, trackCTAClick, trackConversion }
}
```

**Tracked Events**:
- Page views and session duration
- Scroll depth (25%, 50%, 75%, 100%)
- CTA clicks by location (hero, solution, final)
- Form interactions (start, completion, abandonment)
- Demo request conversions
- Trial signup conversions

### Image Optimization

**Nuxt Image Configuration**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    quality: 85,
    format: ['webp', 'png'],
    screens: {
      mobile: 320,
      tablet: 768,
      desktop: 1200
    },
    domains: ['ideanexus.co.za'],
    alias: {
      landing: '/images/landing'
    }
  }
})
```

**Image Usage Pattern**:
```vue
<NuxtImg
  src="/images/landing/dashboard-screenshot.png"
  alt="IdeaNexus innovation management dashboard"
  format="webp"
  quality="85"
  :width="720"
  :height="540"
  loading="lazy"
  placeholder
  sizes="sm:100vw md:720px lg:720px"
/>
```

**Image Requirements**:
- **Format**: WebP with PNG fallback
- **Compression**: 80-85% quality
- **File Size**: <200KB per image
- **Lazy Loading**: All images below fold
- **Responsive**: 3 sizes (mobile, tablet, desktop)
- **CDN**: CloudFlare or similar for delivery

### SEO Optimization

**Meta Tags Management**:
```typescript
// app/pages/index.vue
useHead({
  title: 'IdeaNexus - Innovation Management for SA SMBs | Systematic Idea Tracking',
  meta: [
    {
      name: 'description',
      content: 'Turn employee ideas into implemented innovations. IdeaNexus is the innovation management platform designed for South African SMBs. 14-day free trial, no credit card required.'
    },
    {
      name: 'keywords',
      content: 'innovation management, idea management software, SMB innovation, employee suggestions, South Africa, systematic innovation'
    },
    // Open Graph
    { property: 'og:title', content: 'IdeaNexus - Innovation Management for SA SMBs' },
    { property: 'og:description', content: 'Systematic innovation management without enterprise complexity. Trusted by 100+ South African businesses.' },
    { property: 'og:image', content: 'https://ideanexus.co.za/og-image.jpg' },
    { property: 'og:url', content: 'https://ideanexus.co.za' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'IdeaNexus - Innovation Management for SA SMBs' },
    { name: 'twitter:description', content: 'Turn employee ideas into implemented innovations. Built for SMBs.' },
    { name: 'twitter:image', content: 'https://ideanexus.co.za/twitter-card.jpg' }
  ],
  link: [
    { rel: 'canonical', href: 'https://ideanexus.co.za' }
  ]
})
```

**Structured Data (Schema.org)**:
```typescript
// Using nuxt-schema-org module
// pnpm add -D nuxt-schema-org

useSchemaOrg([
  {
    '@type': 'SoftwareApplication',
    name: 'IdeaNexus',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '4500',
      priceCurrency: 'ZAR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        billingDuration: 'P1M'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47'
    },
    description: 'Innovation management platform for South African SMBs'
  }
])
```

### Performance Optimization

**Target Metrics**:
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Total Page Size**: <1MB
- **Total Requests**: <50
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

**Optimization Techniques**:

1. **Critical CSS Inlining**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    inlineSSRStyles: true
  }
})
```

2. **Asset Compression**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
    minify: true
  }
})
```

3. **Lazy Loading Components**:
```vue
<!-- Load below-fold sections lazily -->
<LazyLandingSocialProof />
<LazyLandingProblem />
<LazyLandingSolution />
```

4. **Code Splitting**:
```typescript
// Automatic code splitting by route
// Each landing page section is a separate chunk
```

5. **Preloading Critical Resources**:
```typescript
useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/images/hero-screenshot.webp' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
  ]
})
```

### Mock Content Management

**Nuxt Content Structure**:
```
content/
├── testimonials/
│   ├── sarah-mitchell.yml
│   ├── james-thompson.yml
│   └── linda-kruger.yml
├── case-studies/
│   └── techflow-manufacturing.yml
└── faqs/
    └── landing-page-faqs.yml
```

**Testimonial Schema**:
```yaml
# content/testimonials/sarah-mitchell.yml
id: sarah-mitchell
quote: |
  Before IdeaNexus, we had a graveyard of 200+ ideas in various spreadsheets 
  that nobody looked at. Within 3 months of implementation, we evaluated all 
  of them, implemented 12 high-impact ideas, and created a culture where people 
  actually expect their suggestions to be taken seriously.
author: Sarah Mitchell
role: Operations Director
company: TechFlow Manufacturing
companySize: 48 employees
location: Johannesburg
rating: 5
featured: true
photo: /images/testimonials/sarah-mitchell.jpg
metrics:
  - label: Employee engagement increase
    value: 23%
  - label: Ideas implemented per year
    value: 24
  - label: Time to first implementation
    value: 90 days
createdAt: 2025-01-15
```

**Querying Content**:
```typescript
// composables/useTestimonials.ts
export const useTestimonials = () => {
  const fetchTestimonials = async () => {
    return await queryContent('testimonials')
      .sort({ featured: -1, createdAt: -1 })
      .find()
  }
  
  const fetchFeaturedTestimonial = async () => {
    return await queryContent('testimonials')
      .where({ featured: true })
      .findOne()
  }
  
  return { fetchTestimonials, fetchFeaturedTestimonial }
}
```

### A/B Testing Infrastructure

**Cookie-based Variant Assignment**:
```typescript
// composables/useABTest.ts
export const useABTest = (testName: string) => {
  const variant = useCookie(`ab_test_${testName}`, {
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })
  
  if (!variant.value) {
    variant.value = Math.random() < 0.5 ? 'A' : 'B'
  }
  
  // Track variant assignment
  gtag('event', 'ab_test_assigned', {
    test_name: testName,
    variant: variant.value
  })
  
  return {
    variant: variant.value,
    isVariantA: variant.value === 'A',
    isVariantB: variant.value === 'B'
  }
}
```

**A/B Test Tracking**:
```typescript
// Track conversions by variant
const { variant } = useABTest('hero_headline')

const trackConversion = () => {
  gtag('event', 'conversion', {
    test_name: 'hero_headline',
    variant: variant,
    event_category: 'lead',
    event_label: 'demo_request_submitted'
  })
}
```

### Accessibility Requirements

**WCAG 2.1 AA Compliance**:
- Minimum 4.5:1 contrast ratio for text
- Minimum 3:1 for large text and UI components
- All images have descriptive alt text
- Keyboard navigation functional
- Focus indicators visible
- Form labels properly associated
- Semantic HTML with proper heading hierarchy
- ARIA labels where needed
- Color not sole indicator of information
- Text resizable to 200% without breaking layout

**Accessibility Testing Tools**:
```bash
# Install axe-core for automated testing
pnpm add -D @axe-core/playwright

# Run accessibility tests
pnpm test:a11y
```

### Development Workflow for Landing Page

**Local Development**:
```bash
# Start dev server with hot reload
pnpm dev

# Preview production build
pnpm build && pnpm preview

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

**Environment Variables**:
```bash
# .env.local (not committed)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Build Configuration**:
```typescript
// nuxt.config.ts - Landing page specific
export default defineNuxtConfig({
  // Enable SSR for SEO
  ssr: true,
  
  // Optimize for production
  nitro: {
    preset: 'vercel', // or 'netlify', 'node-server'
    compressPublicAssets: true
  },
  
  // Route rules for landing page
  routeRules: {
    '/': { prerender: true }, // Pre-render landing page
    '/demo/thank-you': { ssr: false } // Client-side only
  }
})
```

### Deployment Configuration

**Vercel Deployment** (Recommended):
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nuxtjs",
  "outputDirectory": ".output/public"
}
```

**Environment Variables in Production**:
- `CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NUXT_PUBLIC_GA_ID`: Google Analytics ID
- `NUXT_PUBLIC_SITE_URL`: Production URL

**CDN Configuration**:
- Static assets served via Vercel Edge Network
- Images optimized and cached
- Gzip/Brotli compression enabled
- Cache headers configured for optimal performance

### Testing Strategy

**Performance Testing**:
```bash
# Lighthouse CI
pnpm add -D @lhci/cli

# Run Lighthouse tests
pnpm lighthouse:ci
```

**Visual Regression Testing**:
```bash
# Percy for visual testing
pnpm add -D @percy/cli @percy/playwright

# Capture screenshots
pnpm percy:snapshot
```

**Conversion Tracking Validation**:
- Test all CTA click events fire correctly
- Verify demo request form submission
- Confirm Clerk user creation with metadata
- Validate Google Analytics event tracking
- Check scroll depth tracking accuracy

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
