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
│  ├── PostgreSQL Database (Drizzle ORM)                     │
│  ├── File Storage (for attachments)                        │
│  └── Session Management                                     │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

### Database Strategy
**Decision**: Use PostgreSQL with Drizzle ORM for production-ready database
**Rationale**:
- Cloud-hosted via Neon for serverless scalability and high availability
- Type-safe ORM with compile-time SQL validation
- ACID compliance for transactional integrity
- Better performance for concurrent workloads
- Native JSON support for flexible data structures
- Built-in connection pooling and optimization

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

## Landing Page Architecture

### Component Structure

The landing page follows a **section-based architecture** where each major section is a self-contained component. This approach enables:
- Independent development and testing
- Easy A/B testing of individual sections
- Performance optimization through lazy loading
- Reusability across marketing pages

**Landing Page Component Hierarchy**:
```
app/pages/index.vue (Landing Page)
├── LandingNavigation.vue (Sticky header)
├── LandingHero.vue
├── LandingSocialProof.vue (Logo wall)
├── LandingProblem.vue (Problem/Agitation)
├── LandingSolution.vue (How it works)
├── LandingTestimonials.vue (Social proof & trust)
├── LandingDifferentiation.vue (Comparison table)
├── LandingFAQ.vue (Accordion)
├── LandingFinalCTA.vue
└── LandingFooter.vue
```

### Reusable Component Patterns

**1. CTA Button Component** (`components/landing/CTAButton.vue`)
```vue
<script setup lang="ts">
interface Props {
  variant: 'primary' | 'secondary'
  size: 'small' | 'medium' | 'large'
  text: string
  href?: string
  onClick?: () => void
  trackingId: string // For analytics
}

const props = defineProps<Props>()

const handleClick = () => {
  // Track analytics event
  gtag('event', 'cta_click', {
    cta_location: props.trackingId,
    cta_text: props.text
  })
  
  if (props.onClick) {
    props.onClick()
  }
}
</script>

<template>
  <UButton
    :variant="variant === 'primary' ? 'solid' : 'outline'"
    :size="size"
    :to="href"
    @click="handleClick"
  >
    {{ text }}
  </UButton>
</template>
```

**2. Testimonial Card Component** (`components/landing/TestimonialCard.vue`)
```vue
<script setup lang="ts">
interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  companySize: string
  location: string
  rating: number
  photo?: string
}

defineProps<{
  testimonial: Testimonial
  featured?: boolean
}>()
</script>

<template>
  <UCard :class="featured ? 'col-span-2' : ''">
    <template #header>
      <div class="flex gap-1">
        <Icon 
          v-for="i in testimonial.rating" 
          :key="i" 
          name="lucide:star" 
          class="text-orange-500"
        />
      </div>
    </template>
    
    <p class="text-lg italic">{{ testimonial.quote }}</p>
    
    <template #footer>
      <div class="flex items-center gap-3">
        <img 
          v-if="testimonial.photo"
          :src="testimonial.photo" 
          :alt="testimonial.author"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <p class="font-semibold">{{ testimonial.author }}</p>
          <p class="text-sm text-gray-600">
            {{ testimonial.role }}, {{ testimonial.company }}
          </p>
          <p class="text-xs text-gray-500">
            {{ testimonial.companySize }} | {{ testimonial.location }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>
```

**3. FAQ Accordion Component** (`components/landing/FAQAccordion.vue`)
```vue
<script setup lang="ts">
interface FAQ {
  id: string
  question: string
  answer: string
  icon?: string
}

defineProps<{
  faqs: FAQ[]
}>()

const openItems = ref<string[]>([])

const toggleItem = (id: string) => {
  const index = openItems.value.indexOf(id)
  if (index > -1) {
    openItems.value.splice(index, 1)
  } else {
    openItems.value.push(id)
  }
}
</script>

<template>
  <UAccordion :items="faqs" multiple>
    <template #default="{ item, open }">
      <UButton
        variant="ghost"
        class="w-full justify-between"
        @click="toggleItem(item.id)"
      >
        <span class="flex items-center gap-2">
          <span v-if="item.icon">{{ item.icon }}</span>
          <span>{{ item.question }}</span>
        </span>
        <Icon 
          :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        />
      </UButton>
    </template>
    
    <template #content="{ item }">
      <div class="prose prose-sm" v-html="item.answer" />
    </template>
  </UAccordion>
</template>
```

