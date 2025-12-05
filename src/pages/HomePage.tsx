import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { usePostsSWR } from '../hooks/usePostsSWR'
import type { Post } from '../types/Post'

export default function HomePage() {
  const { posts, isLoading, error } = usePostsSWR()
  const [filter, setFilter] = useState('')

  const filteredPosts = useMemo(() => {
    const normalized = filter.trim().toLowerCase()
    if (!normalized) {
      return posts
    }
    return posts.filter((post) => post.author?.toLowerCase().includes(normalized) ?? false)
  }, [filter, posts])

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-base text-slate-500">Завантаження постів…</p>
      </section>
    )
  }

  if (error) {
    const message = error instanceof Error ? error.message : 'Не вдалося завантажити публікації'
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-base text-red-600">Помилка: {message}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Останні публікації</p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Блог спільноти</h1>
            <p className="text-base text-slate-500">Діліться досвідом і знаходьте натхнення.</p>
          </div>
          <Button as={Link} to="/create" size="lg">
            Створити пост
          </Button>
        </header>

        <div className="space-y-2">
          <label htmlFor="author-filter" className="text-sm font-medium text-slate-600">
            Пошук за автором
          </label>
          <Input
            id="author-filter"
            type="text"
            placeholder="Введіть ім’я автора…"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>

        {filteredPosts.length === 0 ? (
          <Card variant="muted" className="text-base text-slate-500">
            Публікації ще не додані.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function PostCard({ post }: PostCardProps) {
  return (
    <Card
      as={Link}
      to={`/post/${post.id}`}
      variant="interactive"
      padding="md"
      className="group h-full"
      aria-label={`Перейти до поста ${post.title}`}
    >
      <div className="flex h-full flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600">{post.title}</h2>
        <p className="text-sm text-slate-600">Автор: {post.author}</p>
        <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
      </div>
    </Card>
  )
}

function formatDate(value: unknown) {
  if (!value) {
    return 'Невідома дата'
  }

  const parsed =
    typeof value === 'string'
      ? new Date(value)
      : value instanceof Date
        ? value
        : new Date(String(value))

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
