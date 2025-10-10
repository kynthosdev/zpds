<script setup lang="ts">
import type { Idea, IdeaStatus } from '~/types'

interface Props {
  ideas: Idea[]
  status: IdeaStatus
  title: string
  icon: string
  color: 'primary' | 'warning' | 'success' | 'info' | 'error'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'view-idea' | 'edit-idea', idea: Idea): void
}>()

// Get badge color based on impact score
const getImpactColor = (score: number) => {
  if (score >= 8) return 'success'
  if (score >= 5) return 'warning'
  return 'error'
}

// Get status badge color
const getStatusColor = (status: IdeaStatus): 'primary' | 'warning' | 'success' | 'info' | 'error' => {
  const colors: Record<IdeaStatus, 'primary' | 'warning' | 'success' | 'info' | 'error'> = {
    submitted: 'primary',
    under_review: 'warning',
    approved: 'success',
    in_progress: 'info',
    implemented: 'success',
    rejected: 'error'
  }
  return colors[status] || 'primary'
}

// Get status display text
const getStatusText = (status: IdeaStatus) => {
  const texts: Record<IdeaStatus, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    in_progress: 'In Progress',
    implemented: 'Implemented',
    rejected: 'Rejected'
  }
  return texts[status] || status
}

// Filter ideas by status
const filteredIdeas = computed(() => {
  return props.ideas.filter(idea => idea.status === props.status)
})

// Count of ideas in this column
const ideaCount = computed(() => filteredIdeas.value.length)

// Handle idea click
const handleIdeaClick = (idea: Idea) => {
  emit('view-idea', idea)
}

// Handle edit click
const handleEditClick = (idea: Idea, event: Event) => {
  event.stopPropagation()
  emit('edit-idea', idea)
}
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <h3 class="font-semibold mb-4 flex items-center gap-2">
      <UIcon
        :name="icon"
        :class="`text-${color}-600 dark:text-${color}-400`"
      />
      {{ title }}
      <UBadge :color="color">
        {{ ideaCount }}
      </UBadge>
    </h3>
    <div class="space-y-3">
      <div
        v-for="idea in filteredIdeas"
        :key="idea.id"
        class="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-md transition-shadow"
        @click="handleIdeaClick(idea)"
      >
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
            {{ idea.title }}
          </h4>
          <UButton
            variant="ghost"
            size="xs"
            icon="i-lucide-more-horizontal"
            @click.stop="handleEditClick(idea, $event)"
          />
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {{ idea.description }}
        </p>
        <div class="flex flex-wrap gap-1 mb-2">
          <UBadge
            size="xs"
            :color="getImpactColor(idea.impactScore)"
          >
            Impact: {{ idea.impactScore }}/10
          </UBadge>
          <UBadge
            size="xs"
            :color="getStatusColor(idea.status)"
          >
            {{ getStatusText(idea.status) }}
          </UBadge>
        </div>
        <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{{ idea.submitter }}</span>
          <span>{{ idea.department }}</span>
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {{ new Date(idea.createdAt).toLocaleDateString() }}
        </div>
      </div>
      <div
        v-if="filteredIdeas.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <div class="i-lucide-inbox w-8 h-8 mx-auto mb-2 opacity-50" />
        <p class="text-sm">
          No ideas in this stage
        </p>
      </div>
    </div>
  </div>
</template>
