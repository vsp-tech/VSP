# Cycle 1 Plan

## Scan Findings
- **Architecture**: Bare static site with single shared password, no framework detection, no multi-tenancy
- **Auth**: Single SHA-256 hash in proxy, no user identity, no role-based access
- **Data**: No client data model, no tenant separation, all content public after login
- **Routing**: Static HTML in public/, no dynamic routes, no client portals
- **Deployment**: Vercel project created as "no framework", SSO protection blocking all access

## Debate Outcomes
Three parallel debates resolved:
1. **Database vs File-based**: File-based won unanimously. 66 clients = JSON config + folder conventions. Zero infrastructure.
2. **Auth Strategy**: Per-client passwords in JSON with HMAC-signed JWT cookies. No NextAuth, no OAuth. Evolves current system with ~40 lines of change.
3. **Routing/UX**: Hybrid path + session. `/portal/[slug]/` for addressable URLs, session cookie for access control. Clients isolated by proxy enforcement.

## Approved Scope
1. Create data/clients.json schema with example clients + admin
2. Rewrite proxy.js with HMAC-signed cookies and client path isolation
3. Rewrite /api/login for multi-client password lookup
4. Build /portal/[slug]/page.js — personalized client landing
5. Build /admin/page.js — all-clients dashboard
6. Fix Vercel deployment (framework detection, SSO protection)

## Deferred Items
- Publishing skills (copy files from other repos)
- Client onboarding skill (scaffold new client)
- Security headers hardening
- Rate limiting on login endpoint
