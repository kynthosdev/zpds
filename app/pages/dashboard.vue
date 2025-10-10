<script lang="ts" setup>
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range, Idea } from '~/types'

// Import the new components
import InnovationStats from '~/components/dashboard/InnovationStats.vue'
import RecentIdeasTable from '~/components/dashboard/RecentIdeasTable.vue'
import DashboardCharts from '~/components/dashboard/DashboardCharts.vue'

definePageMeta({
  layout: 'dashboard'
})

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[{
  label: 'Submit New Idea',
  icon: 'i-lucide-lightbulb',
  to: '/ideas/submit'
}, {
  label: 'View All Ideas',
  icon: 'i-lucide-file-text',
  to: '/ideas'
}]] satisfies DropdownMenuItem[][]

// Fetch ideas data
const { data: ideas } = await useFetch<Idea[]>('/api/ideas')

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 30 }),
  end: new Date()
})
const period = ref<Period>('weekly')
</script>

<template>
  <UDashboardPanel id="innovation-dashboard">
    <template #header>
      <UDashboardNavbar
        title="Innovation Dashboard"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip
            text="Notifications"
            :shortcuts="['N']"
          >
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip
                color="error"
                inset
              >
                <UIcon
                  name="i-lucide-bell"
                  class="size-5 shrink-0"
                />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton
              icon="i-lucide-plus"
              size="md"
              class="rounded-full"
            />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker
            v-model="range"
            class="-ms-1"
          />

          <HomePeriodSelect
            v-model="period"
            :range="range"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <!-- Innovation Stats -->
      <InnovationStats
        v-if="ideas"
        :ideas="ideas"
      />

      <!-- Dashboard Charts -->
      <DashboardCharts
        v-if="ideas"
        :ideas="ideas"
      />

      <!-- Recent Ideas -->
      <RecentIdeasTable
        v-if="ideas"
        :ideas="ideas"
      />
    </template>
  </UDashboardPanel>
</template>
