import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchPosts } from '../features/posts/postsSlice'
import type { Post } from '../types/Post'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { posts, loading, error } = useAppSelector((state) => state.posts)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const filteredPosts = useMemo(() => {
    const normalized = filter.trim().toLowerCase()
    if (!normalized) {
      return posts
    }
    return posts.filter((post) => post.author.toLowerCase().includes(normalized))
  }, [filter, posts])

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-slate-500">Завантаження постів…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-red-600">Помилка: {error}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Останні публікації</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Блог</h1>
          <p className="text-base text-slate-500">Нові матеріали від авторів спільноти.</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Створити пост
        </Link>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor="author-filter" className="text-sm font-medium text-slate-600">
          Пошук за автором
        </label>
        <input
          id="author-filter"
          type="text"
          placeholder="Введіть ім’я автора…"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-base text-slate-500">Публікації ще не додані.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}

function PostCard({ post }: PostCardProps) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="group rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      aria-label={`Перейти до поста ${post.title}`}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
        <p className="text-sm text-slate-600">Автор: {post.author}</p>
        <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
      </div>
    </Link>
  )
}

function formatDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Невідома дата'
  }
  return parsed.toLocaleString('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface PostCardProps {
  post: Post
}
