# anyvc.github.io

Personal cybersecurity portfolio for a student targeting SOC analyst internships, later cloud security.
Static Astro site, deployed to GitHub Pages. Content is data, design is code: text and links live in
`src/content/` and `src/data/`, while colours, type and spacing live in `src/styles/tokens.css`.

## Requirements

- Node `26.13.1` — the exact version in `.node-version`, which CI also reads.
- npm `>=9.6.5` (Astro's minimum).
- Astro `7.4.7`, pinned exactly in `package.json`. Keep the lockfile committed.

## Commands

```sh
npm ci          # install from the lockfile
npm run dev     # local preview
npm run build   # must pass before any task is finished
npm run preview # preview the build output
```

`npm run build` writes the static site to `dist/`. The build warns that the `writing` collection is empty;
that is expected until the first writing file exists.

## Fonts

Two families are self-hosted: **Syne** (display) and **Newsreader** (body). No italics, no extra families.

- Source: unmodified variable TTFs from the Google Fonts repository,
  `https://github.com/google/fonts/tree/main/ofl/syne` and `.../ofl/newsreader`.
- Files were not subsetted or converted. WOFF2 copies from CDN endpoints are subsets, so they are not used.
- **Renamed:** the upstream names contain brackets (`Syne[wght].ttf`, `Newsreader[opsz,wght].ttf`).
  Brackets in URLs are unreliable, so the files are `Syne-Variable.ttf` and `Newsreader-Variable.ttf`.
  Only the filename changed; file contents are byte-identical to upstream.

| File | Bytes | SHA-256 |
|---|---|---|
| `public/fonts/syne/Syne-Variable.ttf` | 146980 | `ce5ac77142a65cab2248a1a2ebb740b1d4d9c20b52488877d3ff664d1356104a` |
| `public/fonts/newsreader/Newsreader-Variable.ttf` | 451664 | `8a08d13f8a6c0d51be379a60af84f945f65369a67e509ee3c3bdcc421254d7c1` |

Both are licensed under the SIL Open Font License 1.1. `OFL.txt` sits beside each font file. Neither
family declares a Reserved Font Name. Declarations are in `src/styles/fonts.css`; do not add a third
family without asking, and do not re-subset the files.

## Change the theme

All colours, type sizes, spacing and effect intensity come from `src/styles/tokens.css`. Components never
contain raw hex values.

- Dark palette: `--bg`, `--surface`, `--bone`, `--ash`, `--blood`, `--maroon`. Body text is always
  `--text` on `--bg`. `--blood` is only 4.06:1 against the background, so it is for accents, markers and
  large type, never paragraphs.
- Clean view: override block keyed on `:root[data-theme="clean"]` sets a light palette, zeroes the
  effect tokens and hides the eye. The header toggle stores `watch` or `clean` under the `theme` key
  in `localStorage` and falls back to the current page only if storage is blocked. Both views read the
  same content.
- Section edge: the `--dither-*` tokens hold the one dithered rule used at every section boundary.
  Clean view and print swap the mask for a plain 1px rule.
- Motion: `prefers-reduced-motion` sets the motion tokens to `0ms` and turns the hero grain off.

After changing a colour, re-check contrast for every pair you touched (WCAG AA: 4.5:1 for body text).

## Pages

- `/` — the home page. Every section reads from `src/data/` and `src/content/`.
- `/cv` — print-friendly CV. It shows only fields from `src/data/profile.json`, so edit that file to
  change the CV page. Printing switches to black on white and hides the site navigation.
- `404.html` — the not-found page, built from `src/pages/404.astro` and marked `noindex`.
- `public/favicon.svg` is drawn in code. Its colours mirror the palette in `tokens.css`, because an
  SVG favicon cannot read CSS custom properties.

## Add, edit or remove a project

One Markdown file per project in `src/content/projects/`; the schema is in `src/content.config.ts`.

1. Copy an existing file, for example `src/content/projects/wazuh-soc-lab.md`.
2. Fill in `title`, `summary` and `category` (`soc`, `pentest`, `cloud` or `research`). Add `year`
   only when it is confirmed.
3. `draft: true` hides the entry. Set `draft: false` only after every line has been checked.
4. Set `order` to control position (lower shows first). Files without it sort after the rest.
5. Add `repo` or `writeup` links only after setting `sanitized: true`, which also requires removing
   passwords, tokens and internal IPs.
6. Run `npm run dev` to preview and `npm run build` before finishing.

To remove a project, delete its Markdown file. To reorder projects, change `order`.

Writing entries work the same way in `src/content/writing/`, but `type` (`paper` or `writeup`) and
`status` (`manuscript`, `preprint` or `published`) are required, and `status` must match reality.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`: install with the lockfile, build on the Node version
from `.node-version`, then publish `dist/` to GitHub Pages. Nothing is served by a server; no adapter, SSR,
sessions, actions or i18n routing.

## Dependencies

- Astro is the only direct dependency. Do not add another without asking first.
- `.npmrc` sets `ignore-scripts=true`, so dependency install scripts never run automatically — locally or
  in CI. `npm run <script>` is unaffected. If a future package needs a postinstall build step, the install
  will silently skip it and the build will fail; allow that one package deliberately instead of removing
  the setting.
- Dependabot checks npm and GitHub Actions weekly with `cooldown: default-days: 14`. Cooldown applies to
  version updates only; security updates still open immediately.
- `npm audit` is expected to report 0 vulnerabilities.

## Before publishing content

Never invent facts, metrics, dates, certifications or links; leave a visible `TODO:` instead. Paper status
must match the content file. Write-ups are only shown when the file has `sanitized: true` — remove
passwords, tokens, internal IPs, phone numbers and student IDs first. Use job titles exactly as confirmed in
`src/data/profile.json`.