**4. Stats Card Component** (`components/landing/StatsCard.vue`)
```vue
<script setup lang="ts">
interface Props {
  value: string
  label: string
  source?: string
  color?: 'orange' | 'blue' | 'green'
}

defineProps<Props>()
</script>

<template>
  <UCard>
    <div class="text-center">
      <p 
        class="text-5xl font-bold mb-2"
        :class="{
          'text-orange-500': color === 'orange',
          'text-blue-500': color === 'blue',
          'text-green-500': color === 'green'
        }"
      >
        {{ value }}
      </p>
      <p class="text-base text-gray-700 mb-1">{{ label }}</p>
      <p v-if="source" class="text-xs text-gray-500 italic">{{ source }}</p>
    </div>
  </UCard>
</template>
```

### Form Handling Pattern for Demo Requests

**Demo Request Form Integration with Clerk**:

```typescript
// composables/useDemoRequest.ts
export const useDemoRequest = () => {
  const { signUp } = useClerk()
  const toast = useToast()
  
  const submitDemoRequest = async (formData: {
    fullName: string
    workEmail: string
    company: string
    companySize: string
  }) => {
    try {
      // Create Clerk user with demo request metadata
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
      
      // Track conversion event
      gtag('event', 'conversion', {
        send_to: 'AW-XXXXXXXX/XXXXX',
        event_category: 'lead',
        event_label: 'demo_request_submitted'
      })
      
      // Show success message
      toast.add({
        title: 'Demo Request Received!',
        description: 'Check your email for next steps.',
        color: 'green'
      })
      
      // Redirect to thank you page with calendar booking
      navigateTo('/demo/thank-you')
      
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Please try again or contact support.',
        color: 'red'
      })
    }
  }
  
  return { submitDemoRequest }
}
```

**Form Component** (`components/landing/DemoRequestForm.vue`):
```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
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

const { submitDemoRequest } = useDemoRequest()
const loading = ref(false)

const onSubmit = async (data: z.infer<typeof schema>) => {
  loading.value = true
  try {
    await submitDemoRequest(data)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm :schema="schema" @submit="onSubmit">
    <UFormGroup label="Full Name" name="fullName" required>
      <UInput placeholder="Sarah Mitchell" />
    </UFormGroup>
    
    <UFormGroup label="Work Email" name="workEmail" required>
      <UInput type="email" placeholder="sarah@company.co.za" />
    </UFormGroup>
    
    <UFormGroup label="Company" name="company" required>
      <UInput placeholder="Your Company Name" />
    </UFormGroup>
    
    <UFormGroup label="Company Size" name="companySize" required>
      <USelect :options="[
        { label: '5-20 employees', value: '5-20' },
        { label: '21-50 employees', value: '21-50' },
        { label: '51-100 employees', value: '51-100' },
        { label: '100+ employees', value: '100+' }
      ]" />
    </UFormGroup>
    
    <UButton type="submit" :loading="loading" block>
      Book My Demo
    </UButton>
  </UForm>
</template>
```

### Analytics Event Tracking Architecture

**Analytics Composable** (`composables/useAnalytics.ts`):
```typescript
export const useAnalytics = () => {
  const trackPageView = (pageName: string) => {
    gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    })
  }
  
  const trackScroll = (percent: number) => {
    gtag('event', 'scroll', {
      percent_scrolled: percent
    })
  }
  
  const trackCTAClick = (location: string, text: string) => {
    gtag('event', 'cta_click', {
      cta_location: location,
      cta_text: text
    })
  }
  
  const trackFormInteraction = (formType: string, action: 'start' | 'complete') => {
    gtag('event', `form_${action}`, {
      form_type: formType
    })
  }
  
  const trackVideoPlay = (videoTitle: string, location: string) => {
    gtag('event', 'video_start', {
      video_title: videoTitle,
      video_location: location
    })
  }
  
  return {
    trackPageView,
    trackScroll,
    trackCTAClick,
    trackFormInteraction,
    trackVideoPlay
  }
}
```

**Scroll Depth Tracking** (in landing page):
```typescript
// app/pages/index.vue
const { trackScroll } = useAnalytics()
const scrollDepthTracked = ref<Set<number>>(new Set())

onMounted(() => {
  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    )
    
    const milestones = [25, 50, 75, 100]
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !scrollDepthTracked.value.has(milestone)) {
        trackScroll(milestone)
        scrollDepthTracked.value.add(milestone)
      }
    })
  }
  
  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
```

### Performance Optimization Patterns

**1. Image Optimization Strategy**:
```vue
<!-- Use Nuxt Image for all landing page images -->
<NuxtImg
  src="/images/dashboard-screenshot.png"
  alt="IdeaNexus dashboard"
  format="webp"
  quality="85"
  :width="720"
  :height="540"
  loading="lazy"
  placeholder
  sizes="sm:100vw md:720px"
/>
```

