<script setup lang="ts">
import type { Idea } from '~/types'

interface Props {
  idea: Idea
  onClose: () => void
  onEdit: () => void
}

const props = defineProps<Props>()

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
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
  </div>
</template>
