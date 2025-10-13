import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core'

// Users table with Clerk integration
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(), // Clerk user ID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('user'), // user, admin, evaluator
  department: text('department'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Ideas table based on API structure
export const ideas = pgTable('ideas', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  submitterId: uuid('submitter_id').references(() => users.id).notNull(),
  status: text('status').default('submitted'), // submitted, under_review, approved, in_progress, implemented, rejected
  department: text('department'),
  type: text('type'), // Time saving, Improvement, Safety, Product, Cost saving, Other
  strategy: text('strategy'), // Various strategy types from the API
  workstation: text('workstation'),
  benefits: text('benefits'),
  resourcesRequired: text('resources_required').default('medium'), // low, medium, high
  evaluatorId: uuid('evaluator_id').references(() => users.id),
  impactScore: integer('impact_score').default(3),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
