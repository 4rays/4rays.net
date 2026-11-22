# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

4rays.net is the Four Rays marketing site: a single static page built with
Astro 7 and Tailwind CSS v4. The build is fully static (`output: "static"` in
[astro.config.mjs](astro.config.mjs)); there is no server adapter. The site is
in English only until Japanese copy exists.

## Package Manager

This project uses **pnpm**. Do not use npm or yarn. Node must be >= 22.19.0
(`engines.node` in [package.json](package.json), mirrored in [.nvmrc](.nvmrc)).

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at localhost:4321
pnpm build            # Build the production site to ./dist/ (CI)
pnpm preview          # Build and preview the production site locally
pnpm check            # Type check with astro check (CI)
pnpm format           # Format the repository with Prettier
pnpm format:check     # Verify formatting with Prettier (CI)
```

CI ([.github/workflows/test.yml](.github/workflows/test.yml)) runs
`pnpm format:check`, `pnpm check`, and `pnpm build` on every pull request and
push to `main`. The site has no automated test suite; validate changes with the
three CI commands.

## Architecture

- [src/pages/[...lang]/index.astro](src/pages/[...lang]/index.astro) — the only
  page. A single rest route resolves the locale, so the default locale renders
  at `/` and any future locale renders under its prefix.
- [src/components/](src/components/) — UI components:
  - `CircleLink.astro` — a project circle on the home page.
  - `CompanyLogo.astro` — the animated Four Rays logo.
  - `Footer.astro` — page footer.
  - `LatticeBackground.astro` — canvas lattice background; reads its colors
    from CSS tokens and re-reads them when the `dark` class changes.
  - `SetTheme.astro` — inline script that sets or removes the `dark` class on
    `<html>` before first paint. Must stay first in `Base.astro`'s `<head>`.
- [src/data/projects.ts](src/data/projects.ts) — the project circles shown on
  the home page.
- [src/consts.ts](src/consts.ts) — site-wide constants (URL, author, contact).
- [src/layouts/Base.astro](src/layouts/Base.astro) — the only layout. Owns the
  SEO head: title, description, canonical URL, Open Graph and Twitter tags
  (with `og:image`/`twitter:image` when `previewImage` is passed), sitemap
  link, generator meta, and the self-hosted Unbounded `@font-face`.

### Internationalization

i18n is hand-rolled in [src/i18n/](src/i18n/) with translations in
[src/translations/en.json](src/translations/en.json):

- `src/i18n/constants.ts` declares the locales (only `en` today) and loads the
  translation JSON.
- `src/i18n/utils.ts` provides `useTranslations()`, `getLocaleFromParams()`,
  `getLocaleStaticPaths()`, and `localizeUrl()` (the default locale lives at
  the root; other locales get a `/xx/` prefix).

Add Japanese by adding `ja` to `locales` plus a `src/translations/ja.json`;
do not add locale machinery until the owner supplies the copy.

### Theming

- Semantic color tokens live in [src/styles.css](src/styles.css): light values
  on `:root`, dark values on `.dark`, exposed to Tailwind through
  `@theme inline`. Use the tokens (`var(--background)`, `bg-card`, etc.);
  never hardcode colors in components.
- Dark mode is class-based (`@variant dark`), decided before first paint by
  `SetTheme.astro` from a valid `localStorage.theme` (`light`, `dark`,
  `system`) or else the system scheme. There is no theme picker UI.

### Fonts

The Unbounded display font is self-hosted from
[public/fonts/](public/fonts/) and declared in `Base.astro`; body text uses
the system font stack.

### SEO

`Base.astro` renders the full head; [@astrojs/sitemap](package.json) builds
`sitemap-index.xml` at build time, and [public/robots.txt](public/robots.txt)
names it.

## Conventions

- Keep the site a single page. No blog, content collections, or new routes.
- Import aliases: `@/*` maps to `src/*` ([tsconfig.json](tsconfig.json)).
- Formatting is Prettier with `prettier-plugin-astro` and
  `prettier-plugin-tailwindcss` ([.prettierrc.json](.prettierrc.json)):
  2-space indent, no bracket spacing, no trailing commas.
- Commit subjects are sentence-case and imperative, with no Conventional
  Commit prefix and no trailing period (for example: `Add robots.txt`).
- Agents never merge pull requests.
