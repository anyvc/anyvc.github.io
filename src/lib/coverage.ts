import data from '../data/coverage.json';
export type Status = 'd' | 'm' | 'f' | 'n';
export const ORDER: Status[] = ['d', 'm', 'f', 'n'];
export const LABEL: Record<Status, string> = { d: 'Detected', m: 'Not detected', f: 'Did not run', n: 'Not applicable' };
export const items = [...data.items].sort((a, b) => ORDER.indexOf(a.status as Status) - ORDER.indexOf(b.status as Status));
export const totals = Object.fromEntries(ORDER.map(s => [s, items.filter(i => i.status === s).length])) as Record<Status, number>;
export const total = items.length;
export const ran = totals.d + totals.m;            // "did not run" is never counted as "not detected"
export const headline = `${total} techniques tested (${ran} ran)`;
// Build-time guard: totals must match the brief (section 8).
const expected = { d: 1, m: 3, f: 3, n: 1 };
for (const s of ORDER) if (totals[s] !== expected[s]) throw new Error(`coverage.json drifted from brief: ${s}=${totals[s]}, expected ${expected[s]}`);
if (ran !== 4 || total !== 8) throw new Error('coverage headline must read "8 techniques tested (4 ran)"');
export const byTactic = data.tactics.map(t => ({ tactic: t, items: items.filter(i => i.tactic === t) }));
