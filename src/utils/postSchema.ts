import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(2),
  content: z.string().min(10),
})

export type PostFormData = z.infer<typeof postSchema>

