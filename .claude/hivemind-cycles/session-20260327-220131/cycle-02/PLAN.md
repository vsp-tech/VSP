# Cycle 2 Plan

## Scan Findings
- No system-level publishing skills existed — the portal had no workflow for getting content into client folders
- No client onboarding automation — adding clients required manual JSON editing, folder creation, and password generation
- No quick-deploy convenience skill for ad-hoc redeploys

## Debate Outcomes
No tensions identified — all agents agreed skills should be system-level (~/.claude/skills/) per user requirement, and file-based operations match the existing architecture.

## Approved Scope
1. `/publish-report` skill — publish HTML/PDF/MD files from any repo to a client's portal folder
2. `/new-vsp-client` skill — scaffold a new client (password, config, folders, deploy)
3. `/vsp-deploy` skill — convenience quick-deploy to Vercel

## Deferred Items
- Set VSP_SESSION_SECRET env var in Vercel production
- Logout endpoint
- Security headers beyond X-Content-Type-Options
- Client logo upload workflow
