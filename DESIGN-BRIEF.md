# Design brief: "The Watcher"

## Subject and job of the site
A portfolio for a student who wants a SOC analyst internship and is heading toward cloud security.
Audience: recruiters and security engineers who skim first and verify later.
Primary job: within 10 seconds show who this is, what they have built, and give proof (write-ups, lab, paper, CV).

## Concept
Monitoring and being watched. The owner's own reference images are dark red and black with eyes, masks,
crosshairs, glitch, dither and ASCII textures. The site should feel like looking at a SOC screen at night,
not like a horror poster. The references are mood only. Do not copy or trace them; build every visual from code.

## Spend boldness in one place
The one memorable thing is the **eye**: a small SVG eye in the hero whose pupil follows the cursor
(on touch devices it slowly drifts). Everything else stays quiet and disciplined.
One orchestrated page-load moment is allowed (the eye opening). No fade-and-slide-up on every section,
no hover animation on every card.

## Tokens (all live in `src/styles/tokens.css`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#070707` | page background |
| `--surface` | `#120a0a` | panels, project entries |
| `--blood` | `#E10600` | headings accents, links, the eye |
| `--maroon` | `#3A0000` | borders, dither fills, hover wash |
| `--bone` | `#EDE6E0` | all body text |
| `--ash` | `#8A8A8A` | secondary text, metadata |

Rules: body text is always `--bone` on `--bg`. Red is for accents and large type only, never for paragraphs.
Check contrast for every pair. Add a light "Clean view" palette in the same file.

## Type
- Two families, clearly distinct. One display face with character for headlines and the owner's name,
  one readable face for body. A monospace face only where content is really code, logs or rule IDs.
- Do not default to Inter, Roboto, Arial or system fonts. Try 2 to 3 candidates (for example Space Grotesk,
  Syne, Unbounded for display) and pick by looking at screenshots. Self-host the font files.
- Line length under 80 characters. Sentence case. No all-caps eyebrow label above every heading.
- Do not accent a single word in a headline with a different colour or italic.

## Layout concept
```
[ name ]                                   [ projects  writing  cv  clean view ]
+------------------------------------------------------------------+
|  (eye)      Rayn Hanash Fasya                                    |
|             SOC analyst candidate. Builds detection labs.       |
|             [ view cv ]  [ github ]  [ linkedin ]                |
+------------------------------------------------------------------+
|  Case files (projects)  one row per project, severity as text    |
|  Detection coverage     ATT&CK matrix: tested / detected / gap   |
|  Writing                paper and write-ups                      |
|  About + contact                                                 |
+------------------------------------------------------------------+
```
- Left-aligned content, one main column, wide margins. Projects are rows with different weight, not identical rounded cards.
- Use structure only when it carries information: a numbered list only for real sequences (a kill chain),
  severity labels only on findings, a timeline only for the real timeline.
- The coverage matrix is real data from the owner's Wazuh lab (detected, not detected, test failed). Never fake it.

## Textures and effects (generated, never copied)
- Subtle noise/grain and dithered edges in red on black (canvas or SVG filter), very low opacity behind the hero only.
- Optional pair of glowing eyes appearing in dark empty areas, at most one at a time, never over text.
- Crosshair cursor on desktop pointer devices only; keep the normal cursor on links and form fields.
- Scanlines are optional and off by default. All motion stops under `prefers-reduced-motion`.

## Clean view
A visible toggle switches to a minimal, high-readability layout (light background, system-free fonts still self-hosted,
no effects). The choice is remembered in `localStorage`. Both views read the same content.

## Copy
- Plain, specific, first person. Use real facts (rule IDs, tools, outcomes) instead of adjectives like "passionate".
- Buttons say what happens: "Download CV", "Read the write-up". Avoid "→" on every link and middle-dot meta strings.
- No placeholder lorem ipsum in the final site. Unknown content gets a visible `TODO:`.

## Self-check before finishing a task
1. Would this page look the same for any dark cybersecurity portfolio? If yes, change something specific to this owner.
2. Is anything decorative with no job? Remove it. Remove one accessory.
3. Does the first screen state name, role and one proof within 10 seconds on a phone?
4. Are red and the eye used sparingly enough that they still mean something?
