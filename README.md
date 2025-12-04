# 📝 Initial-blog-app – Test Task for KIT GLOBAL

Односторінковий блог, реалізований на React + Firebase з можливістю створення, редагування, перегляду, видалення постів та додавання коментарів.

---

## 🔧 Технології

- **React** + **TypeScript** + **Vite**
- **Redux Toolkit** + **SWR**
- **Firebase (Firestore)**
- **Zod** (валідація форм)
- **React Router**
- **TailwindCSS**
- **Vercel** (деплой)

---

## 📂 Структура проєкту

```
src/
├── app/ # Redux store
├── components/ # UI-компоненти (напр. CommentsSection)
├── pages/ # Route-сторінки (HomePage, PostPage, Create, Edit)
├── routes/ # AppRouter
├── services/ # Firebase логіка
├── types/ # Типи (Post, Comment)
├── utils/ # Zod-схеми, хелпери
```

---

## 📌 Основні компоненти

- **HomePage** – список постів + фільтр по автору
- **PostPage** – повний перегляд поста + коментарі
- **CreatePostPage** – створення поста з валідацією (Zod)
- **EditPostPage** – редагування існуючого поста
- **CommentsSection** – додавання/відображення коментарів

---

## 🚀 Демо та репозиторій

🔗 Live: [https://initial-blog-giv8r88j6-ruslans-projects-362af729.vercel.app](https://initial-blog-giv8r88j6-ruslans-projects-362af729.vercel.app)  
💻 GitHub: [https://github.com/RusVass/Initial-blog-app](https://github.com/RusVass/Initial-blog-app)

---

## ▶️ Як запустити локально

```bash
git clone https://github.com/RusVass/Initial-blog-app.git
cd Initial-blog-app
npm install
npm run dev
```

🔐 .env змінні (для Firebase)

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

🔒 Ці змінні мають бути додані в `.env` файл локально або через Vercel при деплої.

---

## ✅ Реалізовано

- Створення, перегляд, редагування та видалення постів (CRUD)
- Коментарі до постів
- Валідація форм через Zod
- Фільтрація по автору
- Стейт через Redux Toolkit
- Фетчинг через SWR
- Firebase Firestore як бекенд
- Адаптивна верстка з Tailwind
- Деплой на Vercel

---

## 🧪 Тести (опціонально)

```ts
// src/utils/__tests__/postSchema.test.ts
import { postSchema } from '../postSchema';

test('valid data passes', () => {
  const data = { title: 'Test', author: 'User', content: 'Valid content here' };
  expect(() => postSchema.parse(data)).not.toThrow();
});

test('empty content fails', () => {
  const data = { title: 'Test', author: 'User', content: '' };
  expect(() => postSchema.parse(data)).toThrow();
});
```

---

## 🧑‍💻 Автор

Цей проєкт виконано як тестове завдання для KIT GLOBAL.  
Автор: Ruslan Vasiliev
