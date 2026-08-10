# Cloudflare Pages delivery

Use this route for a static learning map that already contains browser-ready HTML, CSS, JavaScript, and data files.

Facts in this reference were checked against Cloudflare's official documentation on 2026-08-11. Recheck the official pages before publishing time-sensitive limits.

## Why the free tier is usually enough

For a personal static learning map:

- requests for static assets are free and unlimited on both free and paid plans;
- the Free plan allows 500 builds per month;
- a Pages site can contain up to 20,000 files on the Free plan;
- one static asset can be up to 25 MiB;
- the Free plan supports up to 100 Pages projects per account.

This is usually sufficient for an HTML/CSS/JS learning map with no server-side functions. Pages Functions are different: their requests count toward the Workers plan quota. Cloudflare currently documents a shared Workers Free allowance of 100,000 requests per day for Workers and Pages Functions.

Official references:

- Limits: https://developers.cloudflare.com/pages/platform/limits/
- Pages Functions pricing: https://developers.cloudflare.com/pages/functions/pricing/
- Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/

## Minimum direct-upload route

Direct Upload does not require a GitHub or GitLab repository.

1. Build the learning map and identify the output directory containing `index.html`.
2. Authenticate Wrangler:

   ```bash
   npx wrangler login
   ```

3. Create the Pages project once:

   ```bash
   npx wrangler pages project create
   ```

4. Deploy the output directory:

   ```bash
   npx wrangler pages deploy <OUTPUT_DIRECTORY>
   ```

5. Open the returned `*.pages.dev` URL and verify the real artifact at desktop and mobile sizes.

Cloudflare also supports dashboard drag-and-drop for a folder or ZIP. Prefer Wrangler when repeatability, larger file counts, preview branches, or a `functions` folder matters.

## Domain and visibility boundary

- A Pages project receives a `*.pages.dev` address, so a custom domain is optional.
- A public `pages.dev` address is publicly reachable; an unlisted URL is not authentication.
- If the material should be private, do not deploy the private corpus. Use access control or keep the map local.
- Never upload complete copyrighted books, paid-course text, private notes, credentials, `.dev.vars`, or environment files.

## Verification

Before reporting success, verify:

- the production URL returns HTTP 200;
- CSS, JavaScript, and data assets load;
- the first lesson opens;
- search, path switching, notes, and progress work;
- 1440×1000 desktop and 390×844 mobile have no horizontal overflow;
- the public package contains no private corpus or secret values;
- the deployment ledger has been updated.
