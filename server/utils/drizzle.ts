import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

import * as schema from '../db/schema'

// Load environment variables from .env file
dotenv.config()

// Use process.env instead of the env object from app/env.mjs
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

// Required for Neon serverless
neonConfig.webSocketConstructor = ws

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(DATABASE_URL)

export const db = drizzle(sql, { schema })
