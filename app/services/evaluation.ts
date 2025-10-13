/**
 * Evaluation service for handling API calls to evaluation endpoints
 */
export const evaluationService = {
  /**
   * Create a new evaluation
   */
  async createEvaluation(data: {
    ideaId: string
    impactScore: number
    feasibilityScore: number
    resourceScore: number
    strategicScore: number
    comments?: string
    recommendation: 'approve' | 'reject' | 'request_info'
  }) {
    try {
      const response = await $fetch('/api/evaluations', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error: unknown) {
      console.error('Error creating evaluation:', error)
      throw error
    }
  },

  /**
   * Get evaluations for a specific idea
   */
  async getEvaluations(ideaId: string) {
    try {
      const response = await $fetch(`/api/evaluations?ideaId=${ideaId}`, {
        method: 'GET'
      })
      return response
    } catch (error: unknown) {
      console.error('Error fetching evaluations:', error)
      throw error
    }
  },

  /**
   * Get a specific evaluation by ID
   */
  async getEvaluation(id: string) {
    try {
      const response = await $fetch(`/api/evaluations?id=${id}`, {
        method: 'GET'
      })
      return response
    } catch (error: unknown) {
      console.error('Error fetching evaluation:', error)
      throw error
    }
  },

  /**
   * Update an evaluation
   */
  async updateEvaluation(id: string, data: Partial<{
    impactScore: number
    feasibilityScore: number
    resourceScore: number
    strategicScore: number
    comments?: string
    recommendation: 'approve' | 'reject' | 'request_info'
  }>) {
    try {
      const response = await $fetch(`/api/evaluations?id=${id}`, {
        method: 'PUT',
        body: data
      })
      return response
    } catch (error: unknown) {
      console.error('Error updating evaluation:', error)
      throw error
    }
  },

  /**
   * Delete an evaluation
   */
  async deleteEvaluation(id: string) {
    try {
      const response = await $fetch(`/api/evaluations?id=${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error: unknown) {
      console.error('Error deleting evaluation:', error)
      throw error
    }
  }
}
