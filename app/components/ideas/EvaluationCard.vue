<script setup lang="ts">
const props = defineProps<{
  evaluation: {
    id: string
    impactScore: number
    feasibilityScore: number
    resourceScore: number
    strategicScore: number
    comments?: string
    recommendation: 'approve' | 'reject' | 'request_info'
    createdAt: string
    evaluatorName?: string
  }
}>()

// Access props to avoid unused variable warning
const { evaluation } = props
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <div class="flex justify-between items-center">
        <h4 class="font-semibold">
          Evaluation
        </h4>
        <span class="text-sm text-gray-500">
          {{ new Date(evaluation.createdAt).toLocaleDateString() }}
        </span>
      </div>
      <p class="text-sm text-gray-600">
        By {{ evaluation.evaluatorName || 'Unknown Evaluator' }}
      </p>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div>
        <p class="text-sm text-gray-500">
          Impact
        </p>
        <p class="font-semibold">
          {{ evaluation.impactScore }}/5
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500">
          Feasibility
        </p>
        <p class="font-semibold">
          {{ evaluation.feasibilityScore }}/5
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500">
          Resources
        </p>
        <p class="font-semibold">
          {{ evaluation.resourceScore }}/5
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500">
          Strategic
        </p>
        <p class="font-semibold">
          {{ evaluation.strategicScore }}/5
        </p>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-sm text-gray-500">
        Recommendation
      </p>
      <p class="font-semibold capitalize">
        {{ evaluation.recommendation.replace('_', ' ') }}
      </p>
    </div>

    <div
      v-if="evaluation.comments"
      class="mb-4"
    >
      <p class="text-sm text-gray-500">
        Comments
      </p>
      <p class="text-gray-700">
        {{ evaluation.comments }}
      </p>
    </div>
  </UCard>
</template>
