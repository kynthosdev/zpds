import { db } from '../utils/drizzle'
import { ideas, users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { z } from 'zod'

// Validation schemas
const ideaCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  department: z.string().optional(),
  type: z.string().optional(),
  strategy: z.string().optional(),
  workstation: z.string().optional(),
  benefits: z.string().optional(),
  resourcesRequired: z.enum(['low', 'medium', 'high']).optional().default('medium')
})

const ideaUpdateSchema = ideaCreateSchema.partial().extend({
  status: z.enum(['submitted', 'under_review', 'approved', 'in_progress', 'implemented', 'rejected']).optional(),
  impactScore: z.number().min(1).max(5).optional(),
  evaluatorId: z.string().optional()
})

export default eventHandler(async (event) => {
  const method = getMethod(event)

  // GET all ideas
  if (method === 'GET' && !event.context.params?.id) {
    // Create aliases for the users table to avoid conflicts
    const submitter = alias(users, 'submitter')
    const evaluator = alias(users, 'evaluator')

    // Fetch ideas from database with submitter and evaluator information
    const ideasWithUsers = await db.select({
      id: ideas.id,
      title: ideas.title,
      description: ideas.description,
      status: ideas.status,
      department: ideas.department,
      type: ideas.type,
      strategy: ideas.strategy,
      workstation: ideas.workstation,
      benefits: ideas.benefits,
      resourcesRequired: ideas.resourcesRequired,
      impactScore: ideas.impactScore,
      createdAt: ideas.createdAt,
      updatedAt: ideas.updatedAt,
      submitterId: ideas.submitterId,
      evaluatorId: ideas.evaluatorId,
      submitterName: submitter.name,
      submitterEmail: submitter.email,
      evaluatorName: evaluator.name,
      evaluatorEmail: evaluator.email
    })
      .from(ideas)
      .leftJoin(submitter, eq(ideas.submitterId, submitter.id))
      .leftJoin(evaluator, eq(ideas.evaluatorId, evaluator.id))
      .execute()

    // Transform the data to match the expected API structure
    const transformedIdeas = ideasWithUsers.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      status: idea.status,
      department: idea.department,
      type: idea.type,
      strategy: idea.strategy,
      workstation: idea.workstation,
      benefits: idea.benefits,
      resourcesRequired: idea.resourcesRequired,
      submitter: idea.submitterName || 'Unknown',
      evaluator: idea.evaluatorName || 'Unassigned',
      impactScore: idea.impactScore,
      createdAt: idea.createdAt?.toISOString() || new Date().toISOString()
    }))

    return transformedIdeas
  }

  // GET single idea
  if (method === 'GET' && event.context.params?.id) {
    const { id } = event.context.params

    const submitter = alias(users, 'submitter')
    const evaluator = alias(users, 'evaluator')

    const ideaResult = await db.select({
      id: ideas.id,
      title: ideas.title,
      description: ideas.description,
      status: ideas.status,
      department: ideas.department,
      type: ideas.type,
      strategy: ideas.strategy,
      workstation: ideas.workstation,
      benefits: ideas.benefits,
      resourcesRequired: ideas.resourcesRequired,
      impactScore: ideas.impactScore,
      createdAt: ideas.createdAt,
      updatedAt: ideas.updatedAt,
      submitterId: ideas.submitterId,
      evaluatorId: ideas.evaluatorId,
      submitterName: submitter.name,
      submitterEmail: submitter.email,
      evaluatorName: evaluator.name,
      evaluatorEmail: evaluator.email
    })
      .from(ideas)
      .leftJoin(submitter, eq(ideas.submitterId, submitter.id))
      .leftJoin(evaluator, eq(ideas.evaluatorId, evaluator.id))
      .where(eq(ideas.id, id))
      .execute()

    if (ideaResult.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Idea not found'
      })
    }

    const idea = ideaResult[0]
    return {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      status: idea.status,
      department: idea.department,
      type: idea.type,
      strategy: idea.strategy,
      workstation: idea.workstation,
      benefits: idea.benefits,
      resourcesRequired: idea.resourcesRequired,
      submitter: idea.submitterName || 'Unknown',
      evaluator: idea.evaluatorName || 'Unassigned',
      impactScore: idea.impactScore,
      createdAt: idea.createdAt?.toISOString() || new Date().toISOString()
    }
  }

  // POST - Create new idea
  if (method === 'POST') {
    const body = await readBody(event)

    // Validate input
    const validatedData = ideaCreateSchema.parse(body)

    // In a real implementation, get submitterId from authenticated user
    // For now, we'll use a placeholder - this should be replaced with actual auth
    const submitterId = 'placeholder-user-id' // This should come from Clerk auth

    const newIdea = await db.insert(ideas).values({
      ...validatedData,
      submitterId,
      status: 'submitted'
    }).returning()

    return {
      id: newIdea[0].id,
      ...validatedData,
      status: 'submitted',
      submitter: 'Current User', // This should come from auth
      evaluator: 'Unassigned',
      impactScore: null,
      createdAt: new Date().toISOString()
    }
  }

  // PUT - Update idea
  if (method === 'PUT' && event.context.params?.id) {
    const { id } = event.context.params
    const body = await readBody(event)

    // Validate input
    const validatedData = ideaUpdateSchema.parse(body)

    // Check if idea exists
    const existingIdea = await db.select().from(ideas).where(eq(ideas.id, id)).execute()
    if (existingIdea.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Idea not found'
      })
    }

    const updatedIdea = await db.update(ideas)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(ideas.id, id))
      .returning()

    return {
      id: updatedIdea[0].id,
      title: updatedIdea[0].title,
      description: updatedIdea[0].description,
      status: updatedIdea[0].status,
      department: updatedIdea[0].department,
      type: updatedIdea[0].type,
      strategy: updatedIdea[0].strategy,
      workstation: updatedIdea[0].workstation,
      benefits: updatedIdea[0].benefits,
      resourcesRequired: updatedIdea[0].resourcesRequired,
      submitter: 'Current User', // This should come from auth
      evaluator: 'Unassigned',
      impactScore: updatedIdea[0].impactScore,
      createdAt: updatedIdea[0].createdAt?.toISOString() || new Date().toISOString()
    }
  }

  // DELETE idea
  if (method === 'DELETE' && event.context.params?.id) {
    const { id } = event.context.params

    // Check if idea exists
    const existingIdea = await db.select().from(ideas).where(eq(ideas.id, id)).execute()
    if (existingIdea.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Idea not found'
      })
    }

    await db.delete(ideas).where(eq(ideas.id, id)).execute()

    return { message: 'Idea deleted successfully' }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
