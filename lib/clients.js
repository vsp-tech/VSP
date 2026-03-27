import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

let _clientsData = null

export function getClientsData() {
  if (!_clientsData) {
    const raw = readFileSync(join(process.cwd(), 'data/clients.json'), 'utf-8')
    _clientsData = JSON.parse(raw)
  }
  return _clientsData
}

export function getClient(slug) {
  const data = getClientsData()
  return data.clients[slug] || null
}

export function getAllClientSlugs() {
  const data = getClientsData()
  return Object.keys(data.clients)
}

export function getAllClients() {
  const data = getClientsData()
  return Object.entries(data.clients).map(([slug, client]) => ({
    slug,
    ...client,
  }))
}

export function getClientReports(slug) {
  const reportsDir = join(process.cwd(), 'public', 'portal', slug, 'reports')
  if (!existsSync(reportsDir)) return []

  return readdirSync(reportsDir)
    .filter((f) => f.endsWith('.html') || f.endsWith('.pdf'))
    .map((file) => {
      const ext = file.split('.').pop()
      const name = file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      return {
        file,
        title: name.charAt(0).toUpperCase() + name.slice(1),
        type: ext.toUpperCase(),
        href: `/portal/${slug}/reports/${file}`,
      }
    })
    .sort((a, b) => b.file.localeCompare(a.file))
}

export async function sha256(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function findClientByPasswordHash(hash) {
  const data = getClientsData()

  // Check admin first
  if (data.admin.passwordHash === hash) {
    return { role: 'admin', slug: null }
  }

  // Check each client
  for (const [slug, client] of Object.entries(data.clients)) {
    if (client.passwordHash === hash) {
      return { role: 'client', slug }
    }
  }

  return null
}
