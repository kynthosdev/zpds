<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Idea } from '~/types'

interface Props {
  idea?: Idea
  onSubmit: (idea: Partial<Idea> & Pick<Idea, 'title' | 'description' | 'department' | 'submitter' | 'status'>) => void
  onCancel: () => void
}

const props = defineProps<Props>()

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  department: z.string().min(1, 'Department is required'),
  type: z.string().optional(),
  strategy: z.string().optional(),
  workstation: z.string().optional(),
  benefits: z.string().optional(),
  resourcesRequired: z.enum(['low', 'medium', 'high']).default('medium'),
  submitter: z.string().min(1, 'Submitter name is required'),
  evaluator: z.string().optional(),
  impactScore: z.number().min(1).max(10).default(5)
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: '',
  description: '',
  department: '',
  type: '',
  strategy: '',
  workstation: '',
  benefits: '',
  resourcesRequired: 'medium',
  submitter: '',
  evaluator: '',
  impactScore: 5
})

// Dropdown data
const departments = ref<{ value: string, label: string }[]>([])
const types = ref<{ value: string, label: string }[]>([])
const strategies = ref<{ value: string, label: string }[]>([])
const workstations = ref<{ value: string, label: string }[]>([])

// Fetch dropdown data
const fetchDropdownData = async () => {
  try {
    // Fetch all data in parallel for better performance
    const [deptData, typeData, strategyData, workstationData]
      = await Promise.all([
        $fetch('/api/departments'),
        $fetch('/api/idea-types'),
        $fetch('/api/strategies'),
        $fetch('/api/workstations')
      ])

    // Update all refs at once
    departments.value = deptData
    types.value = typeData
    strategies.value = strategyData
    workstations.value = workstationData

    // Debug: Log the fetched data
    console.log('Fetched departments data:', deptData)
  } catch (error) {
    console.error('Error fetching dropdown data:', error)
    // Set default values in case of error
    departments.value = [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Operations', label: 'Operations' },
      { value: 'HR', label: 'HR' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Product', label: 'Product' },
      { value: 'Customer Success', label: 'Customer Success' }
    ]
    types.value = [
      { value: 'Process Improvement', label: 'Process Improvement' },
      { value: 'New Feature', label: 'New Feature' },
      { value: 'Cost Reduction', label: 'Cost Reduction' },
      { value: 'Quality Enhancement', label: 'Quality Enhancement' },
      { value: 'Customer Experience', label: 'Customer Experience' },
      { value: 'Technology Upgrade', label: 'Technology Upgrade' }
    ]
    strategies.value = [
      { value: 'Short-term (0-3 months)', label: 'Short-term (0-3 months)' },
      { value: 'Medium-term (3-6 months)', label: 'Medium-term (3-6 months)' },
      { value: 'Long-term (6+ months)', label: 'Long-term (6+ months)' },
      { value: 'Strategic Initiative', label: 'Strategic Initiative' }
    ]
    workstations.value = [
      { value: 'Remote', label: 'Remote' },
      { value: 'Office', label: 'Office' },
      { value: 'Hybrid', label: 'Hybrid' },
      { value: 'Field', label: 'Field' },
      { value: 'Lab', label: 'Lab' }
    ]
  }
}

// Impact score helpers
const getImpactColor = (score: number | undefined) => {
  if (!score) return 'warning'
  if (score >= 8) return 'success'
  if (score >= 5) return 'warning'
  return 'error'
}

const getImpactLabel = (score: number | undefined) => {
  if (!score) return 'Medium Impact'
  if (score >= 8) return 'High Impact'
  if (score >= 5) return 'Medium Impact'
  return 'Low Impact'
}

// Computed properties for dynamic content
const isEditing = computed(() => !!props.idea)
const formTitle = computed(() =>
  isEditing.value ? 'Edit Idea' : 'Submit New Idea'
)
const formDescription = computed(() =>
  isEditing.value
    ? 'Update your idea details'
    : 'Share your innovative ideas with the team'
)
const submitButtonText = computed(() =>
  isEditing.value ? 'Update Idea' : 'Submit Idea'
)

// Watch for idea changes and populate form
watch(
  () => props.idea,
  (newIdea) => {
    if (newIdea) {
      // Populate form with idea data
      state.title = newIdea.title
      state.description = newIdea.description
      state.department = newIdea.department
      state.type = newIdea.type || ''
      state.strategy = newIdea.strategy || ''
      state.workstation = newIdea.workstation || ''
      state.benefits = newIdea.benefits || ''
      state.resourcesRequired = newIdea.resourcesRequired || 'medium'
      state.submitter = newIdea.submitter
      state.evaluator = newIdea.evaluator || ''
      state.impactScore = newIdea.impactScore
    } else {
      // Clear form for new idea
      state.title = ''
      state.description = ''
      state.department = ''
      state.type = ''
      state.strategy = ''
      state.workstation = ''
      state.benefits = ''
      state.resourcesRequired = 'medium'
      state.submitter = ''
      state.evaluator = ''
      state.impactScore = 5
    }
  },
  { immediate: true }
)

// Fetch data on component mount
onMounted(async () => {
  await fetchDropdownData()
})

// Add a watcher to ensure departments are properly initialized
watch(
  departments,
  (newDepartments) => {
    console.log('Departments updated:', newDepartments)
  },
  { immediate: true }
)

// Ensure departments are properly initialized with a fallback
onMounted(() => {
  // Initialize with fallback data if empty
  if (departments.value.length === 0) {
    console.log('Departments empty, using fallback')
    departments.value = [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Operations', label: 'Operations' },
      { value: 'HR', label: 'HR' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Product', label: 'Product' },
      { value: 'Customer Success', label: 'Customer Success' }
    ]
  }
})

// Add a small delay to ensure DOM is ready for dropdown rendering
onMounted(() => {
  setTimeout(() => {
    console.log('Departments after timeout:', departments.value.length)
  }, 100)
})

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  props.onSubmit({
    ...event.data,
    id: props.idea?.id,
    status: isEditing.value ? props.idea?.status || 'submitted' : 'submitted'
  })
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto w-full"
  >
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ formTitle }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        {{ formDescription }}
      </p>
    </div>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-6"
      @submit="handleSubmit"
    >
      <!-- Basic Information Card -->
      <UCard
        class="border border-gray-200 dark:border-gray-700"
        :ui="{
          header: 'border-b border-gray-200 dark:border-gray-700',
          body: 'space-y-6'
        }"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-file-text"
              class="text-primary-500 dark:text-primary-400"
            />
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField
            label="Title"
            name="title"
            required
          >
            <UInput
              v-model="state.title"
              placeholder="Enter a concise title for your idea"
            />
          </UFormField>

          <UFormField
            label="Department"
            name="department"
            required
          >
            <USelect
              v-model="state.department"
              :items="departments"
              placeholder="Select department"
            />
          </UFormField>
        </div>

        <UFormField
          label="Description"
          name="description"
          required
        >
          <UTextarea
            v-model="state.description"
            placeholder="Describe your idea in detail. What problem does it solve? How would it work? (Minimum 10 characters)"
            :rows="4"
          />
        </UFormField>
      </UCard>

      <!-- Categorization Card -->
      <UCard
        class="border border-gray-200 dark:border-gray-700"
        :ui="{
          header: 'border-b border-gray-200 dark:border-gray-700',
          body: 'space-y-6'
        }"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-tag"
              class="text-primary-500 dark:text-primary-400"
            />
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Categorization
            </h3>
          </div>
        </template>

        <div class="space-y-6">
          <UFormField
            label="Type"
            name="type"
          >
            <USelect
              v-model="state.type"
              :items="types"
              placeholder="Select type"
            />
          </UFormField>

          <UFormField
            label="Strategy"
            name="strategy"
          >
            <USelect
              v-model="state.strategy"
              :items="strategies"
              placeholder="Select strategy"
            />
          </UFormField>

          <UFormField
            label="Workstation"
            name="workstation"
          >
            <USelect
              v-model="state.workstation"
              :items="workstations"
              placeholder="Select workstation"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- Benefits and Resources Card -->
      <UCard
        class="border border-gray-200 dark:border-gray-700"
        :ui="{
          header: 'border-b border-gray-200 dark:border-gray-700',
          body: 'space-y-6'
        }"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-trending-up"
              class="text-primary-500 dark:text-primary-400"
            />
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Benefits & Resources
            </h3>
          </div>
        </template>

        <div class="space-y-6">
          <UFormField
            label="Expected Benefits"
            name="benefits"
          >
            <UTextarea
              v-model="state.benefits"
              placeholder="What are the expected benefits of implementing this idea?"
              :rows="3"
            />
          </UFormField>

          <UFormField
            label="Resources Required"
            name="resourcesRequired"
          >
            <USelect
              v-model="state.resourcesRequired"
              :items="[
                { value: 'low', label: 'Low (Minimal resources required)' },
                {
                  value: 'medium',
                  label: 'Medium (Moderate resources required)'
                },
                {
                  value: 'high',
                  label: 'High (Significant resources required)'
                }
              ]"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- People & Impact Card -->
      <UCard
        class="border border-gray-200 dark:border-gray-700"
        :ui="{
          header: 'border-b border-gray-200 dark:border-gray-700',
          body: 'space-y-6'
        }"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-users"
              class="text-primary-500 dark:text-primary-400"
            />
            <h3 class="font-semibold text-gray-900 dark:text-white">
              People & Impact
            </h3>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField
            label="Submitter Name"
            name="submitter"
            required
          >
            <UInput
              v-model="state.submitter"
              placeholder="Your name"
            />
          </UFormField>

          <UFormField
            label="Evaluator"
            name="evaluator"
          >
            <UInput
              v-model="state.evaluator"
              placeholder="Evaluator name (if known)"
            />
          </UFormField>
        </div>

        <!-- Enhanced Impact Score -->
        <UFormField
          label="Impact Score (1-10)"
          name="impactScore"
        >
          <div class="space-y-3">
            <USlider
              v-model="state.impactScore"
              :min="1"
              :max="10"
              :step="1"
              class="w-full"
            />
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <span class="text-sm text-gray-500">Low</span>
                <span class="text-sm text-gray-500">Medium</span>
                <span class="text-sm text-gray-500">High</span>
              </div>
              <UBadge
                :color="getImpactColor(state.impactScore)"
                size="sm"
              >
                {{ state.impactScore }} -
                {{ getImpactLabel(state.impactScore) }}
              </UBadge>
            </div>
          </div>
        </UFormField>
      </UCard>

      <!-- Actions -->
      <div class="flex justify-end space-x-4 pt-4">
        <UButton
          type="button"
          variant="outline"
          @click="props.onCancel"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          icon="i-lucide-send"
        >
          {{ submitButtonText }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
