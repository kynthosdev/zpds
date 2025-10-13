<script setup lang="ts">
import type { Idea } from '~/types'
import { ref } from 'vue'
import IdeaForm from '~/components/ideas/IdeaForm.vue'
import IdeaDetailView from '~/components/ideas/IdeaDetailView.vue'
import InnovationPipeline from '~/components/InnovationPipeline.vue'

definePageMeta({
  layout: 'dashboard'
})

const { data, pending, error, refresh } = useAsyncData('ideas', () => $fetch<Idea[]>('/api/ideas'))

// Simplified columns for table view
const columns = ref([
  {
    accessorKey: 'title',
    header: 'Title',
    sortable: true
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortable: true
  },
  {
    accessorKey: 'department',
    header: 'Department',
    sortable: true
  },
  {
    accessorKey: 'submitter',
    header: 'Submitter',
    sortable: true
  },
  {
    accessorKey: 'createdAt',
    header: 'Submitted',
    sortable: true
  }
])

// State for modals and views
const showSubmissionForm = ref(false)
const showDetailView = ref(false)
const showPipelineView = ref(true)
const selectedIdea = ref<Idea | null>(null)

// Handle idea submission
const handleIdeaSubmit = (ideaData: Omit<Idea, 'id' | 'createdAt'>) => {
  // In a real implementation, this would POST to the API
  console.log('Submitting idea:', ideaData)
  showSubmissionForm.value = false
  // Refresh the data
  refresh()
}

// Handle view idea
const handleViewIdea = (idea: Idea) => {
  selectedIdea.value = idea
  showDetailView.value = true
}

// Handle edit idea
const handleEditIdea = (idea: Idea) => {
  selectedIdea.value = idea
  showSubmissionForm.value = true
}

// Close detail view
const closeDetailView = () => {
  showDetailView.value = false
  selectedIdea.value = null
}

// Close submission form
const closeSubmissionForm = () => {
  showSubmissionForm.value = false
  selectedIdea.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with actions -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Innovation Ideas
      </h1>
      <UButton
        icon="i-lucide-plus"
        @click="showSubmissionForm = true"
      >
        New Idea
      </UButton>
    </div>

    <!-- Toggle between views -->
    <div class="flex space-x-4">
      <UButton
        :variant="showPipelineView ? 'solid' : 'outline'"
        @click="showPipelineView = true"
      >
        Pipeline View
      </UButton>
      <UButton
        :variant="!showPipelineView ? 'solid' : 'outline'"
        @click="showPipelineView = false"
      >
        Table View
      </UButton>
    </div>

    <!-- Loading state -->
    <div
      v-if="pending"
      class="flex items-center justify-center h-64"
    >
      <div class="text-center">
        <div class="i-lucide-loader-circle animate-spin w-8 h-8 mx-auto mb-2" />
        <p>Loading ideas...</p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex items-center justify-center h-64"
    >
      <div class="text-center text-red-500">
        <div class="i-lucide-alert-triangle w-8 h-8 mx-auto mb-2" />
        <p>Failed to load ideas</p>
        <UButton
          class="mt-4"
          @click="() => refresh()"
        >
          Retry
        </UButton>
      </div>
    </div>

    <!-- Pipeline View -->
    <div
      v-else-if="showPipelineView && data"
      class="space-y-6"
    >
      <InnovationPipeline
        :ideas="data"
        @view-idea="handleViewIdea"
        @edit-idea="handleEditIdea"
      />
    </div>

    <!-- Table View -->
    <div
      v-else-if="!showPipelineView && data"
      class="overflow-x-auto"
    >
      <UTable
        :data="data"
        :columns="columns"
        class="min-w-full"
      />
    </div>

    <!-- Idea Submission Form Modal -->
    <UModal v-model:open="showSubmissionForm">
      <template #content>
        <div class="p-4">
          <IdeaForm
            :idea="selectedIdea || undefined"
            @submit="handleIdeaSubmit"
            @cancel="closeSubmissionForm"
          />
        </div>
      </template>
    </UModal>

    <!-- Idea Detail View Modal -->
    <UModal v-model:open="showDetailView">
      <template #content>
        <div class="p-4">
          <IdeaDetailView
            v-if="selectedIdea"
            :idea="selectedIdea"
            @close="closeDetailView"
            @edit="() => {
              showDetailView = false
              showSubmissionForm = true
            }"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
