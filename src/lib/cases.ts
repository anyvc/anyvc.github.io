import { getCollection } from 'astro:content';
export const GROUPS = ['Defense', 'Offense', 'Research'] as const;
export async function getCases() {
  return (await getCollection('cases')).sort((a, b) => a.data.order - b.data.order);
}
export const counts = (cases: Awaited<ReturnType<typeof getCases>>) =>
  Object.fromEntries(GROUPS.map(g => [g, cases.filter(c => c.data.group === g).length])) as Record<(typeof GROUPS)[number], number>;

// Fixed section order for every case page. A section renders only when the case has text for it.
export const SECTIONS = [['goal', 'Goal'], ['setup', 'Setup'], ['did', 'What I did'], ['results', 'Results'], ['failed', 'What failed'], ['next', 'Next']] as const;
