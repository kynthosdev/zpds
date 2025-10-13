<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { evaluationService } from '@/services/evaluation'

const props = defineProps<{
  ideaId: string
  evaluation?: {
    id: string
    impactScore: number
    feasibilityScore: number
    resourceScore: number
    strategicScore: number
    comments?: string
    recommendation: 'approve' | 'reject' | 'request_info'
    createdAt: string
    evaluatorName?: string
  }
}>()

const emit = defineEmits(['submitted', 'cancelled'])

const loading = ref(false)
const error = ref<string | null>(null)
const form = ref({
  impactScore: 3,
  feasibilityScore: 3,
  resourceScore: 3,
  strategicScore: 3,
  comments: '',
  recommendation: 'request_info' as 'approve' | 'reject' | 'request_info'
})

const validationSchema = z.object({
  impactScore: z.number().min(1).max(5),
  feasibilityScore: z.number().min(1).max(5),
  resourceScore: z.number().min(1).max(5),
  strategicScore: z.number().min(1).max(5),
  comments: z.string().optional(),
  recommendation: z.enum(['approve', 'reject', 'request_info'])
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = null

    const evaluationData = {
      ...form.value,
      ideaId: props.ideaId
    }

    // Validate data
    validationSchema.parse(evaluationData)

    // Submit to API using service
    const response = await evaluationService.createEvaluation(evaluationData)

    emit('submitted', response)
    form.value = {
      impactScore: 3,
      feasibilityScore: 3,
      resourceScore: 3,
      strategicScore: 3,
      comments: '',
      recommendation: 'request_info'
    }
  } catch (err) {
    console.error('Evaluation submission error:', err)
    error.value = 'Failed to submit evaluation. Please try again.'
    // Handle error appropriately
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancelled')
}
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        Evaluate Idea
      </h3>
    </template>

    <UForm
      :state="form"
      class="space-y-4"
      @submit="handleSubmit"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup
          label="Impact Score"
          name="impactScore"
        >
          <URating
            v-model="form.impactScore"
            :max="5"
          />
        </UFormGroup>

        <UFormGroup
          label="Feasibility Score"
          name="feasibilityScore"
        >
          <URating
            v-model="form.feasibilityScore"
            :max="5"
          />
        </UFormGroup>

        <UFormGroup
          label="Resource Score"
          name="resourceScore"
        >
          <URating
            v-model="form.resourceScore"
            :max="5"
          />
        </UFormGroup>

        <UFormGroup
          label="Strategic Score"
          name="strategicScore"
        >
          <URating
            v-model="form.strategicScore"
            :max="5"
          />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Comments"
        name="comments"
      >
        <UTextarea
          v-model="form.comments"
          placeholder="Provide additional comments about this evaluation..."
        />
      </UFormGroup>

      <UFormGroup
        label="Recommendation"
        name="recommendation"
      >
        <USelect
          v-model="form.recommendation"
          :options="[
            { label: 'Approve', value: 'approve' },
            { label: 'Reject', value: 'reject' },
            { label: 'Request More Info', value: 'request_info' }
          ]"
        />
      </UFormGroup>

      <div class="flex justify-end gap-3">
        <UButton
          type="button"
          variant="outline"
          @click="handleCancel"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          :loading="loading"
        >
          Submit Evaluation
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
