<script setup lang="ts">
import type { Idea } from '~/types'

interface Props {
  ideas: Idea[]
}

const props = defineProps<Props>()

// Calculate stats
const totalIdeas = computed(() => props.ideas.length)
const approvedIdeas = computed(() => props.ideas.filter(idea => idea.status === 'approved').length)
const approvalRate = computed(() => {
  if (totalIdeas.value === 0) return 0
  return Math.round((approvedIdeas.value / totalIdeas.value) * 100)
})
const underReviewIdeas = computed(() => props.ideas.filter(idea => idea.status === 'under_review').length)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Total Ideas
          </p>
          <p class="text-2xl font-bold">
            {{ totalIdeas }}
          </p>
        </div>
        <UIcon
          name="i-lucide-lightbulb"
          class="text-2xl text-blue-600"
        />
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Approved
          </p>
          <p class="text-2xl font-bold">
            {{ approvedIdeas }}
          </p>
        </div>
        <UIcon
          name="i-lucide-check-circle"
          class="text-2xl text-green-600"
        />
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Approval Rate
          </p>
          <p class="text-2xl font-bold">
            {{ approvalRate }}%
          </p>
        </div>
        <UIcon
          name="i-lucide-percent"
          class="text-2xl text-purple-600"
        />
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">
            Under Review
          </p>
          <p class="text-2xl font-bold">
            {{ underReviewIdeas }}
          </p>
        </div>
        <UIcon
          name="i-lucide-eye"
          class="text-2xl text-orange-600"
        />
      </div>
    </UCard>
  </div>
</template>
