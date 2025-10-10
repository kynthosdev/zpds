import { computed } from 'vue'
import type { Idea } from '~/types'
import {
  calculatePipelineData,
  calculateIdeasOverTimeData,
  calculateDepartmentData,
  createPipelineTicks,
  createTimeTicks,
  createDeptTicks,
  createPipelineTemplate,
  createTimeTemplate,
  createDeptTemplate,
  formatDate
} from '~/utils/chartHelpers'
import type { PipelineData, TimeData, DepartmentData } from '~/components/dashboard/charts/types'

/**
 * Shared chart data composable
 */
export const useChartData = (ideas: Idea[]) => {
  // Calculate all chart data
  const pipelineData = computed<PipelineData[]>(() => calculatePipelineData(ideas))
  const ideasOverTimeData = computed<TimeData[]>(() => calculateIdeasOverTimeData(ideas))
  const departmentData = computed<DepartmentData[]>(() => calculateDepartmentData(ideas))

  // Calculate chart labels
  const pipelineLabels = computed<string[]>(() => {
    return pipelineData.value.map(item => item.stage)
  })

  const timeLabels = computed<string[]>(() => {
    return ideasOverTimeData.value.map(item => formatDate(item.date))
  })

  const deptLabels = computed<string[]>(() => {
    return departmentData.value.map(item => item.department)
  })

  // Create tick formatters
  const pipelineTicks = computed(() => createPipelineTicks(pipelineLabels.value))
  const timeTicks = computed(() => createTimeTicks(timeLabels.value))
  const deptTicks = computed(() => createDeptTicks(deptLabels.value))

  // Create tooltip templates
  const pipelineTemplate = createPipelineTemplate()
  const timeTemplate = createTimeTemplate()
  const deptTemplate = createDeptTemplate()

  // Chart accessors
  const pipelineX = (_: PipelineData, i: number) => i
  const pipelineY = (d: PipelineData) => d.count

  const timeX = (_: TimeData, i: number) => i
  const timeY = (d: TimeData) => d.count

  const deptX = (_: DepartmentData, i: number) => i
  const deptY = (d: DepartmentData) => d.count

  return {
    // Data
    pipelineData,
    ideasOverTimeData,
    departmentData,

    // Labels
    pipelineLabels,
    timeLabels,
    deptLabels,

    // Ticks
    pipelineTicks,
    timeTicks,
    deptTicks,

    // Templates
    pipelineTemplate,
    timeTemplate,
    deptTemplate,

    // Accessors
    pipelineX,
    pipelineY,
    timeX,
    timeY,
    deptX,
    deptY
  }
}
