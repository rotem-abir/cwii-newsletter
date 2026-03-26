import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function buildYmStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function fail(msg) {
  console.error(`[publish] ${msg}`);
  process.exit(1);
}

async function verifyUrlOk(url) {
  const res = await fetch(url, { method: 'GET', redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
}

async function main() {
  loadDotEnv(path.join(root, '.env'));

  const bucket = process.env.R2_BUCKET_NAME;
  const publicBase = process.env.R2_PUBLIC_BASE_URL;

  if (!bucket) {
    fail('Set R2_BUCKET_NAME in .env (see .env.example).');
  }
  if (!publicBase || !publicBase.trim()) {
    fail(
      'Set R2_PUBLIC_BASE_URL in .env (public base for the uploaded object, no trailing slash).'
    );
  }

  let prefix = process.env.R2_NEWSLETTER_PREFIX ?? 'newsletter/';
  prefix = prefix.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!prefix) prefix = 'newsletter';

  const ym = buildYmStamp();
  const outputFilename = `index-${ym}.html`;
  const objectKey = `${prefix}/${outputFilename}`;
  const publicUrl = `${publicBase.replace(/\/+$/, '')}/${objectKey}`;
  const localPath = path.join(root, 'dist', outputFilename);

  process.env.NEWSLETTER_VIEW_IN_BROWSER_URL = publicUrl;

  console.log('[publish] Public URL (injected into HTML):', publicUrl);
  console.log('[publish] Building with NEWSLETTER_VIEW_IN_BROWSER_URL set…');

  const buildResult = spawnSync(process.execPath, [path.join(root, 'build-newsletter.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });
  if (buildResult.status !== 0) {
    fail('build-newsletter.mjs exited with an error.');
  }

  if (!fs.existsSync(localPath)) {
    fail(`Build output missing: ${localPath}`);
  }

  console.log('[publish] Checking Wrangler auth (npx wrangler whoami)…');
  const whoami = spawnSync('npx', ['wrangler', 'whoami'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (whoami.status !== 0) {
    fail(
      'Wrangler is not authenticated. Run `npx wrangler login` or set CLOUDFLARE_API_TOKEN in .env.'
    );
  }

  const objectPath = `${bucket}/${objectKey}`;
  console.log('[publish] Uploading →', objectPath);

  const put = spawnSync(
    'npx',
    [
      'wrangler',
      'r2',
      'object',
      'put',
      objectPath,
      '--file',
      localPath,
      '--content-type',
      'text/html; charset=utf-8',
      '--remote',
    ],
    {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    }
  );
  if (put.status !== 0) {
    fail('R2 upload failed.');
  }

  console.log('[publish] Verifying public URL responds…');
  try {
    await verifyUrlOk(publicUrl);
  } catch (e) {
    fail(`URL verification failed: ${e.message}`);
  }

  console.log('[publish] OK — live URL:', publicUrl);
}

main().catch((e) => {
  console.error('[publish]', e);
  process.exit(1);
});
