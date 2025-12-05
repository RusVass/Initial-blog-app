import { describe, expect, it } from 'vitest'
import { postSchema } from '../postSchema'

const validData = {
  title: 'Valid blog post title',
  author: 'JD',
  content: 'This is valid body text with sufficient length.',
}

describe('postSchema', () => {
  it('rejects empty title', () => {
    const result = postSchema.safeParse({ ...validData, title: '' })

    expect(result.success).toBe(false)
    if (result.success) return

    const titleIssue = result.error.issues.find((issue) =>
      issue.path.includes('title'),
    )
    expect(titleIssue).toBeDefined()
  })

  it('rejects empty content', () => {
    const result = postSchema.safeParse({ ...validData, content: '' })

    expect(result.success).toBe(false)
    if (result.success) return

    const contentIssue = result.error.issues.find((issue) =>
      issue.path.includes('content'),
    )
    expect(contentIssue).toBeDefined()
  })

  it('accepts valid data', () => {
    const result = postSchema.safeParse(validData)

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.data).toEqual(validData)
  })
})

