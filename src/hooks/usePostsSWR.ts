import useSWR from 'swr'
import { fetchPostsFromFirestore } from '../services/firebase'
import type { Post } from '../types/Post'

interface UsePostsResult {
  posts: Post[]
  isLoading: boolean
  error: unknown
}

export function usePostsSWR(): UsePostsResult {
  const { data, error, isLoading } = useSWR<Post[]>('posts', fetchPostsFromFirestore)

  return {
    posts: data ?? [],
    isLoading,
    error,
  }
}

