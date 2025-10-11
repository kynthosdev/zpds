<script setup lang="ts">
// Use default layout with AppHeader and AppFooter
definePageMeta({
  layout: 'default'
})

// Preserve authentication functionality and Nuxt Content integration
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <div
    v-if="page"
    class="min-h-screen bg-background"
  >
    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4">
      <div class="container mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left Column - Content -->
          <div class="animate-fade-in">
            <h1 class="text-4xl md:text-[56px] font-bold text-foreground leading-tight mb-5">
              {{ page.hero.headline }}
            </h1>

            <p class="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-[560px]">
              {{ page.hero.subheadline }}
            </p>

            <!-- CTAs -->
            <div class="flex flex-col sm:flex-row gap-4 mb-6">
              <UButton
                :to="page.hero.primary_cta.to"
                class="h-14 px-12 text-lg font-semibold bg-primary hover:bg-orange-hover text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                {{ page.hero.primary_cta.text }}
              </UButton>
              <UButton
                :to="page.hero.secondary_cta.to"
                variant="outline"
                class="h-14 px-10 text-lg font-semibold border-2 border-border text-charcoal rounded-lg hover:bg-muted transition-all"
              >
                {{ page.hero.secondary_cta.text }}
              </UButton>
            </div>

            <!-- Trust Indicators -->
            <div class="flex flex-col sm:flex-row gap-4 text-sm font-medium text-medium-grey">
              <div
                v-for="signal in page.hero.trust_signals"
                :key="signal.text"
                class="flex items-center gap-2"
              >
                <UIcon
                  :name="signal.icon"
                  class="w-4 h-4 text-green-check"
                />
                <span>{{ signal.text }}</span>
              </div>
            </div>
          </div>

          <!-- Right Column - Dashboard Image -->
          <div class="animate-fade-in animation-delay-200">
            <div class="relative">
              <img
                src="https://via.placeholder.com/720x540/2563EB/FFFFFF?text=Dashboard+Preview"
                alt="IdeaNexus innovation management dashboard showing idea pipeline from submission through evaluation to implementation with kanban board view"
                class="rounded-lg shadow-2xl w-full"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              <div class="absolute bottom-4 left-4 text-white">
                <p class="text-sm font-medium">
                  Dashboard Preview
                </p>

                <p class="text-xs opacity-90">
                  Coming Soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof Strip -->
    <section class="py-12 bg-muted">
      <div class="container mx-auto px-4">
        <UCard class="text-center">
          <p class="text-base font-medium text-muted-foreground mb-8">
            {{ page.social_proof.headline }}
          </p>

          <!-- Logo Grid -->
          <div class="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
            <div
              v-for="company in page.social_proof.companies"
              :key="company"
              class="text-center text-sm font-semibold text-muted-foreground hover:opacity-100 transition-opacity"
            >
              {{ company }}
            </div>
          </div>

          <!-- Industry Tags -->
          <div class="mt-6 text-sm text-muted-foreground">
            {{ page.social_proof.industries }}
          </div>
        </UCard>
      </div>
    </section>

    <!-- Problem/Agitation Section -->
    <section class="py-20 bg-muted">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-[42px] font-bold text-foreground mb-4">
            {{ page.problem.headline }}
          </h2>

          <p class="text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto">
            {{ page.problem.subheadline }}
          </p>
        </div>

        <!-- Problem Recognition Box -->
        <UCard class="max-w-[640px] mx-auto mb-16">
          <h3 class="text-2xl font-semibold mb-6">
            Sound Familiar?
          </h3>

          <div class="space-y-4">
            <div
              v-for="point in page.problem.pain_points"
              :key="point.text"
              class="flex items-start gap-3"
            >
              <span class="text-2xl flex-shrink-0">
                {{ point.icon }}
              </span>

              <p class="text-lg text-foreground leading-relaxed">
                {{ point.text }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Cost Quantification -->
        <div class="text-center mb-10">
          <h3 class="text-2xl md:text-[28px] font-semibold text-foreground">
            Here's What This Actually Costs You:
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <UCard
            v-for="stat in page.problem.stats"
            :key="stat.value"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">
                  {{ stat.label }}
                </p>
                <p class="text-2xl font-bold">
                  {{ stat.value }}
                </p>
                <p class="text-xs text-muted-foreground italic mt-1">
                  {{ stat.source }}
                </p>
              </div>
              <UIcon
                name="i-lucide-trending-up"
                class="text-2xl text-primary"
              />
            </div>
          </UCard>
        </div>

        <!-- Agitation Copy -->
        <div class="max-w-[700px] mx-auto">
          <p class="text-lg text-foreground leading-relaxed mb-6">
            And it gets worse: As your team grows, the chaos multiplies.
          </p>
          <p class="text-lg text-foreground mb-4">
            Every day without a systematic innovation process means:
          </p>
          <div class="space-y-3 mb-12">
            <div class="flex items-start gap-3">
              <span class="text-primary font-bold">→</span>
              <p class="text-lg text-foreground leading-relaxed">
                Your competitors are implementing the ideas your team is forgetting
              </p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-primary font-bold">→</span>
              <p class="text-lg text-foreground leading-relaxed">
                Employees become cynical about "suggestion boxes" that go nowhere
              </p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-primary font-bold">→</span>
              <p class="text-lg text-foreground leading-relaxed">
                Innovation workshops produce binders that gather dust
              </p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-primary font-bold">→</span>
              <p class="text-lg text-foreground leading-relaxed">
                You lack visibility into what could be your next breakthrough
              </p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-primary font-bold">→</span>
              <p class="text-lg text-foreground leading-relaxed">
                The best ideas get lost to whoever shouts loudest, not what creates value
              </p>
            </div>
          </div>

          <!-- Transition to Solution -->
          <div class="text-center">
            <div class="w-20 h-px bg-border mx-auto mb-6" />
            <h3 class="text-3xl font-bold text-secondary mb-4">
              {{ page.problem.transition }}
            </h3>
            <p class="text-lg md:text-xl text-muted-foreground">
              What if every idea was captured, evaluated fairly, and tracked from suggestion to
              implementation—without enterprise software complexity?
            </p>
            <p class="text-lg md:text-xl text-muted-foreground font-semibold mt-4">
              That's exactly what IdeaNexus does.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution/How It Works Section -->
    <section
      id="product"
      class="py-24 bg-background"
    >
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-[42px] font-bold text-foreground mb-4">
            {{ page.solution.headline }}
          </h2>
          <p class="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
            {{ page.solution.subheadline }}
          </p>
        </div>

        <!-- 3-Step Process -->
        <div class="mb-16">
          <h3 class="text-2xl font-semibold text-foreground text-center mb-12">
            How IdeaNexus Works: 3 Simple Steps
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <UCard
              v-for="process in page.solution.process"
              :key="process.step"
              class="text-center hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div class="text-sm font-bold text-primary mb-2">
                STEP {{ process.step }}
              </div>
              <div class="text-6xl mb-4">
                {{ process.icon }}
              </div>
              <h4 class="text-2xl font-bold mb-3">
                {{ process.title }}
              </h4>
              <p class="text-base text-muted-foreground leading-relaxed">
                {{ process.description }}
              </p>
            </UCard>
          </div>
        </div>

        <!-- Benefits Grid -->
        <div
          id="features"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          <UCard
            v-for="benefit in page.solution.benefits"
            :key="benefit.title"
            class="hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div class="text-4xl mb-4">
              {{ benefit.icon }}
            </div>
            <h4 class="text-xl md:text-[22px] font-bold mb-3">
              {{ benefit.title }}
            </h4>
            <p class="text-base text-muted-foreground mb-4 leading-relaxed">
              {{ benefit.description }}
            </p>
            <ul class="space-y-2">
              <li
                v-for="feature in benefit.features"
                :key="feature"
                class="flex items-start gap-2 text-sm"
              >
                <UIcon
                  name="i-lucide-check"
                  class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-muted">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-[42px] font-bold text-foreground mb-4">
            {{ page.testimonials.headline }}
          </h2>
          <p class="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
            {{ page.testimonials.description }}
          </p>
        </div>

        <!-- Featured Testimonial -->
        <div
          v-if="page.testimonials.items && page.testimonials.items.length > 0"
          class="max-w-4xl mx-auto mb-16"
        >
          <UCard class="text-center">
            <div class="flex items-center gap-1 mb-6 justify-center">
              <UIcon
                v-for="i in 5"
                :key="i"
                name="i-lucide-star"
                class="w-6 h-6 text-orange-500"
              />
            </div>
            <blockquote class="text-xl md:text-2xl text-foreground leading-relaxed mb-8 italic">
              "{{ page.testimonials.items[0]?.quote }}"
            </blockquote>
            <div class="flex items-center justify-center gap-4">
              <img
                :src="page.testimonials.items[0]?.user.avatar.src"
                :alt="page.testimonials.items[0]?.user.name"
                class="w-16 h-16 rounded-full"
              >
              <div class="text-left">
                <div class="font-bold text-foreground">
                  {{ page.testimonials.items[0]?.user.name }}
                </div>
                <div class="text-muted-foreground">
                  {{ page.testimonials.items[0]?.user.description }}
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Supporting Testimonials -->
        <div
          v-if="page.testimonials.items && page.testimonials.items.length > 1"
          class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <UCard
            v-for="testimonial in page.testimonials.items.slice(1)"
            :key="testimonial.quote"
          >
            <div class="flex items-center gap-1 mb-4">
              <UIcon
                v-for="i in 5"
                :key="i"
                name="i-lucide-star"
                class="w-4 h-4 text-orange-500"
              />
            </div>
            <blockquote class="text-lg text-foreground leading-relaxed mb-6 italic">
              "{{ testimonial.quote }}"
            </blockquote>
            <div class="flex items-center gap-3">
              <img
                :src="testimonial.user.avatar.src"
                :alt="testimonial.user.name"
                class="w-12 h-12 rounded-full"
              >
              <div>
                <div class="font-semibold text-foreground">
                  {{ testimonial.user.name }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ testimonial.user.description }}
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-20 bg-gradient-to-b from-primary to-orange-hover text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-[42px] font-bold mb-6">
          {{ page.final_cta.headline }}
        </h2>
        <p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95">
          {{ page.final_cta.subheadline }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="page.final_cta.primary_cta.to"
            class="h-14 px-12 text-lg font-semibold bg-white text-primary hover:bg-gray-100 rounded-lg shadow-lg"
          >
            {{ page.final_cta.primary_cta.text }}
          </UButton>
          <UButton
            :to="page.final_cta.secondary_cta.to"
            variant="outline"
            class="h-14 px-10 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-lg"
          >
            {{ page.final_cta.secondary_cta.text }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
