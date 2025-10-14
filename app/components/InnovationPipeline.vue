<script setup lang="ts">
import type { Idea, PipelineColumnConfig } from '~/types'
import PipelineColumn from '~/components/ideas/PipelineColumn.vue'

interface Props {
  ideas: Idea[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'view-idea' | 'edit-idea' | 'update-idea', idea: Idea): void
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

// Reactive arrays for each status group
const submittedIdeas = ref<Idea[]>([])
const underReviewIdeas = ref<Idea[]>([])
const approvedIdeas = ref<Idea[]>([])
const inProgressIdeas = ref<Idea[]>([])
const implementedIdeas = ref<Idea[]>([])

// Watch for changes in props.ideas and update status groups
watch(() => props.ideas, (newIdeas) => {
  submittedIdeas.value = newIdeas.filter(idea => idea.status === 'submitted')
  underReviewIdeas.value = newIdeas.filter(idea => idea.status === 'under_review')
  approvedIdeas.value = newIdeas.filter(idea => idea.status === 'approved')
  inProgressIdeas.value = newIdeas.filter(idea => idea.status === 'in_progress')
  implementedIdeas.value = newIdeas.filter(idea => idea.status === 'implemented')
}, { immediate: true })

// Get the appropriate ideas array for a column
const getIdeasForColumn = (status: PipelineColumnConfig['status']) => {
  switch (status) {
    case 'submitted': return submittedIdeas.value
    case 'under_review': return underReviewIdeas.value
    case 'approved': return approvedIdeas.value
    case 'in_progress': return inProgressIdeas.value
    case 'implemented': return implementedIdeas.value
    default: return []
  }
}

// Handle view idea event
const handleViewIdea = (idea: Idea) => {
  emit('view-idea', idea)
}

// Handle edit idea event
const handleEditIdea = (idea: Idea) => {
  emit('edit-idea', idea)
}

// Handle idea update event (when dragged to new column)
const handleUpdateIdea = (idea: Idea) => {
  emit('update-idea', idea)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
    <PipelineColumn
      v-for="column in pipelineColumns"
      :key="column.status"
      :ideas="getIdeasForColumn(column.status)"
      :status="column.status"
      :title="column.title"
      :icon="column.icon"
      :color="column.color"
      @view-idea="handleViewIdea"
      @edit-idea="handleEditIdea"
      @update-idea="handleUpdateIdea"
    />
  </div>
</template>
