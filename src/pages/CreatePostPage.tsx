import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
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

  return (
    <section className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-semibold">Створити новий пост</h1>
      <p className="text-muted-foreground">Заповніть поля, щоб опублікувати історію.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">
            Заголовок
          </label>
          <input
            id="title"
            aria-invalid={Boolean(errors.title)}
            {...register('title')}
            placeholder="Наприклад: Мій перший пост"
            className="input text-slate-900 placeholder:text-slate-500"
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
            placeholder="Ваше ім'я"
            className="input text-slate-900 placeholder:text-slate-500"
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
            placeholder="Розкажіть щось цікаве..."
            className="input min-h-[12rem] text-slate-900 placeholder:text-slate-500"
          />
          {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Збереження…' : 'Створити пост'}
        </button>
      </form>
    </section>
  )
}
