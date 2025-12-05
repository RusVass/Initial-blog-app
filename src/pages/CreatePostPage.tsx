import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { addPostToFirestore } from '../services/firebase'
import { postSchema, type PostFormData } from '../utils/postSchema'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      author: '',
      content: '',
    },
  })

  const onSubmit = async (data: PostFormData) => {
    await addPostToFirestore(data)
    navigate('/')
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Нова публікація</p>
          <h1 className="text-3xl font-bold text-slate-900">Створити пост</h1>
          <p className="text-base text-slate-500">Заповніть поля нижче, щоб опублікувати історію.</p>
        </header>

        <Card as="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium text-slate-700">
              Заголовок
            </label>
            <Input
              id="title"
              aria-invalid={Boolean(errors.title)}
              placeholder="Наприклад: Мій перший пост"
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
              placeholder="Ваше ім’я"
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
              placeholder="Розкажіть щось цікаве…"
              {...register('content')}
            />
            {errors.content && <p className="text-sm text-rose-600">{errors.content.message}</p>}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Збереження…' : 'Створити пост'}
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Скасувати
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
