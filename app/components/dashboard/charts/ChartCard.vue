<script setup lang="ts">
import type { ChartCardProps } from './types'

interface CardUI {
  body?: string
}

interface Props extends ChartCardProps {
  class?: string
  ui?: CardUI
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: '',
  icon: '',
  loading: false,
  empty: false,
  emptyMessage: 'No data available',
  class: '',
  ui: () => ({ body: '!px-0 !pt-0 !pb-3' })
})
</script>

<template>
  <UCard
    :class="['h-80', props.class]"
    :ui="ui"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ title }}
        </h3>
        <UTooltip
          v-if="tooltip"
          :text="tooltip"
        >
          <UIcon
            :name="icon || 'i-lucide-info'"
            class="text-muted"
          />
        </UTooltip>
      </div>
    </template>

    <div
      v-if="loading"
      class="h-full flex items-center justify-center"
    >
      <UProgress
        variant="bar"
        size="sm"
        class="w-48"
      />
    </div>

    <div
      v-else-if="empty"
      class="h-full flex items-center justify-center text-muted"
    >
      <p>{{ emptyMessage }}</p>
    </div>

    <div
      v-else
      class="h-64"
    >
      <slot />
    </div>
  </UCard>
</template>
