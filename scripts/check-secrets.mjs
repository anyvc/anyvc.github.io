// Fails the build if content/data contain IPv4s, flag{...}, key-like strings or the CV phone number.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const ROOTS = ['src/content', 'src/data', 'public'];
const ALLOW_IP = new Set(['169.254.169.254']); // public cloud metadata address used in the DVAPI SSRF payload, not a lab IP
const rules = [
  ['IPv4 address', /\b(?:\d{1,3}\.){3}\d{1,3}\b/g],
  ['flag{...}', /\bflag\{[^}]*\}/gi],
  ['private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
  ['long hex/base64 secret', /\b(?:[A-Fa-f0-9]{32,}|[A-Za-z0-9+/]{40,}={0,2})\b/g],
  ['phone number (CV)', /\+?62[\s-]?858[\s-]?9000[\s-]?8867/g],
];
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
let bad = 0;
for (const root of ROOTS) for (const f of walk(root)) {
  if (!/\.(json|md|html|svg|txt)$/.test(f)) continue;
  const txt = readFileSync(f, 'utf8');
  for (const [name, re] of rules) for (const m of txt.matchAll(re)) {
    if (name === 'IPv4 address' && ALLOW_IP.has(m[0])) continue;
    console.error(`SECRET? ${name} in ${f}: ${m[0].slice(0, 40)}`); bad++;
  }
}
if (bad) { console.error(`\n${bad} potential secret(s). Fix or allow-list deliberately.`); process.exit(1); }
console.log('check-secrets: clean');
