import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    }),
})

const authors = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      pronouns: z.string().optional(),
      avatar: z.string().url(),
      bio: z.string().optional(),
      mail: z.string().email().optional(),
      website: z.string().url().optional(),
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      discord: z.string().url().optional(),

    }),
})

const books = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image().optional(),
      date: z.coerce.date(),
      author: z.object({
        avatar: z.string(),
        name: z.string(),
      }),
      tags: z.array(z.string()).optional(),
      description: z.string(),
      pages: z.number(),
      lang: z.string(),
      status: z.string(),
      draft: z.boolean()
    }),
})
const news = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      image: image().optional(),
      date: z.coerce.date(),
      author: z.object({
        avatar: z.string(),
        name: z.string(),
      }),
      tags: z.array(z.string()).optional(),
      title: z.string(),
      description: z.string(),
      pages: z.number(),
      lang: z.string(),
      status: z.string(),
      draft: z.boolean()
    }),
})

const me = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      image: image().optional(),
      date: z.coerce.date(),
      owner: z.object({
        avatar: z.string(),
        name: z.string(),
      }),
      tags: z.array(z.string()).optional(),
      title: z.string(),
      description: z.string(),
    }),
})
const about = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      image: image().optional(),
      date: z.coerce.date(),
      title: z.string(),
      description: z.string(),
    }),
})

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: image().refine((img) => img.width === 1200 && img.height === 630, {
        message:
          'The image must be exactly 1200px × 630px for Open Graph requirements.',
      }),
      link: z.string().url(),
    }),
})

export const collections = { blog, authors, projects, books, news, me, about }
