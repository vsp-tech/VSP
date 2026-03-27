import { NextResponse } from 'next/server'
import { sha256, findClientByPasswordHash } from '@/lib/clients.js'
import { createSession } from '@/lib/session.js'

export async function POST(request) {
  const { password } = await request.json()
  const hash = await sha256(password)
  const match = findClientByPasswordHash(hash)

  if (!match) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const session = await createSession(match)
  const response = NextResponse.json({
    ok: true,
    role: match.role,
    slug: match.slug,
  })
  response.cookies.set(session.name, session.value, session.options)
  return response
}
