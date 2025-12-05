import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { getPostById, updatePostInFirestore } from '../services/firebase'
import { postSchema, type PostFormData } from '../utils/postSchema'

export default function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      author: '',
      content: '',
    },
  })

  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadPost() {
      if (!id) {
        setFetchError('ID поста відсутній')
        setLoading(false)
        return
      }

      try {
        const post = await getPostById(id)
        if (!active) return
        if (!post) {
          setFetchError('Пост не знайдено')
          return
        }
        reset({
          title: post.title,
          author: post.author,
          content: post.content,
        })
        setFetchError(null)
      } catch (error) {
        if (active) {
          setFetchError(error instanceof Error ? error.message : 'Не вдалося завантажити пост')
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
  }, [id, reset])

  const onSubmit = async (data: PostFormData) => {
    if (!id) {
      setSubmitError('ID поста відсутній')
      return
    }

    try {
      setSubmitError(null)
      await updatePostInFirestore(id, data)
      navigate(`/post/${id}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не вдалося оновити пост')
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-base text-slate-500">Завантаження даних поста…</p>
      </section>
    )
  }

  if (fetchError) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card variant="muted" className="space-y-3 text-base text-slate-600">
          <p className="font-semibold text-rose-600">{fetchError}</p>
          <Button as={Link} to="/" variant="outline" size="sm">
            ← Назад до списку
          </Button>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Button as={Link} to={id ? `/post/${id}` : '/'} variant="outline" size="sm">
          ← Назад до поста
        </Button>
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Редагування</p>
          <h1 className="text-3xl font-bold text-slate-900">Редагувати пост</h1>
          <p className="text-base text-slate-500">Оновіть дані та збережіть зміни.</p>
        </header>

        <Card as="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium text-slate-700">
              Заголовок
            </label>
            <Input
              id="title"
              aria-invalid={Boolean(errors.title)}
              placeholder="Оновлений заголовок"
              disabled={isSubmitting}
              {...register('title')}
            />
            {errors.title && <p className="text-sm text-rose-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="author" className="text-sm font-medium text-slate-700">
              Автор
            </label>
            <Input
              id="author"
              aria-invalid={Boolean(errors.author)}
              placeholder="Ім’я автора"
              disabled={isSubmitting}
              {...register('author')}
            />
            {errors.author && <p className="text-sm text-rose-600">{errors.author.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="content" className="text-sm font-medium text-slate-700">
              Контент
            </label>
            <Input
              as="textarea"
              id="content"
              aria-invalid={Boolean(errors.content)}
              placeholder="Оновлений текст поста…"
              disabled={isSubmitting}
              {...register('content')}
            />
            {errors.content && <p className="text-sm text-rose-600">{errors.content.message}</p>}
          </div>

          {submitError && <p className="text-sm text-rose-600">{submitError}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Збереження…' : 'Зберегти зміни'}
            </Button>
            <Button
              as={Link}
              to={id ? `/post/${id}` : '/'}
              variant="outline"
              size="lg"
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
