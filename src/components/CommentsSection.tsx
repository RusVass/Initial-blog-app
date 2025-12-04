import { type FormEvent, useEffect, useState } from 'react'
import { addCommentToPost, fetchCommentsForPost } from '../services/firebase'
import type { Comment } from '../types/Comment'

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadComments() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCommentsForPost(postId)
        if (active) {
          setComments(data)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Не вдалося завантажити коментарі')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadComments()

    return () => {
      active = false
    }
  }, [postId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!author.trim() || !text.trim()) {
      return
    }

    const payload: Omit<Comment, 'id'> = {
      postId,
      author: author.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }

    try {
      setSubmitting(true)
      setError(null)
      await addCommentToPost(payload)
      const updatedComments = await fetchCommentsForPost(postId)
      setComments(updatedComments)
      setAuthor('')
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося додати коментар')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white/70 p-6">
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Коментарі</h2>
        <p className="text-sm text-slate-500">Залиште свій відгук про цю публікацію.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-100 bg-white/80 p-4 shadow-sm">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Імʼя
          <input
            type="text"
            name="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Ваше імʼя"
            autoComplete="name"
            disabled={submitting}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Коментар
          <textarea
            name="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Поділіться думками…"
            disabled={submitting}
          />
        </label>

        <button
          type="submit"
          disabled={submitting || !author.trim() || !text.trim()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Надсилання…' : 'Додати коментар'}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Завантаження коментарів…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500">Поки що немає жодного коментаря.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-xl border border-slate-100 bg-white/80 p-4 shadow-sm">
                <p className="text-sm text-slate-800">{comment.text}</p>
                <p className="mt-2 text-xs text-slate-500">
                  — <span className="font-medium text-slate-700">{comment.author}</span>, {formatCommentDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function formatCommentDate(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'щойно'
  }
  return parsed.toLocaleString('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

