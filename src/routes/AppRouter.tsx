import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreatePostPage from '../pages/CreatePostPage'
import EditPostPage from '../pages/EditPostPage'
import HomePage from '../pages/HomePage'
import PostPage from '../pages/PostPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/edit/:id" element={<EditPostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

