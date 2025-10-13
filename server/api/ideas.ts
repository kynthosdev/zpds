import { db } from '../utils/drizzle'
import { ideas, users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

export default eventHandler(async () => {
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
})
