<script setup lang="ts">
import { VisXYContainer, VisAxis, VisTooltip, VisCrosshair } from '@unovis/vue'
import type { BaseChartProps } from './types'

interface Props extends BaseChartProps {
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
  color: 'var(--ui-primary)',
  padding: () => ({ top: 20, right: 20, bottom: 40, left: 40 })
})

const containerPadding = computed(() => ({
  top: props.padding?.top ?? 20,
  right: props.padding?.right ?? 20,
  bottom: props.padding?.bottom ?? 40,
  left: props.padding?.left ?? 40
}))
</script>

<template>
  <VisXYContainer
    :data="props.data"
    :padding="containerPadding"
    :width="props.width"
    :height="props.height"
    class="h-full w-full"
  >
    <slot :color="props.color" />
    <VisAxis
      type="x"
    >
      <slot name="x-axis" />
    </VisAxis>
    <VisAxis
      type="y"
    >
      <slot name="y-axis" />
    </VisAxis>
    <VisCrosshair :color="props.color" />
    <VisTooltip />
  </VisXYContainer>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
