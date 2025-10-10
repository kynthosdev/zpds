<script setup lang="ts" generic="T">
import { VisGroupedBar } from '@unovis/vue'
import type { BarChartProps } from './types'

const props = defineProps<BarChartProps<T>>()
</script>

<template>
  <VisGroupedBar
    :x="props.x"
    :y="props.y"
    :color="props.color"
    :data="props.data"
  />
</template>
