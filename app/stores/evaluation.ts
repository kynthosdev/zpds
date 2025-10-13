import { defineStore } from 'pinia'
import { evaluationService } from '@/services/evaluation'
import type { Evaluation } from '@/types'
import { reactive, computed, toRefs } from 'vue'

interface EvaluationState {
  evaluations: Map<string, Evaluation[]>
  loading: boolean
  error: string | null
}

/**
 * Pinia store for managing idea evaluations
 *
 * @remarks
 * This store handles CRUD operations for idea evaluations including:
 * - Fetching evaluations for specific ideas
 * - Creating new evaluations
 * - Updating existing evaluations
 * - Deleting evaluations
 * - Managing loading states and errors
 */
export const useEvaluationStore = defineStore('evaluation', () => {
  const state = reactive<EvaluationState>({
    evaluations: new Map(),
    loading: false,
    error: null
  })

  /**
   * Fetch evaluations for a specific idea
   * @param ideaId - The ID of the idea to fetch evaluations for
   */
  async function fetchEvaluations(ideaId: string): Promise<Evaluation[]> {
    try {
      state.loading = true
      state.error = null

      const evaluations = await evaluationService.getEvaluations(ideaId) as Evaluation[]
      state.evaluations.set(ideaId, evaluations)

      return evaluations
    } catch (error: unknown) {
      state.error = 'Failed to fetch evaluations'
      console.error('Error fetching evaluations:', error)
      throw error
    } finally {
      state.loading = false
    }
  }

  /**
   * Create a new evaluation
   * @param data - Evaluation data to create
   */
  async function createEvaluation(data: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt'> & {
    impactScore: number | null
    feasibilityScore: number | null
    resourceScore: number | null
    strategicScore: number | null
    comments: string | null
    recommendation: 'approve' | 'reject' | 'request_info' | null
  }): Promise<Evaluation> {
    try {
      state.loading = true
      state.error = null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const evaluation = await evaluationService.createEvaluation(data as any) as Evaluation

      // Update local cache
      const currentEvaluations = state.evaluations.get(data.ideaId) || []
      state.evaluations.set(data.ideaId, [evaluation, ...currentEvaluations])

      return evaluation
    } catch (error: unknown) {
      state.error = 'Failed to create evaluation'
      console.error('Error creating evaluation:', error)
      throw error
    } finally {
      state.loading = false
    }
  }

  /**
   * Update an existing evaluation
   * @param id - ID of evaluation to update
   * @param data - Partial evaluation data to update
   */
  async function updateEvaluation(id: string, data: Partial<Evaluation>): Promise<Evaluation> {
    try {
      state.loading = true
      state.error = null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const evaluation = await evaluationService.updateEvaluation(id, data as any) as Evaluation

      // Update local cache
      const currentEvaluations = state.evaluations.get(data.ideaId!) || []
      const updatedEvaluations = currentEvaluations.map(e =>
        e.id === id ? { ...e, ...evaluation } : e
      )
      state.evaluations.set(data.ideaId!, updatedEvaluations)

      return evaluation
    } catch (error: unknown) {
      state.error = 'Failed to update evaluation'
      console.error('Error updating evaluation:', error)
      throw error
    } finally {
      state.loading = false
    }
  }

  /**
   * Delete an evaluation
   * @param id - ID of evaluation to delete
   * @param ideaId - ID of the idea the evaluation belongs to
   */
  async function deleteEvaluation(id: string, ideaId: string) {
    try {
      state.loading = true
      state.error = null

      await evaluationService.deleteEvaluation(id)

      // Update local cache
      const currentEvaluations = state.evaluations.get(ideaId) || []
      const updatedEvaluations = currentEvaluations.filter(e => e.id !== id)
      state.evaluations.set(ideaId, updatedEvaluations)

      return { success: true }
    } catch (error: unknown) {
      state.error = 'Failed to delete evaluation'
      console.error('Error deleting evaluation:', error)
      throw error
    } finally {
      state.loading = false
    }
  }

  /**
   * Clear the current error state
   */
  function clearError() {
    state.error = null
  }

  /**
   * Get evaluations for a specific idea
   * @param ideaId - The ID of the idea to get evaluations for
   * @returns Evaluations for the specified idea
   */
  const getEvaluationsForIdea = computed(() => (ideaId: string) => {
    return state.evaluations.get(ideaId) || []
  })

  /**
   * Get current loading state
   */
  const isLoading = computed(() => state.loading)

  /**
   * Get current error message
   */
  const getError = computed(() => state.error)

  return {
    ...toRefs(state),
    fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    clearError,
    getEvaluationsForIdea,
    isLoading,
    getError
  }
})

export type EvaluationStore = ReturnType<typeof useEvaluationStore>
