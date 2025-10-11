import { pgTable, text } from 'drizzle-orm/pg-core'

// Enhanced Users table with role-based access control
export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  email: text('email').notNull().unique()
})
