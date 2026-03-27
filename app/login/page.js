'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const data = await res.json()
      const redirect = searchParams.get('redirect')

      if (redirect) {
        router.push(redirect)
      } else if (data.role === 'admin') {
        router.push('/admin')
      } else if (data.role === 'client' && data.slug) {
        router.push(`/portal/${data.slug}`)
      } else {
        router.push('/')
      }
      router.refresh()
    } else {
      setError('Incorrect password')
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          autoComplete="off"
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Verifying...' : 'Enter'}
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </>
  )
}

export default function LoginPage() {
  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <img src="/assets/images/vsp-logo.svg" alt="Victory Square Partners" style={styles.logo} />
        <h2 style={styles.title}>Access Required</h2>
        <p style={styles.subtitle}>Enter your password to continue.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  box: {
    textAlign: 'center',
    padding: '48px',
    maxWidth: '400px',
    width: '90%',
  },
  logo: {
    height: '36px',
    marginBottom: '32px',
  },
  title: {
    color: '#f8fafc',
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    background: '#1e293b',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  button: {
    width: '100%',
    marginTop: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#4a9eff',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    marginTop: '12px',
  },
}
