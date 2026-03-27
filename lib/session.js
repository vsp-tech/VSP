import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.VSP_SESSION_SECRET || 'vsp-dev-secret-change-in-production'
)

const COOKIE_NAME = 'vsp_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_AGE,
    },
  }
}

export async function verifySession(cookieValue) {
  try {
    const { payload } = await jwtVerify(cookieValue, SECRET)
    return payload // { role: 'admin' | 'client', slug?: string }
  } catch {
    return null
  }
}

export { COOKIE_NAME }
