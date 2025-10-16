import { db } from '../../utils/drizzle'
import { ideas, users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { z } from 'zod'

// Validation schemas
export const ideaCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  department: z.string().optional(),
  type: z.string().optional(),
  strategy: z.string().optional(),
  workstation: z.string().optional(),
  benefits: z.string().optional(),
  resourcesRequired: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  submitter: z.string().min(1, 'Submitter name is required'),
  evaluator: z.string().optional(),
  impactScore: z.number().min(1).max(10).default(5)
})

export default eventHandler(async (event) => {
  const method = getMethod(event)

  // GET all ideas
  if (method === 'GET') {
    const submitter = alias(users, 'submitter')
    const evaluator = alias(users, 'evaluator')

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

  // POST - Create new idea
  if (method === 'POST') {
    const body = await readBody(event)
    const validatedData = ideaCreateSchema.parse(body)
    const submitterName = validatedData.submitter
    const submitterId = 'addf20c2-230e-41e1-8812-15a378e07688'

    const { submitter, evaluator, ...dbData } = validatedData

    const newIdea = await db.insert(ideas).values({
      ...dbData,
      submitterId,
      status: 'submitted'
    }).returning()

    try {
      console.log(`📧 Email sent to ${submitterName}: Your idea "${newIdea[0].title}" has been submitted successfully!`)
      console.log(`🔔 Notification sent to evaluators: New idea "${newIdea[0].title}" submitted by ${submitterName}`)
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError)
    }

    return {
      id: newIdea[0].id,
      title: newIdea[0].title,
      description: newIdea[0].description,
      status: newIdea[0].status,
      department: newIdea[0].department,
      type: newIdea[0].type,
      strategy: newIdea[0].strategy,
      workstation: newIdea[0].workstation,
      benefits: newIdea[0].benefits,
      resourcesRequired: newIdea[0].resourcesRequired,
      submitter: submitterName,
      evaluator: evaluator || 'Unassigned',
      impactScore: newIdea[0].impactScore,
      createdAt: newIdea[0].createdAt?.toISOString() || new Date().toISOString()
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
