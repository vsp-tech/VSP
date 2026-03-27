import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifySession, COOKIE_NAME } from '@/lib/session.js'

export default async function Home() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)

  if (!sessionCookie) {
    redirect('/login')
  }

  const session = await verifySession(sessionCookie.value)

  if (!session) {
    redirect('/login')
  }

  if (session.role === 'admin') {
    redirect('/admin')
  }

  if (session.role === 'client' && session.slug) {
    redirect(`/portal/${session.slug}`)
  }

  redirect('/login')
}
