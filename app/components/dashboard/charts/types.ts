// Chart data interfaces
export interface PipelineData {
  stage: string
  count: number
}

export interface TimeData {
  date: Date
  count: number
}

export interface DepartmentData {
  department: string
  count: number
}

// Chart configuration
export interface ChartConfig {
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  colors: {
    pipeline: string
    time: string
    department: string
    approval: string
  }
}

// Chart component props
export interface BaseChartProps<T = unknown> {
  data: T[]
  width?: number
  height?: number
  color?: string
}

export interface BarChartProps<T = unknown> extends BaseChartProps<T> {
  x: (d: T, i: number) => number
  y: (d: T) => number
}

export interface ChartCardProps {
  title: string
  tooltip?: string
  icon?: string
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
}

// Type guards
export const isPipelineData = (data: unknown): data is PipelineData => {
  const d = data as Record<string, unknown>
  return typeof d.stage === 'string' && typeof d.count === 'number'
}

export const isTimeData = (data: unknown): data is TimeData => {
  const d = data as Record<string, unknown>
  return d.date instanceof Date && typeof d.count === 'number'
}

export const isDepartmentData = (data: unknown): data is DepartmentData => {
  const d = data as Record<string, unknown>
  return typeof d.department === 'string' && typeof d.count === 'number'
}
