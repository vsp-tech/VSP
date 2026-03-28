# Cycle 1 Lessons

## Gap Analysis
- **Vercel platform issues dominated the cycle.** The actual code implementation (auth, portal pages, admin) was straightforward — ~90% of debugging time was spent on Vercel SSO protection and framework detection. The scan did not anticipate account-level platform settings as a blocker.
- **public/index.html conflict was a subtle bug.** Next.js serves static files from public/ at matching paths, which silently overrode the app router. This is a known Next.js footgun but wasn't flagged during the scan.
- **Next.js 16 rename of middleware → proxy was caught early** thanks to reading the docs, but could have been a major time sink otherwise.

## Pattern Recognition
- Platform/infrastructure issues are harder to diagnose remotely than code issues. The Vercel SSO problem required the user to manually toggle a dashboard setting — no CLI or API access was available.
- File-based architecture is proving correct. Zero infrastructure issues from the data layer. All complexity came from the deployment platform.

## Process Observations
- The three-way parallel debate was efficient and produced strong consensus. All three agents independently arrived at file-based + per-client passwords + hybrid routing.
- Recheck via curl was highly effective — caught the real issues (SSO blocking, static file override) that would have been invisible in a code review.

## Recommendations for Next Cycle
1. **Publishing skills** — the highest-value remaining item. Tyler needs to move HTML/PDF/MD files from other repos (especially vsp-tyler-christine-rocketship/report_gate/) into client portal folders. This is the core workflow that makes the portal useful.
2. **Client onboarding skill** — scaffold a new client (folder + config entry + password generation). Without this, adding the real 66 clients is manual and error-prone.
3. **Set VSP_SESSION_SECRET env var** in Vercel production — currently using a dev default, which is a security gap.
4. **Logout endpoint** — no way to end a session currently.
