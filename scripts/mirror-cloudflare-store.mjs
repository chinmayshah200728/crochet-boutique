import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(repo, '..', 'crochetbyprisha-store');
const target = path.join(repo, 'cloudflare-store');
const dirs = ['app', 'components', 'db', 'drizzle', 'hooks', 'lib', 'public', 'vendor', 'scripts/connector-preview'];
const files = [
  'package.json', 'package-lock.json', 'tsconfig.json', 'next.config.ts',
  'next-env.d.ts', 'postcss.config.mjs', 'eslint.config.mjs', 'vite.config.ts',
  'drizzle.config.ts', 'cloudflare-env.d.ts', 'components.json', '.npmrc',
  'build/connector-preview-plugin.mjs', 'build/connector-preview-worker.mjs',
  'build/sites-vite-plugin.LICENSE', 'build/sites-vite-plugin.ts', 'build/sites-worker.ts',
  'scripts/execution-profile.mjs', 'scripts/sites-env.mjs', 'scripts/sites-env.sh',
  'scripts/run-framework.mjs', 'scripts/build-verified.sh', 'scripts/install-ci.mjs',
  'scripts/install-ci.sh', 'scripts/npm-install.mjs', 'scripts/pnpm-install.mjs',
  'scripts/install-pnpm.sh', 'scripts/check-store.mjs', 'scripts/check-worker.mjs',
  'scripts/check-launch.mjs', 'scripts/check-discovery.mjs',
  'scripts/check-live-discovery.mjs', 'scripts/prepare-cloudflare.mjs',
  'scripts/prepare-pages.mjs', 'scripts/export-collection-models.mjs',
  'scripts/optimise-art.mjs',
];
const ignored = /(^|\/)(?:\.env[^/]*|\.wrangler|node_modules|dist|\.next|payment-qr\.jpg|cloudflare\.settings\.[^/]+|wrangler\.[^/]+|[^/]*\.(?:log|pem|key|sqlite|sqlite3|db|db-wal|db-shm)|tsconfig\.tsbuildinfo)$/i;
const secretPattern = /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|CLOUDFLARE_API_TOKEN\s*[=:]\s*[^\s]+|_authToken\s*=\s*[^\s]+)/i;
const textFile = /\.(?:[cm]?js|[cm]?ts|tsx|jsx|json|css|html|md|sh|sql|svg|txt)$/i;
const privateValues = [];
const settingsFile = path.join(source, 'cloudflare.settings.json');
if (fs.existsSync(settingsFile)) {
  const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
  for (const [key, value] of Object.entries(settings)) {
    if (/(?:token|secret|hash|password)/i.test(key) && typeof value === 'string' && value.length >= 12) privateValues.push(value);
  }
}

function within(root, candidate) {
  const relative = path.relative(root, candidate);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Path escapes the intended website folder.');
  }
  return candidate;
}

function clean(relative) {
  return !ignored.test(relative.replaceAll('\\', '/'));
}

const status = execFileSync('git', ['status', '--porcelain', '--', 'cloudflare-store'], {cwd: repo, encoding: 'utf8'}).trim();
if (status) throw new Error('The GitHub checkout has local changes; review them before mirroring again.');
if (!fs.existsSync(source) || !fs.existsSync(target)) throw new Error('Website source or repository is missing.');

const planned = new Map();
function collect(relative) {
  if (!clean(relative)) return;
  const from = within(source, path.resolve(source, relative));
  if (!fs.existsSync(from)) throw new Error(`Expected website file is missing: ${relative}`);
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from)) collect(path.join(relative, name));
  } else if (stat.isFile()) {
    const data = fs.readFileSync(from);
    if (textFile.test(relative)) {
      const content = data.toString('utf8');
      if (secretPattern.test(content) || privateValues.some(value => content.includes(value))) {
        throw new Error(`A possible credential needs review before GitHub sync: ${relative}`);
      }
    }
    planned.set(relative.replaceAll('\\', '/'), data);
  }
}

for (const dir of dirs) collect(dir);
for (const file of files) collect(file);

let changed = 0;
for (const [relative, data] of planned) {
  const to = within(target, path.resolve(target, relative));
  if (fs.existsSync(to) && fs.readFileSync(to).equals(data)) continue;
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.writeFileSync(to, data);
  changed++;
}

const tracked = execFileSync('git', ['ls-files', '-z', '--', 'cloudflare-store'], {cwd: repo, encoding: 'utf8'}).split('\0').filter(Boolean);
for (const repoPath of tracked) {
  const relative = repoPath.slice('cloudflare-store/'.length);
  const covered = dirs.some(dir => relative.startsWith(`${dir}/`)) || files.includes(relative);
  if (!covered || !clean(relative) || planned.has(relative)) continue;
  const to = within(target, path.resolve(target, relative));
  if (fs.existsSync(to) && fs.statSync(to).isFile()) { fs.unlinkSync(to); changed++; }
}

console.log(`Mirrored website source: ${changed} file change(s).`);
