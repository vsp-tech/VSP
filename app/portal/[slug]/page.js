import { getClient, getClientReports, getAllClientSlugs } from '@/lib/clients.js'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return getAllClientSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const client = getClient(slug)
  if (!client) return { title: 'Not Found' }
  return { title: `${client.name} — Victory Square Partners` }
}

export default async function ClientPortal({ params }) {
  const { slug } = await params
  const client = getClient(slug)
  if (!client) notFound()

  const reports = getClientReports(slug)
  const accent = client.accentColor || '#4a9eff'

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <link rel="stylesheet" href="/assets/css/vsp-theme.css" />

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1a2332 0%, #0c1929 100%)',
        padding: 'clamp(36px, 6vw, 60px) 0',
        borderBottom: '1px solid #334155',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <img src="/assets/images/vsp-logo.svg" alt="VSP" style={{ height: '32px' }} />
            {client.logo && (
              <img src={client.logo} alt={client.name} style={{ height: '36px' }} />
            )}
          </div>
          <div style={{
            display: 'inline-block',
            background: `${accent}22`,
            color: accent,
            fontSize: '13px',
            fontWeight: 600,
            padding: '6px 16px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            border: `1px solid ${accent}33`,
          }}>
            Client Portal
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 700,
            color: '#f8fafc',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}>
            {client.name}
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0 }}>
            Reports and deliverables from Victory Square Partners.
          </p>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(32px, 6vw, 60px) clamp(20px, 5vw, 48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: accent,
              marginBottom: '8px',
            }}>Documents</span>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Your Reports
            </h2>
          </div>
          <span style={{
            fontSize: '13px',
            color: '#64748b',
          }}>
            {reports.length} {reports.length === 1 ? 'file' : 'files'}
          </span>
        </div>

        {reports.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: '#64748b',
            fontSize: '14px',
            background: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #334155',
          }}>
            <p style={{ marginBottom: '8px' }}>No reports published yet.</p>
            <p style={{ margin: 0 }}>Your team at VSP will publish reports here as they become available.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reports.map((report) => (
              <a
                key={report.file}
                href={report.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{
                  color: report.type === 'PDF' ? '#f87171' : accent,
                  fontSize: '16px',
                  width: '20px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  {report.type === 'PDF' ? '📄' : '📊'}
                </span>
                <span style={{ flex: 1 }}>{report.title}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  color: '#64748b',
                  background: '#2a3a52',
                }}>
                  {report.type}
                </span>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 0',
        borderTop: '1px solid rgba(51,65,85,0.5)',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '13px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
          Victory Square Partners — Confidential
        </div>
      </footer>
    </div>
  )
}
