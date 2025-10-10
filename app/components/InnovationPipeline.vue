<script setup lang="ts">
import type { Idea, PipelineColumnConfig } from '~/types'
import PipelineColumn from '~/components/ideas/PipelineColumn.vue'

interface Props {
  ideas: Idea[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'view-idea' | 'edit-idea', idea: Idea): void
}>()

// Define pipeline columns configuration
const pipelineColumns: PipelineColumnConfig[] = [
  {
    status: 'submitted',
    title: 'Submitted',
    icon: 'i-lucide-inbox',
    color: 'primary'
  },
  {
    status: 'under_review',
    title: 'Under Review',
    icon: 'i-lucide-eye',
    color: 'warning'
  },
  {
    status: 'approved',
    title: 'Approved',
    icon: 'i-lucide-check-circle',
    color: 'success'
  },
  {
    status: 'in_progress',
    title: 'In Progress',
    icon: 'i-lucide-loader',
    color: 'info'
  },
  {
    status: 'implemented',
    title: 'Implemented',
    icon: 'i-lucide-rocket',
    color: 'success'
  }
]

// Handle view idea event
const handleViewIdea = (idea: Idea) => {
  emit('view-idea', idea)
}

// Handle edit idea event
const handleEditIdea = (idea: Idea) => {
  emit('edit-idea', idea)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
    <PipelineColumn
      v-for="column in pipelineColumns"
      :key="column.status"
      :ideas="props.ideas"
      :status="column.status"
      :title="column.title"
      :icon="column.icon"
      :color="column.color"
      @view-idea="handleViewIdea"
      @edit-idea="handleEditIdea"
    />
  </div>
</template>
