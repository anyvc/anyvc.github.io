import { getCases } from '../lib/cases';
import site from '../data/site.json';
export async function GET() {
  const cases = await getCases();
  const urls = ['/', ...cases.map(c => `/case/${c.id}/`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${new URL(u, site.siteUrl).href}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
