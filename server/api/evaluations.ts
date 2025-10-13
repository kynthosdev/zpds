import { db } from '../utils/drizzle'
import { evaluations, ideas, users } from '../db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'
import type { H3Event } from 'h3'

// Schema for evaluation creation
const createEvaluationSchema = z.object({
  ideaId: z.string().uuid(),
  impactScore: z.number().min(1).max(5),
  feasibilityScore: z.number().min(1).max(5),
  resourceScore: z.number().min(1).max(5),
  strategicScore: z.number().min(1).max(5),
  comments: z.string().optional(),
  recommendation: z.enum(['approve', 'reject', 'request_info'])
})

// Schema for evaluation update
const updateEvaluationSchema = z.object({
  impactScore: z.number().min(1).max(5).optional(),
  feasibilityScore: z.number().min(1).max(5).optional(),
  resourceScore: z.number().min(1).max(5).optional(),
  strategicScore: z.number().min(1).max(5).optional(),
  comments: z.string().optional(),
  recommendation: z.enum(['approve', 'reject', 'request_info']).optional()
})

export default defineEventHandler(async (event) => {
  const { method } = event.node.req

  // For now, we'll make this endpoint public for testing
  // In production, this would require authentication

  switch (method) {
    case 'GET':
      return await handleGetEvaluations(event)
    case 'POST':
      return await handleCreateEvaluation(event)
    case 'PUT':
      return await handleUpdateEvaluation(event)
    case 'DELETE':
      return await handleDeleteEvaluation(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

// Handle GET requests for evaluations
async function handleGetEvaluations(event: H3Event) {
  const { ideaId } = getQuery(event)

  if (ideaId) {
    // Get all evaluations for a specific idea
    const evaluationsData = await db.select({
      id: evaluations.id,
      ideaId: evaluations.ideaId,
      evaluatorId: evaluations.evaluatorId,
      impactScore: evaluations.impactScore,
      feasibilityScore: evaluations.feasibilityScore,
      resourceScore: evaluations.resourceScore,
      strategicScore: evaluations.strategicScore,
      comments: evaluations.comments,
      recommendation: evaluations.recommendation,
      status: evaluations.status,
      createdAt: evaluations.createdAt,
      updatedAt: evaluations.updatedAt,
      evaluatorName: users.name
    })
      .from(evaluations)
      .leftJoin(users, eq(evaluations.evaluatorId, users.id))
      .where(eq(evaluations.ideaId, ideaId as string))
      .orderBy(desc(evaluations.createdAt))

    return evaluationsData
  } else {
    // Get all evaluations (for admin purposes)
    const evaluationsData = await db.select({
      id: evaluations.id,
      ideaId: evaluations.ideaId,
      evaluatorId: evaluations.evaluatorId,
      impactScore: evaluations.impactScore,
      feasibilityScore: evaluations.feasibilityScore,
      resourceScore: evaluations.resourceScore,
      strategicScore: evaluations.strategicScore,
      comments: evaluations.comments,
      recommendation: evaluations.recommendation,
      status: evaluations.status,
      createdAt: evaluations.createdAt,
      updatedAt: evaluations.updatedAt,
      ideaTitle: ideas.title,
      ideaStatus: ideas.status,
      evaluatorName: users.name
    })
      .from(evaluations)
      .leftJoin(ideas, eq(evaluations.ideaId, ideas.id))
      .leftJoin(users, eq(evaluations.evaluatorId, users.id))
      .orderBy(desc(evaluations.createdAt))

    return evaluationsData
  }
}

// Handle POST requests for creating evaluations
async function handleCreateEvaluation(event: H3Event) {
  try {
    const body = await readBody(event)
    const validatedData = createEvaluationSchema.parse(body)

    // Check if idea exists
    const ideaExists = await db.select({ id: ideas.id })
      .from(ideas)
      .where(eq(ideas.id, validatedData.ideaId))
      .limit(1)

    if (!ideaExists.length) {
      throw createError({
        statusCode: 404,
        message: 'Idea not found'
      })
    }

    // For now, we'll leave evaluatorId as null for testing
    // In production this would come from authenticated user
    const evaluatorId = null // No evaluator for now

    // Create the evaluation
    const [createdEvaluation] = await db.insert(evaluations)
      .values({
        ...validatedData,
        evaluatorId: evaluatorId
      })
      .returning()

    // Update idea status if evaluation is complete
    if (validatedData.recommendation) {
      await db.update(ideas)
        .set({
          status: validatedData.recommendation === 'approve'
            ? 'approved'
            : validatedData.recommendation === 'reject' ? 'rejected' : 'under_review'
        })
        .where(eq(ideas.id, validatedData.ideaId))
    }

    return createdEvaluation
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: error.flatten().fieldErrors
      })
    }
    throw error
  }
}

// Handle PUT requests for updating evaluations
async function handleUpdateEvaluation(event: H3Event) {
  try {
    const { id } = getQuery(event)
    const body = await readBody(event)
    const validatedData = updateEvaluationSchema.parse(body)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Evaluation ID is required'
      })
    }

    // Update the evaluation
    const [updatedEvaluation] = await db.update(evaluations)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(evaluations.id, id as string))
      .returning()

    // Update idea status if recommendation changed
    if (validatedData.recommendation) {
      // Get the idea ID to update the status
      const evaluation = await db.select({ ideaId: evaluations.ideaId })
        .from(evaluations)
        .where(eq(evaluations.id, id as string))
        .limit(1)

      if (evaluation.length) {
        await db.update(ideas)
          .set({
            status: validatedData.recommendation === 'approve'
              ? 'approved'
              : validatedData.recommendation === 'reject' ? 'rejected' : 'under_review'
          })
          .where(eq(ideas.id, evaluation[0].ideaId))
      }
    }

    return updatedEvaluation
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: error.flatten().fieldErrors
      })
    }
    throw error
  }
}

// Handle DELETE requests for evaluations
async function handleDeleteEvaluation(event: H3Event) {
  const { id } = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Evaluation ID is required'
    })
  }

  // Delete the evaluation
  await db.delete(evaluations)
    .where(eq(evaluations.id, id as string))

  return { message: 'Evaluation deleted successfully' }
}
