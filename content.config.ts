import { defineCollection, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  trailing: z.boolean().optional(),
  target: z.string().optional(),
  color: z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional()
})

export const collections = {
  index: defineCollection({
    source: '0.index.yml',
    type: 'page',
    schema: z.object({
      // Hero Section
      hero: z.object({
        headline: z.string().nonempty(),
        subheadline: z.string().nonempty(),
        primary_cta: z.object({
          text: z.string().nonempty(),
          to: z.string().nonempty()
        }),
        secondary_cta: z.object({
          text: z.string().nonempty(),
          to: z.string().nonempty()
        }),
        trust_signals: z.array(z.object({
          text: z.string().nonempty(),
          icon: z.string().nonempty()
        }))
      }),

      // Social Proof Section
      social_proof: z.object({
        headline: z.string().nonempty(),
        companies: z.array(z.string().nonempty()),
        industries: z.string().nonempty()
      }),

      // Problem/Agitation Section
      problem: z.object({
        headline: z.string().nonempty(),
        subheadline: z.string().nonempty(),
        pain_points: z.array(z.object({
          icon: z.string().nonempty(),
          text: z.string().nonempty()
        })),
        stats: z.array(z.object({
          value: z.string().nonempty(),
          label: z.string().nonempty(),
          source: z.string().nonempty()
        })),
        transition: z.string().nonempty()
      }),

      // Solution Section
      solution: z.object({
        headline: z.string().nonempty(),
        subheadline: z.string().nonempty(),
        process: z.array(z.object({
          step: z.string().nonempty(),
          icon: z.string().nonempty(),
          title: z.string().nonempty(),
          description: z.string().nonempty()
        })),
        benefits: z.array(z.object({
          icon: z.string().nonempty(),
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          features: z.array(z.string().nonempty())
        }))
      }),

      // Final CTA Section
      final_cta: z.object({
        headline: z.string().nonempty(),
        subheadline: z.string().nonempty(),
        primary_cta: z.object({
          text: z.string().nonempty(),
          to: z.string().nonempty()
        }),
        secondary_cta: z.object({
          text: z.string().nonempty(),
          to: z.string().nonempty()
        })
      }),

      // Testimonials Section
      testimonials: z.object({
        headline: z.string().nonempty(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        items: z.array(z.object({
          quote: z.string().nonempty(),
          user: z.object({
            name: z.string().nonempty(),
            description: z.string().nonempty(),
            avatar: z.object({
              src: z.string().nonempty()
            })
          })
        }))
      })
    })
  }),
  docs: defineCollection({
    source: '1.docs/**/*',
    type: 'page'
  }),
  pricing: defineCollection({
    source: '2.pricing.yml',
    type: 'page',
    schema: z.object({
      plans: z.array(
        z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          price: z.object({
            month: z.string().nonempty(),
            year: z.string().nonempty()
          }),
          billing_period: z.string().nonempty(),
          billing_cycle: z.string().nonempty(),
          button: createLinkSchema(),
          features: z.array(z.string().nonempty()),
          highlight: z.boolean().optional()
        })
      ),
      logos: z.object({
        title: z.string().nonempty(),
        icons: z.array(z.string())
      }),
      faq: createBaseSchema().extend({
        items: z.array(
          z.object({
            label: z.string().nonempty(),
            content: z.string().nonempty(),
            defaultOpen: z.boolean().optional()
          })
        )
      })
    })
  }),
  blog: defineCollection({
    source: '3.blog.yml',
    type: 'page'
  }),
  posts: defineCollection({
    source: '3.blog/**/*',
    type: 'page',
    schema: z.object({
      image: z.object({ src: z.string().nonempty().editor({ input: 'media' }) }),
      authors: z.array(
        z.object({
          name: z.string().nonempty(),
          to: z.string().nonempty(),
          avatar: z.object({ src: z.string().nonempty().editor({ input: 'media' }) })
        })
      ),
      date: z.date(),
      badge: z.object({ label: z.string().nonempty() })
    })
  }),
  changelog: defineCollection({
    source: '4.changelog.yml',
    type: 'page'
  }),
  versions: defineCollection({
    source: '4.changelog/**/*',
    type: 'page',
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string(),
      date: z.date(),
      image: z.string()
    })
  })
}
