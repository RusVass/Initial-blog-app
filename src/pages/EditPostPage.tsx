import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-slate-500">Завантаження даних поста…</p>
      </section>
    )
  }

  if (fetchError) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-red-600">{fetchError}</p>
        <Link className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:underline" to="/">
          ← Назад до списку
        </Link>
      </section>
    )
  }

  return (
    <section className="container mx-auto max-w-2xl p-6">
      <Link className="mb-6 inline-flex text-sm font-semibold text-indigo-600 hover:underline" to={`/post/${id}`}>
        ← Назад до поста
      </Link>
      <h1 className="text-3xl font-semibold">Редагувати пост</h1>
      <p className="text-muted-foreground">Оновіть поля та збережіть зміни.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">
            Заголовок
          </label>
          <input
            id="title"
            aria-invalid={Boolean(errors.title)}
            {...register('title')}
            placeholder="Оновлений заголовок"
            className="input text-slate-900 placeholder:text-slate-500"
            disabled={isSubmitting}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="grid gap-2">
          <label htmlFor="author" className="text-sm font-medium">
            Автор
          </label>
          <input
            id="author"
            aria-invalid={Boolean(errors.author)}
            {...register('author')}
            placeholder="Ім'я автора"
            className="input text-slate-900 placeholder:text-slate-500"
            disabled={isSubmitting}
          />
          {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
        </div>

        <div className="grid gap-2">
          <label htmlFor="content" className="text-sm font-medium">
            Контент
          </label>
          <textarea
            id="content"
            aria-invalid={Boolean(errors.content)}
            {...register('content')}
            placeholder="Оновлений текст поста…"
            className="input min-h-[12rem] text-slate-900 placeholder:text-slate-500"
            disabled={isSubmitting}
          />
          {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
        </div>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}

        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Збереження…' : 'Зберегти зміни'}
          </button>
          <Link
            to={id ? `/post/${id}` : '/'}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </section>
  )
}
