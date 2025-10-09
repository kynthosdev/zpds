<script setup lang="ts">
import type { Idea } from '~/types'

definePageMeta({
  layout: 'dashboard'
})

const { data, pending, error } = useFetch<Idea[]>('/api/ideas')

const columns = ref([
  {
    accessorKey: 'id',
    header: 'ID',
    sortable: true
  },
  {
    accessorKey: 'title',
    header: 'Title',
    sortable: true
  },
  {
    accessorKey: 'description',
    header: 'Description',
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
    accessorKey: 'type',
    header: 'Type',
    sortable: true
  },
  {
    accessorKey: 'strategy',
    header: 'Strategy',
    sortable: true
  },
  {
    accessorKey: 'workstation',
    header: 'Workstation',
    sortable: true
  },
  {
    accessorKey: 'benefits',
    header: 'Benefits',
    sortable: true
  },
  {
    accessorKey: 'resourcesRequired',
    header: 'Resources Required',
    sortable: true
  },
  {
    accessorKey: 'submitter',
    header: 'Submitter',
    sortable: true
  },
  {
    accessorKey: 'evaluator',
    header: 'Evaluator',
    sortable: true
  },
  {
    accessorKey: 'impactScore',
    header: 'Impact Score',
    sortable: true
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    sortable: true
  }
])
</script>

<template>
  <div
    v-if="pending"
    class="flex items-center justify-center h-64"
  >
    <div class="text-center">
      <div class="i-lucide-loader-circle animate-spin w-8 h-8 mx-auto mb-2" />
      <p>Loading ideas...</p>
    </div>
  </div>

  <div
    v-else-if="error"
    class="flex items-center justify-center h-64"
  >
    <div class="text-center text-red-500">
      <div class="i-lucide-alert-triangle w-8 h-8 mx-auto mb-2" />
      <p>Failed to load ideas</p>
    </div>
  </div>

  <div
    v-else
    class="overflow-x-auto"
  >
    <UTable
      :data="data"
      :columns="columns"
      class="min-w-full"
    />
  </div>
</template>
