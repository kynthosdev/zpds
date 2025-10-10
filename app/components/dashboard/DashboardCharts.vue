<script setup lang="ts">
import { VisAxis } from '@unovis/vue'
import { useChartData } from '~/composables/useChartData'
import { useElementSize } from '@vueuse/core'
import type { Idea } from '~/types'
import ChartCard from './charts/ChartCard.vue'
import BaseChart from './charts/BaseChart.vue'
import BarChart from './charts/BarChart.vue'

const cardRef = useTemplateRef<HTMLElement | null>('cardRef')

interface Props {
  ideas: Idea[]
}

const props = defineProps<Props>()

// Use the new composable for all chart data
const {
  pipelineData,
  ideasOverTimeData,
  departmentData,
  pipelineTicks,
  timeTicks,
  deptTicks,
  pipelineX,
  pipelineY,
  timeX,
  timeY,
  deptX,
  deptY
} = useChartData(props.ideas)

// Chart dimensions
const { width } = useElementSize(cardRef)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <!-- Pipeline Funnel Chart -->
    <ChartCard
      title="Innovation Pipeline"
      tooltip="Shows the flow of ideas through different stages"
      icon="i-lucide-info"
      :empty="pipelineData.length === 0"
    >
      <BaseChart
        :data="pipelineData"
        :width="width"
        color="var(--ui-primary)"
      >
        <template #default>
          <BarChart
            :data="pipelineData"
            :x="pipelineX"
            :y="pipelineY"
            color="var(--ui-primary)"
          />
        </template>
        <template #x-axis>
          <VisAxis
            type="x"
            :x="pipelineX"
            :tick-format="pipelineTicks"
          />
        </template>
        <template #y-axis>
          <VisAxis
            type="y"
            :y="pipelineY"
          />
        </template>
      </BaseChart>
    </ChartCard>

    <!-- Ideas Over Time Chart -->
    <ChartCard
      title="Ideas Over Time"
      tooltip="Track innovation activity trends"
      icon="i-lucide-trending-up"
      :empty="ideasOverTimeData.length === 0"
    >
      <BaseChart
        :data="ideasOverTimeData"
        :width="width"
        color="var(--ui-success)"
      >
        <template #default>
          <BarChart
            :data="ideasOverTimeData"
            :x="timeX"
            :y="timeY"
            color="var(--ui-success)"
          />
        </template>
        <template #x-axis>
          <VisAxis
            type="x"
            :x="timeX"
            :tick-format="timeTicks"
          />
        </template>
        <template #y-axis>
          <VisAxis
            type="y"
            :y="timeY"
          />
        </template>
      </BaseChart>
    </ChartCard>

    <!-- Department Distribution Chart -->
    <ChartCard
      title="Department Distribution"
      tooltip="Ideas by department"
      icon="i-lucide-users"
      :empty="departmentData.length === 0"
    >
      <BaseChart
        :data="departmentData"
        :width="width"
        color="var(--ui-warning)"
      >
        <template #default>
          <BarChart
            :data="departmentData"
            :x="deptX"
            :y="deptY"
            color="var(--ui-warning)"
          />
        </template>
        <template #x-axis>
          <VisAxis
            type="x"
            :x="deptX"
            :tick-format="deptTicks"
          />
        </template>
        <template #y-axis>
          <VisAxis
            type="y"
            :y="deptY"
          />
        </template>
      </BaseChart>
    </ChartCard>

    <!-- Approval Rate Chart -->
    <ChartCard
      title="Approval Rate"
      tooltip="Approval rate trends"
      icon="i-lucide-percent"
    >
      <div class="h-full flex items-center justify-center text-muted">
        <p>Chart coming soon...</p>
      </div>
    </ChartCard>
  </div>
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
