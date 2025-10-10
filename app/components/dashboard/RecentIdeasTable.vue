<script setup lang="ts">
import type { Idea } from '~/types'

interface Props {
  ideas: Idea[]
}

const props = defineProps<Props>()

// Get recent ideas (first 10)
const recentIdeas = computed(() => props.ideas.slice(0, 10))
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">
      Recent Ideas
    </h2>
    <UCard>
      <UTable
        :data="recentIdeas"
        :columns="[
          { accessorKey: 'title', header: 'Title' },
          { accessorKey: 'department', header: 'Department' },
          { accessorKey: 'submitter', header: 'Submitter' },
          { accessorKey: 'status', header: 'Status' },
          { accessorKey: 'createdAt', header: 'Date' }
        ]"
      />
    </UCard>
  </div>
</template>
