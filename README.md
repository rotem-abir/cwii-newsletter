# Monthly digest email (build + R2 prep)

## Build

```bash
npm install
npm run build
```

Writes dated HTML under `dist/`:

- `dist/index-YYYY-MM.html` — single output (email + “view in browser”)

(`YYYY-MM` is the calendar month when the build runs.)

## Cloudflare R2 — authenticate locally

Pick one:

1. **Interactive (simplest on a dev machine)**  
   ```bash
   npx wrangler login
   ```

2. **API token (automation / CI)**  
   - Dashboard → My Profile → API Tokens → create a token with **R2** write access to your bucket.  
   - Set `CLOUDFLARE_API_TOKEN` (e.g. in `.env` — see `.env.example`).  
   - Never commit tokens.

Copy `.env.example` to `.env` and set at least `R2_BUCKET_NAME` for the smoke upload. `.env` is gitignored.

## Test connection to R2

```bash
npm run r2:whoami
```

Upload a tiny test object (requires `R2_BUCKET_NAME`; optional `R2_NEWSLETTER_PREFIX`, default `newsletter/`):

```bash
npm run r2:smoke-upload
```

Object key: `{prefix}/_smoke-test.txt` (e.g. `newsletter/_smoke-test.txt`).  
If the bucket is served publicly, check `R2_PUBLIC_BASE_URL` + that path in a browser (optional).

## Newsletter publish (later)

Publish: `publish-newsletter.bat` uploads `dist/index-YYYY-MM.html` to R2, e.g. `newsletter/index-YYYY-MM.html`.

### Contract

| Item | Value |
|------|--------|
| Bucket | `R2_BUCKET_NAME` |
| Prefix | `R2_NEWSLETTER_PREFIX` (default `newsletter/`) |
| Public URL | `{R2_PUBLIC_BASE_URL}` + same path as object key (depends on your r2.dev / custom domain setup) |
