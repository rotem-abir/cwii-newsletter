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

loadDotEnv(path.join(root, '.env'));

const bucket = process.env.R2_BUCKET_NAME;
if (!bucket) {
  console.error(
    '[r2-smoke-upload] Set R2_BUCKET_NAME (copy .env.example → .env or export in shell).'
  );
  process.exit(1);
}

let prefix = process.env.R2_NEWSLETTER_PREFIX ?? 'newsletter/';
prefix = prefix.replace(/\/+$/, '');
const objectKey = `${prefix}/_smoke-test.txt`;
const objectPath = `${bucket}/${objectKey}`;
const filePath = path.join(__dirname, 'smoke-upload.txt');

if (!fs.existsSync(filePath)) {
  console.error('[r2-smoke-upload] Missing file:', filePath);
  process.exit(1);
}

const args = [
  'wrangler',
  'r2',
  'object',
  'put',
  objectPath,
  '--file',
  filePath,
  '--remote',
];

const result = spawnSync('npx', args, {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
