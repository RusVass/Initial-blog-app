import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CommentsSection } from '../components/CommentsSection'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { deletePostFromFirestore, getPostById } from '../services/firebase'
import type { Post } from '../types/Post'

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function loadPost() {
      if (!id) {
        setError('ID поста відсутній')
        setLoading(false)
        return
      }

      try {
        const data = await getPostById(id)
        if (active) {
          setPost(data)
          setError(data ? null : 'Пост не знайдено')
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Не вдалося завантажити пост')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadPost()

    return () => {
      active = false
    }
  }, [id])

  async function handleDelete() {
    if (!post) {
      return
    }

    const confirmed = confirm('Are you sure you want to delete this post?')
    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)
      await deletePostFromFirestore(post.id)
      navigate('/')
    } catch (err) {
      setDeleting(false)
      setError(err instanceof Error ? err.message : 'Не вдалося видалити пост')
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-base text-slate-500">Завантаження поста…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card variant="muted" className="space-y-3 text-base text-slate-600">
          <p className="font-semibold text-rose-600">{error}</p>
          <Button as={Link} to="/" variant="outline" size="sm">
            ← Назад до списку
          </Button>
        </Card>
      </section>
    )
  }

  if (!post) {
    return null
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button as={Link} to="/" variant="outline" size="sm">
            ← Назад до списку
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to={`/edit/${post.id}`} variant="secondary" size="sm">
              Редагувати пост
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Видалення…' : 'Видалити пост'}
            </Button>
          </div>
        </div>

        <Card as="article" padding="lg" className="space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Публікація</p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{post.title}</h1>
            <div className="text-sm text-slate-500">
              <p className="font-medium text-slate-700">Автор: {post.author}</p>
              <p>{formatDate(post.createdAt)}</p>
            </div>
          </header>

          <div className="whitespace-pre-line text-base leading-relaxed text-slate-800">{post.content}</div>
        </Card>

        <CommentsSection postId={post.id} />
      </div>
    </section>
  )
}

function formatDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Невідома дата'
  }
  return parsed.toLocaleString('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
