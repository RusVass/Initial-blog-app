import { describe, expect, it } from 'vitest'
import postsReducer, { fetchPosts } from '../postsSlice'
import type { Post } from '../../../types/Post'

describe('postsSlice', () => {
  it('вмикає стан завантаження під час fetchPosts.pending', () => {
    const state = postsReducer(undefined, { type: fetchPosts.pending.type })

    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
    expect(state.posts).toHaveLength(0)
  })

  it('зберігає пости після успішного fetchPosts.fulfilled', () => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Hello', author: 'Alice', content: 'World', createdAt: new Date().toISOString() },
    ]
    const action = fetchPosts.fulfilled(mockPosts, 'request-1', undefined)
    const state = postsReducer(
      { posts: [], loading: true, error: null },
      action,
    )

    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.posts).toEqual(mockPosts)
  })

  it('фіксує помилку після fetchPosts.rejected', () => {
    const errorMessage = 'Network error'
    const action = fetchPosts.rejected(new Error(errorMessage), 'request-2', undefined)
    const state = postsReducer(undefined, action)

    expect(state.loading).toBe(false)
    expect(state.posts).toHaveLength(0)
    expect(state.error).toBe(errorMessage)
  })
})


