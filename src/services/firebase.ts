import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { Comment } from '../types/Comment'
import type { Post } from '../types/Post'
import type { PostFormData } from '../utils/postSchema'

type FirebaseEnvKey =
  | 'VITE_FIREBASE_API_KEY'
  | 'VITE_FIREBASE_AUTH_DOMAIN'
  | 'VITE_FIREBASE_PROJECT_ID'
  | 'VITE_FIREBASE_STORAGE_BUCKET'
  | 'VITE_FIREBASE_MESSAGING_SENDER_ID'
  | 'VITE_FIREBASE_APP_ID'

function requireEnv(key: FirebaseEnvKey): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
}

const app: FirebaseApp = initializeApp(firebaseConfig)
const db: Firestore = getFirestore(app)
const postsRef = collection(db, 'posts')
const commentsRef = collection(db, 'comments')

export async function fetchPostsFromFirestore(): Promise<Post[]> {
  const snapshot = await getDocs(postsRef)
  return snapshot.docs.map(deserializePost)
}

export async function getPostById(id: string): Promise<Post | null> {
  const snapshot = await getDoc(doc(db, 'posts', id))
  if (!snapshot.exists()) {
    return null
  }
  return deserializeData(snapshot.data(), snapshot.id)
}

export async function addPost(payload: Omit<Post, 'id'>): Promise<Post> {
  const documentPayload = toFirestorePayload(payload)
  const createdDoc = await addDoc(postsRef, documentPayload)
  return { id: createdDoc.id, ...payload, createdAt: documentPayload.createdAt.toDate().toISOString() }
}

export async function addPostToFirestore(data: PostFormData): Promise<void> {
  await addDoc(postsRef, {
    ...data,
    createdAt: new Date().toISOString(),
  })
}

export async function updatePost(
  id: string,
  payload: Partial<Omit<Post, 'id'>>,
): Promise<void> {
  const docRef = doc(db, 'posts', id)
  const updates = toFirestoreUpdate(payload)
  if (Object.keys(updates).length === 0) {
    return
  }
  await updateDoc(docRef, updates)
}

export async function updatePostInFirestore(id: string, data: PostFormData): Promise<void> {
  const docRef = doc(db, 'posts', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export async function deletePostFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', id))
}

export async function fetchCommentsForPost(postId: string): Promise<Comment[]> {
  const commentsQuery = query(commentsRef, where('postId', '==', postId), orderBy('createdAt', 'asc'))
  const snapshot = await getDocs(commentsQuery)
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Comment, 'id'>),
  }))
}

export async function addCommentToPost(comment: Omit<Comment, 'id'>): Promise<void> {
  await addDoc(commentsRef, comment)
}

function deserializePost(snapshot: QueryDocumentSnapshot<DocumentData>): Post {
  return deserializeData(snapshot.data(), snapshot.id)
}

function deserializeData(data: DocumentData, id: string): Post {
  return {
    id,
    title: typeof data.title === 'string' ? data.title : 'Untitled post',
    content: typeof data.content === 'string' ? data.content : '',
    author: typeof data.author === 'string' ? data.author : 'Anonymous',
    createdAt: serializeDate(data.createdAt),
  }
}

function toFirestorePayload(payload: Omit<Post, 'id'>) {
  return {
    title: payload.title,
    content: payload.content,
    author: payload.author,
    createdAt: toTimestamp(payload.createdAt),
  }
}

function toFirestoreUpdate(payload: Partial<Omit<Post, 'id'>>) {
  const update: Record<string, unknown> = {}

  if (typeof payload.title === 'string') update.title = payload.title
  if (typeof payload.content === 'string') update.content = payload.content
  if (typeof payload.author === 'string') update.author = payload.author
  if (typeof payload.createdAt === 'string') update.createdAt = toTimestamp(payload.createdAt)

  return update
}

function toTimestamp(value?: string) {
  if (!value) {
    return Timestamp.fromDate(new Date())
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return Timestamp.fromDate(new Date())
  }
  return Timestamp.fromDate(parsed)
}

function serializeDate(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString()
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'string' && value.length > 0) {
    return value
  }
  return new Date().toISOString()
}

export { app, db, postsRef }
