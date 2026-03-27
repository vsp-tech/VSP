import { getAllClients, getClientReports } from '@/lib/clients.js'
import Link from 'next/link'

export const metadata = {
  title: 'Admin Dashboard — Victory Square Partners',
}

export default function AdminDashboard() {
  const clients = getAllClients().map((c) => ({
    ...c,
    reports: getClientReports(c.slug),
  }))

  const totalReports = clients.reduce((sum, c) => sum + c.reports.length, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <link rel="stylesheet" href="/assets/css/vsp-theme.css" />

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1a2332 0%, #0c1929 100%)',
        padding: 'clamp(36px, 6vw, 60px) 0',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
          <img src="/assets/images/vsp-logo.svg" alt="VSP" style={{ height: '32px', marginBottom: '24px', display: 'block' }} />
          <div style={{
            display: 'inline-block',
            background: 'rgba(167,139,250,0.15)',
            color: '#a78bfa',
            fontSize: '13px',
            fontWeight: 600,
            padding: '6px 16px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            border: '1px solid rgba(167,139,250,0.25)',
          }}>
            Admin
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Client Portals
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0 }}>
            {clients.length} clients — {totalReports} reports published
          </p>
        </div>
      </header>

      {/* Stats */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(32px, 6vw, 60px) clamp(20px, 5vw, 48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <StatCard number={clients.length} label="Clients" color="#4a9eff" />
          <StatCard number={totalReports} label="Reports" color="#34d399" />
          <StatCard number={clients.filter((c) => c.reports.length > 0).length} label="With Content" color="#a78bfa" />
          <StatCard number={clients.filter((c) => c.reports.length === 0).length} label="Empty Portals" color="#fbbf24" />
        </div>

        {/* Client List */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#4a9eff',
            marginBottom: '8px',
          }}>All Clients</span>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Client Directory</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {clients.map((client) => (
            <Link
              key={client.slug}
              href={`/portal/${client.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 20px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: client.accentColor || '#4a9eff',
                flexShrink: 0,
              }} />
              <span style={{ flex: 1, fontWeight: 600, color: '#f8fafc' }}>
                {client.name}
              </span>
              <span style={{ color: '#64748b', fontSize: '13px' }}>
                {client.reports.length} {client.reports.length === 1 ? 'report' : 'reports'}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                color: '#64748b',
                background: '#2a3a52',
              }}>
                {client.slug}
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer style={{
        padding: '32px 0',
        borderTop: '1px solid rgba(51,65,85,0.5)',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '13px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
          Victory Square Partners — Admin Portal
        </div>
      </footer>
    </div>
  )
}

function StatCard({ number, label, color }) {
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '32px', fontWeight: 800, color, lineHeight: 1 }}>{number}</div>
      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>{label}</div>
    </div>
  )
}
