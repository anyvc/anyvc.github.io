import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* Content is data: one Markdown file per entry (see CONTENT.md).
   Schema defaults keep an entry hidden and unsanitised until the owner
   says otherwise, so a half-finished file can never leak onto the site. */

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().default(""),
    year: z.number().int().optional(),
    order: z.number().default(100),
    draft: z.boolean().default(true),
    category: z.enum(["soc", "pentest", "cloud", "research"]),
    tags: z.array(z.string()).default([]),
    severity: z.enum(["critical", "high", "medium", "low"]).nullable().default(null),
    stack: z.array(z.string()).default([]),
    outcomes: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.string().default(""),
        writeup: z.string().default(""),
      })
      .default({ repo: "", writeup: "" }),
    sanitized: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    type: z.enum(["paper", "writeup"]),
    // Must match reality. No default: the file has to state it.
    status: z.enum(["manuscript", "preprint", "published"]),
    authors: z.array(z.string()).default([]),
    year: z.number().int().optional(),
    order: z.number().default(100),
    draft: z.boolean().default(true),
    sanitized: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