**2. Lazy Loading Sections**:
```vue
<!-- app/pages/index.vue -->
<template>
  <div>
    <!-- Above the fold - load immediately -->
    <LandingNavigation />
    <LandingHero />
    
    <!-- Below the fold - lazy load -->
    <LazyLandingSocialProof />
    <LazyLandingProblem />
    <LazyLandingSolution />
    <LazyLandingTestimonials />
    <LazyLandingDifferentiation />
    <LazyLandingFAQ />
    <LazyLandingFinalCTA />
    <LazyLandingFooter />
  </div>
</template>
```

**3. Critical CSS Inlining**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    inlineSSRStyles: true
  },
  nitro: {
    compressPublicAssets: true
  }
})
```

### Mobile-First Responsive Patterns

**Breakpoint Strategy**:
```typescript
// composables/useBreakpoints.ts
export const useBreakpoints = () => {
  const breakpoints = useBreakpoints({
    mobile: 0,
    tablet: 768,
    desktop: 1200
  })
  
  return {
    isMobile: breakpoints.smaller('tablet'),
    isTablet: breakpoints.between('tablet', 'desktop'),
    isDesktop: breakpoints.greaterOrEqual('desktop')
  }
}
```

**Responsive Component Example**:
```vue
<script setup lang="ts">
const { isMobile, isDesktop } = useBreakpoints()
</script>

<template>
  <div>
    <!-- Mobile: Stacked layout -->
    <div v-if="isMobile" class="flex flex-col gap-4">
      <CTAButton variant="primary" size="large" text="Book Demo" />
      <CTAButton variant="secondary" size="large" text="Start Trial" />
    </div>
    
    <!-- Desktop: Side-by-side layout -->
    <div v-else class="flex gap-6">
      <CTAButton variant="primary" size="large" text="Book Demo" />
      <CTAButton variant="secondary" size="large" text="Start Trial" />
    </div>
  </div>
</template>
```

### SEO Optimization Patterns

**Meta Tags Management**:
```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
useHead({
  title: 'IdeaNexus - Innovation Management for SA SMBs',
  meta: [
    {
      name: 'description',
      content: 'Turn employee ideas into implemented innovations. IdeaNexus is the innovation management platform designed for South African SMBs. 14-day free trial, no credit card required.'
    },
    {
      property: 'og:title',
      content: 'IdeaNexus - Innovation Management for SA SMBs'
    },
    {
      property: 'og:description',
      content: 'Systematic innovation management without enterprise complexity. Trusted by 100+ South African businesses.'
    },
    {
      property: 'og:image',
      content: 'https://ideanexus.co.za/og-image.jpg'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://ideanexus.co.za'
    }
  ]
})

// Structured data for rich snippets
useSchemaOrg([
  {
    '@type': 'SoftwareApplication',
    name: 'IdeaNexus',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '4500',
      priceCurrency: 'ZAR'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47'
    }
  }
])
</script>
```

### A/B Testing Architecture

**Feature Flag Pattern for A/B Tests**:
```typescript
// composables/useABTest.ts
export const useABTest = (testName: string) => {
  const variant = useCookie(`ab_test_${testName}`)
  
  if (!variant.value) {
    // Assign random variant (50/50 split)
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

**Usage in Components**:
```vue
<script setup lang="ts">
const { isVariantA } = useABTest('hero_headline')
</script>

<template>
  <h1 v-if="isVariantA">
    Turn Employee Ideas Into Implemented Innovations
  </h1>
  <h1 v-else>
    Stop Losing Great Ideas to Spreadsheets and Email Threads
  </h1>
</template>
```

### Content Management Pattern for Mock Data

**Nuxt Content Structure for Testimonials**:
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
metrics:
  - label: Employee engagement increase
    value: 23%
  - label: Ideas implemented per year
    value: 24
  - label: Time to first implementation
    value: 90 days
```

**Querying Testimonials**:
```typescript
// composables/useTestimonials.ts
export const useTestimonials = () => {
  const fetchTestimonials = async () => {
    const testimonials = await queryContent('testimonials')
      .sort({ featured: -1, createdAt: -1 })
      .find()
    
    return testimonials
  }
  
  const fetchFeaturedTestimonial = async () => {
    const testimonial = await queryContent('testimonials')
      .where({ featured: true })
      .findOne()
    
    return testimonial
  }
  
  return {
    fetchTestimonials,
    fetchFeaturedTestimonial
  }
}
```

This landing page architecture provides a solid foundation for building a high-converting, performant, and maintainable marketing page that integrates seamlessly with the Clerk authentication system and Nuxt UI component library.
