import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CommentsSection } from '../components/CommentsSection'
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
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-slate-500">Завантаження поста…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-red-600">{error}</p>
        <Link className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:underline" to="/">
          ← Назад до списку
        </Link>
      </section>
    )
  }

  if (!post) {
    return null
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link className="inline-flex text-sm font-semibold text-indigo-600 hover:underline" to="/">
          ← Назад до списку
        </Link>
        <Link
          to={`/edit/${post.id}`}
          className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 hover:underline"
        >
          Редагувати пост
        </Link>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Публікація</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{post.title}</h1>
          <div className="text-sm text-slate-500">
            <p className="font-medium text-slate-700">Автор: {post.author}</p>
            <p>{formatDate(post.createdAt)}</p>
          </div>
        </header>

        <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-slate-800">{post.content}</div>
      </article>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="mt-4 text-red-600 transition hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? 'Deleting…' : 'Delete Post'}
      </button>

      <CommentsSection postId={post.id} />
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
