# Security operations

No configuration guarantees zero compromise risk. This is a hardening pass, not an independent penetration test.

## Owner actions after release
- Admin → Settings: change the old owner password to a unique password of at least 16 characters.
- Set up an authenticator and confirm its current code. Setup does not enable MFA until confirmed; it expires in ten minutes. Enabling MFA invalidates all admin sessions. Store the setup key in a password manager with an encrypted backup. There is no public MFA bypass/reset route; lost-device recovery requires Cloudflare account access.
- Enable MFA on Cloudflare and GitHub separately, and review account access.

## Recovery
Cloudflare D1 Time Travel is provider-managed; verify the available retention for the account plan. Before any destructive operation, capture a recovery bookmark and export a backup. Never commit exported SQL, credentials or customer data.
The 2026-11-03 export was restored to an isolated in-memory SQLite database: integrity_check=ok, foreign_key_check=0. The local export was then encrypted with Windows DPAPI CurrentUser and decrypt-verified. It requires the original Windows user profile to recover. Keep a separately protected off-device backup; this local copy alone is not disaster recovery. Do not restore production just to test a backup.

## Monitoring
GET /api/health checks database availability and returns no customer data. API failures log an event ID and HTTP method, not request bodies or credentials. Configure an external uptime monitor and Cloudflare alert destination separately; no recurring AI automation was created. Alert delivery is not yet connected.

## Email integration (disabled)
lib/transactional-email.ts prepares a server-only Resend adapter. Keep EMAIL_ENABLED unset until RESEND_API_KEY (Cloudflare secret) and a verified EMAIL_FROM sender are configured. This adapter alone does not activate email verification or email password-reset flows: token lifecycle, delivery and abuse tests must be completed before replacing recovery-code authentication. Never expose the API key to client bundles. Email features remain disabled.

## Manual UPI orders
An account can hold at most three awaiting-payment orders. The database enforces this atomically. Do not automatically expire these orders: money may have arrived before manual bank reconciliation. Review old pending orders against the bank, then cancel through admin to restore stock. Payment success remains a manual verified-bank-credit action.

## Checks
Run npm audit --omit=dev, TypeScript, build and scripts/security-selftest.mjs (Node 24). Test unauthorized admin access, cross-origin rejection, oversized-body rejection and health/security headers on preview before production. The current CSP blocks external framing, object embeds and foreign base URLs; it is not yet a strict script nonce policy. Full penetration and load testing remain separate work.
