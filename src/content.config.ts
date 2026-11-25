import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const para = z.string(); // supports {{redact:N}}, `code`; never raw HTML
const sections = z.object({
  goal: z.array(para).optional(), setup: z.array(para).optional(), did: z.array(para).optional(),
  results: z.array(para).optional(), failed: z.array(para).optional(), next: z.array(para).optional(),
});

const cases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/cases' }),
  schema: z.object({
    order: z.number(),
    cat: z.string(),
    group: z.enum(['Defense', 'Offense', 'Research']),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    meta: z.string(),
    card: z.object({ n: z.string(), unit: z.string().optional(), caption: z.string() }),
    kpis: z.array(z.object({ n: z.string(), label: z.string() })).length(3),
    credit: z.string().optional(),
    sections,
    docs: z.array(z.object({ label: z.string(), href: z.string().nullable() })).default([]),
    signal: z.string().optional(),
    artifact: z.object({ type: z.string(), code: z.string() }).optional(),
    diagram: z.object({
      label: z.string(),
      nodes: z.array(z.object({ title: z.string(), sub: z.string().optional() })),
      edges: z.array(z.string()).optional(),
      hot: z.number().optional(),
    }).optional(),
    redactions: z.array(z.object({ label: z.string(), width: z.number() })).optional(),
  }),
});

export const collections = { cases };
