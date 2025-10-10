import type { Idea } from '~/types'
import type { PipelineData, TimeData, DepartmentData } from '~/components/dashboard/charts/types'

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString()
}

/**
 * Calculate pipeline funnel data from ideas
 */
export const calculatePipelineData = (ideas: Idea[]): PipelineData[] => {
  const statusCounts = {
    submitted: 0,
    under_review: 0,
    approved: 0,
    in_progress: 0,
    implemented: 0
  }

  ideas.forEach((idea) => {
    if (idea.status in statusCounts) {
      statusCounts[idea.status as keyof typeof statusCounts]++
    }
  })

  return [
    { stage: 'Submitted', count: statusCounts.submitted },
    { stage: 'Under Review', count: statusCounts.under_review },
    { stage: 'Approved', count: statusCounts.approved },
    { stage: 'In Progress', count: statusCounts.in_progress },
    { stage: 'Implemented', count: statusCounts.implemented }
  ].filter(item => item.count > 0)
}

/**
 * Calculate ideas over time data
 */
export const calculateIdeasOverTimeData = (ideas: Idea[]): TimeData[] => {
  // Group ideas by date (simplified - using createdAt)
  const dateCounts: Record<string, number> = {}

  ideas.forEach((idea) => {
    if (idea.createdAt) {
      const date = idea.createdAt.split('T')[0] // Extract date part
      if (date) {
        dateCounts[date] = (dateCounts[date] || 0) + 1
      }
    }
  })

  return Object.entries(dateCounts)
    .map(([date, count]) => ({ date: new Date(date), count }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-30) // Last 30 days
}

/**
 * Calculate department distribution data
 */
export const calculateDepartmentData = (ideas: Idea[]): DepartmentData[] => {
  const deptCounts: Record<string, number> = {}

  ideas.forEach((idea) => {
    if (idea.department) {
      const dept = idea.department || 'Unknown'
      deptCounts[dept] = (deptCounts[dept] || 0) + 1
    }
  })

  return Object.entries(deptCounts)
    .map(([department, count]) => ({ department, count }))
}

/**
 * Create x-tick formatter for pipeline chart
 */
export const createPipelineTicks = (labels: string[]) => {
  return (i: number): string => {
    if (i < 0 || i >= labels.length) return ''
    return labels[i] ?? ''
  }
}

/**
 * Create x-tick formatter for time chart
 */
export const createTimeTicks = (labels: string[]) => {
  return (i: number): string => {
    if (i < 0 || i >= labels.length) return ''
    return labels[i] ?? ''
  }
}

/**
 * Create x-tick formatter for department chart
 */
export const createDeptTicks = (labels: string[]) => {
  return (i: number): string => {
    if (i < 0 || i >= labels.length) return ''
    return labels[i] ?? ''
  }
}

/**
 * Create tooltip template for pipeline data
 */
export const createPipelineTemplate = (): (d: PipelineData) => string => {
  return (d: PipelineData) => `${d.stage}: ${d.count} ideas`
}

/**
 * Create tooltip template for time data
 */
export const createTimeTemplate = (): (d: TimeData) => string => {
  return (d: TimeData) => `${formatDate(d.date)}: ${d.count} ideas`
}

/**
 * Create tooltip template for department data
 */
export const createDeptTemplate = (): (d: DepartmentData) => string => {
  return (d: DepartmentData) => `${d.department}: ${d.count} ideas`
}
