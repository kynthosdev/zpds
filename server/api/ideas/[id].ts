import { db } from '../../utils/drizzle'
import { ideas, users, evaluations } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { ideaCreateSchema } from './index'
import { eventHandler, getMethod, readBody, createError } from 'h3'

// Validation schema for updates
const ideaUpdateSchema = ideaCreateSchema.partial().extend({
  status: z.enum(['submitted', 'under_review', 'approved', 'in_progress', 'implemented', 'rejected']).optional(),
  impactScore: z.number().min(1).max(10).optional(),
  evaluatorId: z.string().optional()
})

export default eventHandler(async (event) => {
  const method = getMethod(event)
  const { id } = event.context.params as { id: string }

  // GET single idea
  if (method === 'GET') {
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

  // PUT - Full update idea
  if (method === 'PUT') {
    const body = await readBody(event)
    const validatedData = ideaUpdateSchema.parse(body)

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
      submitter: 'Current User', // TODO: Replace with auth
      evaluator: 'Unassigned',
      impactScore: updatedIdea[0].impactScore,
      createdAt: updatedIdea[0].createdAt?.toISOString() || new Date().toISOString()
    }
  }

  // PATCH - Partial update idea
  if (method === 'PATCH') {
    const body = await readBody(event)
    const validatedData = ideaUpdateSchema.parse(body)

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
      submitter: 'Current User', // TODO: Replace with auth
      evaluator: 'Unassigned',
      impactScore: updatedIdea[0].impactScore,
      createdAt: updatedIdea[0].createdAt?.toISOString() || new Date().toISOString()
    }
  }

  // DELETE idea
  if (method === 'DELETE') {
    const existingIdea = await db.select().from(ideas).where(eq(ideas.id, id)).execute()
    if (existingIdea.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Idea not found'
      })
    }

    // Cascade delete related evaluations first
    await db.delete(evaluations).where(eq(evaluations.ideaId, id)).execute()

    // Then delete the idea
    await db.delete(ideas).where(eq(ideas.id, id)).execute()
    return { message: 'Idea deleted successfully' }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
