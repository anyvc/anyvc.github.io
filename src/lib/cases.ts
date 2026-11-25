import { getCollection } from 'astro:content';
export const GROUPS = ['Defense', 'Offense', 'Research'] as const;
export async function getCases() {
  return (await getCollection('cases')).sort((a, b) => a.data.order - b.data.order);
}
export const counts = (cases: Awaited<ReturnType<typeof getCases>>) =>
  Object.fromEntries(GROUPS.map(g => [g, cases.filter(c => c.data.group === g).length])) as Record<(typeof GROUPS)[number], number>;
