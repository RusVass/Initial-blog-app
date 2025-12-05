import { type FormEvent, useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
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
    <section className="space-y-6">
      <Card className="space-y-6">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">Коментарі</h2>
          <p className="text-sm text-slate-500">Залиште свій відгук про цю публікацію.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="comment-author" className="text-sm font-medium text-slate-700">
              Імʼя
            </label>
            <Input
              id="comment-author"
              name="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Ваше імʼя"
              autoComplete="name"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="comment-text" className="text-sm font-medium text-slate-700">
              Коментар
            </label>
            <Input
              as="textarea"
              id="comment-text"
              name="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Поділіться думками…"
              disabled={submitting}
            />
          </div>

          <Button type="submit" disabled={submitting || !author.trim() || !text.trim()}>
            {submitting ? 'Надсилання…' : 'Додати коментар'}
          </Button>
        </form>

        {error && <p className="text-sm text-rose-600">{error}</p>}
      </Card>

      <div>
        {loading ? (
          <Card variant="muted" className="text-sm text-slate-500">
            Завантаження коментарів…
          </Card>
        ) : comments.length === 0 ? (
          <Card variant="muted" className="text-sm text-slate-500">
            Поки що немає жодного коментаря.
          </Card>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <Card
                as="li"
                key={comment.id}
                variant="muted"
                padding="sm"
                className="space-y-2 text-sm text-slate-800"
              >
                <p>{comment.text}</p>
                <p className="text-xs text-slate-500">
                  — <span className="font-medium text-slate-700">{comment.author}</span>,{' '}
                  {formatCommentDate(comment.createdAt)}
                </p>
              </Card>
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

