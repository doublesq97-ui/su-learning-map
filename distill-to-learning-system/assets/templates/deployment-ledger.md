# Deployment ledger

Keep one row per public or protected deployment. Record secret names and configuration status only; never record secret values.

| Field | Value |
|---|---|
| Project purpose | |
| Owner | |
| Environment | Production / Preview / Local |
| Provider and resource | Cloudflare Pages: `<project-name>` |
| Public URL | |
| Visibility | Public / Link-only expectation / Authenticated |
| Source of truth | Local path or repository URL |
| Deploy method | Wrangler Direct Upload / Dashboard / Git integration |
| Private material excluded | Yes / No — explain |
| Secrets configured | Names only, or None |
| Current status | Planned / Deployed / Verified / Paused / Retired |
| Deploy date | YYYY-MM-DD |
| Verification date | YYYY-MM-DD |
| Verification evidence | HTTP, desktop, mobile, interactions |
| Next action | |

## Update rule

Update this record when the project is created, deployed, updated, rolled back, paused, or deleted. A successful build or upload is not the same as a verified production deployment.
