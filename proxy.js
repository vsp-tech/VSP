import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.VSP_SESSION_SECRET || 'vsp-dev-secret-change-in-production'
)
const COOKIE_NAME = 'vsp_session'

export async function proxy(request) {
  const { pathname } = request.nextUrl

  // Public routes — no auth needed
  if (
    pathname === '/login' ||
    pathname === '/api/login' ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets/') ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|woff|woff2|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Verify session
  const cookie = request.cookies.get(COOKIE_NAME)
  if (!cookie) {
    return redirectToLogin(request, pathname)
  }

  let session
  try {
    const { payload } = await jwtVerify(cookie.value, SECRET)
    session = payload
  } catch {
    return redirectToLogin(request, pathname)
  }

  // Admin can access everything
  if (session.role === 'admin') {
    const response = NextResponse.next()
    response.headers.set('x-vsp-role', 'admin')
    return response
  }

  // Client can only access their own portal
  if (session.role === 'client' && session.slug) {
    const allowedPrefix = `/portal/${session.slug}`

    if (pathname.startsWith(allowedPrefix)) {
      const response = NextResponse.next()
      response.headers.set('x-vsp-role', 'client')
      response.headers.set('x-vsp-slug', session.slug)
      return response
    }

    // Client accessing root — redirect to their portal
    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL(allowedPrefix, request.url))
    }

    // Client accessing someone else's portal or admin — forbidden
    return new NextResponse('Forbidden', { status: 403 })
  }

  return redirectToLogin(request, pathname)
}

function redirectToLogin(request, pathname) {
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
