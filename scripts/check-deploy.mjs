// Run before pushing: npm run check:deploy. Verifies the repo is ready for GitHub Pages (user site, no base path).
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const root = process.argv[2] ?? '.';
const p = f => `${root}/${f}`, read = f => (existsSync(p(f)) ? readFileSync(p(f), 'utf8') : '');
let bad = 0; const fail = m => { console.error(`FAIL ${m}`); bad++; }; const ok = m => console.log(`ok   ${m}`);
const check = (cond, okMsg, failMsg) => (cond ? ok(okMsg) : fail(failMsg));

check(existsSync(p('package-lock.json')), 'package-lock.json present', 'package-lock.json missing: run `npm install` and commit it (the Astro action detects npm from the lockfile)');
const wf = read('.github/workflows/deploy.yml');
check(/withastro\/action@/.test(wf) && /actions\/deploy-pages@/.test(wf), 'workflow uses withastro/action and deploy-pages', 'deploy.yml missing or does not use withastro/action + actions/deploy-pages');
check(/pages:\s*write/.test(wf) && /id-token:\s*write/.test(wf), 'workflow has pages: write and id-token: write', 'deploy.yml needs permissions pages: write and id-token: write');
const cfg = read('astro.config.mjs');
check(/site:\s*['"]https:\/\/anyvc\.github\.io\/?['"]/.test(cfg), "astro.config site is 'https://anyvc.github.io'", "astro.config.mjs: site must be 'https://anyvc.github.io'");
check(!/(^|[\s{,])base\s*:/.test(cfg.replace(/(^|\s)\/\/.*$/gm, '$1')), 'no `base` set (correct for a <username>.github.io repo)', 'astro.config.mjs: remove `base` (user site is served from the root)');
const gi = read('.gitignore');
check(/node_modules/.test(gi) && /^dist\/?$/m.test(gi), '.gitignore covers node_modules and dist', '.gitignore must list node_modules and dist');
for (const f of ['public/og.png', 'public/CV_Rayn_Hanash_Fasya.pdf', 'public/favicon.svg', 'public/robots.txt']) check(existsSync(p(f)), `${f} present`, `${f} missing`);
try {
  const url = execSync('git remote get-url origin', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  /anyvc\/anyvc\.github\.io(\.git)?$/.test(url) ? ok(`git origin is ${url}`) : console.warn(`WARN git origin is ${url}; a user site must live in anyvc/anyvc.github.io`);
} catch { console.warn('WARN could not read git origin (not a git repo yet?)'); }
if (bad) { console.error(`\n${bad} problem(s) to fix before pushing.`); process.exit(1); }
console.log('\ncheck-deploy: ready to push. In GitHub: Settings > Pages > Source = GitHub Actions.');
