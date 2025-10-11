<script setup lang="ts">
const columns = [{
  label: 'Product',
  children: [{
    label: 'Features',
    to: '/#features'
  }, {
    label: 'Pricing',
    to: '/pricing'
  }, {
    label: 'Use Cases',
    to: '/#product'
  }, {
    label: 'Integrations',
    to: '/pricing'
  }]
}, {
  label: 'Resources',
  children: [{
    label: 'Blog',
    to: '/blog'
  }, {
    label: 'Case Studies',
    to: '/blog'
  }, {
    label: 'Help Center',
    to: '/docs'
  }, {
    label: 'Templates',
    to: '/blog'
  }]
}, {
  label: 'Company',
  children: [{
    label: 'About Us',
    to: '/about'
  }, {
    label: 'Contact',
    to: '/contact'
  }, {
    label: 'Privacy Policy',
    to: '/privacy'
  }, {
    label: 'Terms of Service',
    to: '/terms'
  }]
}]

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })
}
</script>

<template>
  <USeparator class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Enter your email"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="Subscribe"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} IdeaNexus. All rights reserved. POPIA Compliant. South African servers.
      </p>
    </template>

    <template #right>
      <UButton
        to="https://linkedin.com/company/ideanexus"
        target="_blank"
        icon="i-simple-icons-linkedin"
        aria-label="IdeaNexus on LinkedIn"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://twitter.com/ideanexus_sa"
        target="_blank"
        icon="i-simple-icons-x"
        aria-label="IdeaNexus on X"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
