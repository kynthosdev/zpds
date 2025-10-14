<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Idea } from '~/types'
import { useEvaluationStore } from '@/stores/evaluation'
import EvaluationForm from './EvaluationForm.vue'
import EvaluationCard from './EvaluationCard.vue'

interface Props {
  idea: Idea
  onClose: () => void
  onEdit: () => void
}

const props = defineProps<Props>()
const evaluationStore = useEvaluationStore()

const showEvaluationForm = ref(false)
const error = ref<string | null>(null)

const getStatusColor = (status: string): 'primary' | 'warning' | 'success' | 'info' | 'error' => {
  const colors: Record<string, 'primary' | 'warning' | 'success' | 'info' | 'error'> = {
    submitted: 'primary',
    under_review: 'warning',
    approved: 'success',
    in_progress: 'info',
    implemented: 'success',
    rejected: 'error'
  }
  return colors[status] || 'primary'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    in_progress: 'In Progress',
    implemented: 'Implemented',
    rejected: 'Rejected'
  }
  return texts[status] || status
}

const getImpactColor = (score: number) => {
  if (score >= 8) return 'success'
  if (score >= 5) return 'warning'
  return 'error'
}

const getResourcesText = (resources: string) => {
  const texts: Record<string, string> = {
    low: 'Low - Minimal resources required',
    medium: 'Medium - Moderate resources required',
    high: 'High - Significant resources required'
  }
  return texts[resources] || resources
}

// Load evaluations when component mounts
onMounted(async () => {
  if (props.idea.id) {
    try {
      await evaluationStore.fetchEvaluations(props.idea.id)
    } catch (err) {
      error.value = 'Failed to load evaluations'
      console.error('Error loading evaluations:', err)
    }
  }
})

// Handle form submission
const handleEvaluationSubmitted = async () => {
  showEvaluationForm.value = false
  // Refresh evaluations
  if (props.idea.id) {
    try {
      await evaluationStore.fetchEvaluations(props.idea.id)
    } catch (err) {
      error.value = 'Failed to refresh evaluations'
      console.error('Error refreshing evaluations:', err)
    }
  }
}

// Handle form cancellation
const handleEvaluationCancelled = () => {
  showEvaluationForm.value = false
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
    <div class="flex justify-between items-start mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ idea.title }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <UBadge :color="getStatusColor(idea.status)">
            {{ getStatusText(idea.status) }}
          </UBadge>
          <UBadge :color="getImpactColor(idea.impactScore)">
            Impact: {{ idea.impactScore }}/10
          </UBadge>
          <UBadge color="primary">
            {{ idea.department }}
          </UBadge>
        </div>
      </div>
      <UButton
        variant="ghost"
        icon="i-lucide-x"
        @click="props.onClose"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Submitter
        </h3>
        <p class="text-gray-900 dark:text-white">
          {{ idea.submitter }}
        </p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Evaluator
        </h3>
        <p class="text-gray-900 dark:text-white">
          {{ idea.evaluator || 'Not assigned' }}
        </p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Submitted
        </h3>
        <p class="text-gray-900 dark:text-white">
          {{ new Date(idea.createdAt).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Description
        </h3>
        <p class="text-gray-900 dark:text-white whitespace-pre-wrap">
          {{ idea.description }}
        </p>
      </div>
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Type
          </h3>
          <p class="text-gray-900 dark:text-white">
            {{ idea.type || 'Not specified' }}
          </p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Strategy
          </h3>
          <p class="text-gray-900 dark:text-white">
            {{ idea.strategy || 'Not specified' }}
          </p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Workstation
          </h3>
          <p class="text-gray-900 dark:text-white">
            {{ idea.workstation || 'Not specified' }}
          </p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Resources Required
          </h3>
          <p class="text-gray-900 dark:text-white">
            {{ getResourcesText(idea.resourcesRequired) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Expected Benefits
      </h3>
      <p class="text-gray-900 dark:text-white whitespace-pre-wrap">
        {{ idea.benefits || 'No benefits specified' }}
      </p>
    </div>

    <div class="flex justify-end space-x-3">
      <UButton
        variant="outline"
        @click="props.onClose"
      >
        Close
      </UButton>
      <UButton
        @click="props.onEdit"
      >
        Edit Idea
      </UButton>
    </div>

    <!-- Evaluations Section -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Evaluations
        </h3>
        <UButton
          v-if="!showEvaluationForm"
          @click="showEvaluationForm = true"
        >
          Add Evaluation
        </UButton>
      </div>

      <!-- Evaluation Form -->
      <div
        v-if="showEvaluationForm"
        class="mb-6"
      >
        <EvaluationForm
          :idea-id="idea.id.toString()"
          @submitted="handleEvaluationSubmitted"
          @cancelled="handleEvaluationCancelled"
        />
      </div>

      <!-- Evaluations List -->
      <div v-else>
        <div
          v-if="evaluationStore.loading"
          class="text-center py-4"
        >
          <USpinner />
        </div>
        <div
          v-else-if="evaluationStore.error"
          class="text-red-500 text-center py-4"
        >
          {{ evaluationStore.error }}
        </div>
        <div
          v-else-if="evaluationStore.evaluations.get(idea.id)?.length === 0"
          class="text-center py-4 text-gray-500"
        >
          No evaluations yet
        </div>
        <div
          v-else
          class="space-y-4"
        >
          <EvaluationCard
            v-for="evaluation in evaluationStore.evaluations.get(idea.id)"
            :key="evaluation.id"
            :evaluation="evaluation"
          />
        </div>
      </div>
    </div>
  </div>
</template>
