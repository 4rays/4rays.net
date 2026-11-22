# TODO

## Tasks

- [ ] Add analytics https://4rays.goatcounter.com/settings/main
- [ ] Migrate from Netlify to Cloudflare Pages

## Goal: finish the indigo-static migration

Mirror of Tasker project `4rays-net`. Do the items in order: each is one focused PR. Validate with `pnpm check`, `pnpm format:check`, and `pnpm build` (the CI gates). The completed Architecture Sync items are in Git history.

- [ ] Complete the SEO head and add robots.txt (Tasker #516) (Goal 00f314685a5c)
      Criterion C2. Re-verified against 50fbc5f (post-redesign).
      Gap: src/layouts/Base.astro has canonical, Open Graph and Twitter tags, but no sitemap link, no generator meta, and no twitter:image even when previewImage is passed. @astrojs/sitemap builds sitemap-index.xml, but public/robots.txt does not exist.
      Scope: in Base.astro add `<link rel="sitemap" href="/sitemap-index.xml" />`, `<meta name="generator" content={Astro.generator} />`, and a twitter:image meta that mirrors the existing conditional og:image (same previewImageURL, same attribute style as the other twitter tags). Add public/robots.txt: `User-agent: *`, `Allow: /`, `Sitemap: https://4rays.net/sitemap-index.xml`. Do not change the title format, copy, or the commented-out icon block.
      Acceptance: dist/index.html contains the sitemap link and the generator meta; a page rendered with previewImage gets both og:image and twitter:image. dist/robots.txt exists with the 4rays.net sitemap URL. pnpm check, pnpm format:check and pnpm build pass.
- [ ] Move theming to semantic tokens with class-based dark mode (Tasker #517) (Goal 00f314685a5c)
      Criterion C1. Rewritten for the PR #13 redesign; the old item's color values are stale.
      Gap: colors are global variables in the `<style is:global>` block of src/layouts/Base.astro (--accent as an RGB triplet, --accent-ink, --on-accent-color, --background-color, --card-color, --hairline, --text-primary-color, --text-secondary-color, --logo-color, and the --lattice-* canvas inputs). :root holds the dark values and @media (prefers-color-scheme: light) overrides them, so Tailwind's dark: variant cannot follow a site-controlled theme. src/layouts/Legal.astro redefines --background-color with its own prefers-color-scheme block. src/components/LatticeBackground.astro reads the variables with getComputedStyle and re-reads them on a prefers-color-scheme matchMedia change.
      Scope:
  - In src/styles.css define semantic tokens with the exact current values, light on :root and dark on .dark. Light: --background #fbfaf8, --foreground #1d2027, --card #fff, --muted-foreground rgb(29 32 39 / 0.68), --border rgb(35 38 45 / 0.12), --accent-ink rgb(184 66 16), --logo #e6440e. Dark: --background #13151a, --foreground #f2f5f8, --card #1d2027, --muted-foreground rgb(242 245 248 / 0.66), --border rgb(255 255 255 / 0.1), --accent-ink rgb(244 128 76), --logo aliceblue. Both: --accent rgb(237 103 44), --accent-foreground #13151a. Set color-scheme: light on :root and dark on .dark. Keep the --lattice-* values per scheme as site-specific tokens in the same blocks, in the triplet/alpha format the canvas parses.
  - Expose the color tokens through @theme inline as --color-*, add `@variant dark (&:where(.dark, .dark *));`, and move the html/body/::selection/:focus-visible/scrollbar color rules into @layer base using the tokens. Fonts (@font-face, --font-display, --font-body) and the main layout rule may stay in Base.astro.
  - Add src/components/SetTheme.astro: an is:inline script rendered first in `<head>` of Base.astro that adds or removes .dark on `<html>` from a valid localStorage.theme (light, dark, system) or else the system scheme, and follows live system-scheme changes when no theme is stored. Add `<meta name="color-scheme" content="light dark">`.
  - Update src/pages/[...lang]/index.astro, CircleLink.astro, CompanyLogo.astro and Footer.astro to the new tokens. rgb(var(--accent)) becomes var(--accent); rgb(var(--accent) / X) becomes color-mix(in oklab, var(--accent) X, transparent).
  - LatticeBackground.astro: it must still get a parseable accent triplet (give it a lattice-specific triplet token or parse the new color) and must re-read colors when the .dark class on `<html>` changes (MutationObserver on the class attribute) instead of on the matchMedia change.
  - Remove the old variables, the prefers-color-scheme color block in Base.astro, and Legal.astro's local style override (no page uses Legal.astro). Keep the copy, fonts, layout, animations and shadows unchanged. A theme picker is out of scope (owner-deferred).
  - Acceptance: `rg -- '--(background-color|card-color|text-primary-color|text-secondary-color|logo-color|on-accent-color|hairline)' src` is empty; `rg prefers-color-scheme src` matches only SetTheme.astro. In a browser, / looks the same as on the base branch in light and dark system schemes (lattice colors included), with no flash of the wrong theme on load, and switching the OS scheme updates page and lattice live. pnpm check, pnpm format:check and pnpm build pass.
- [ ] Replace CLAUDE.md with an accurate AGENTS.md (Tasker #518) (Goal 00f314685a5c)
      Criterion C3. Do this after the SEO and theming tasks, so it describes the finished state.
      Gap: CLAUDE.md still describes Astro 5, astro-i18next, ja as a supported locale, public/locales/, astro-i18next.config.mts and tailwind.config.cjs, none of which exist. It lists pnpm astro check instead of pnpm check, places theme variables in Base.astro, and does not say which commands CI runs (.github/workflows/test.yml: format:check, check, build).
      Scope: git mv CLAUDE.md AGENTS.md and rewrite it for the current site:
  - Overview: single-page static Four Rays site, Astro 7, output: "static", no adapter.
  - Commands from package.json, with the CI-run ones marked (CI).
  - Architecture: src/pages/[...lang]/index.astro; components (CircleLink, CompanyLogo, Footer, LatticeBackground); src/data/projects.ts for the project circles; i18n via src/i18n/ + src/translations/en.json + localizeUrl() (only en is declared until Japanese copy exists); theming via semantic tokens in src/styles.css with SetTheme.astro required first in Base.astro's head; Unbounded display font self-hosted from public/fonts; SEO in Base.astro + @astrojs/sitemap + public/robots.txt.
  - Conventions: pnpm only, Node >= 22.19.0 (engines.node and .nvmrc), the @/\* alias, the Prettier settings from .prettierrc.json, sentence-case imperative commit subjects with no prefix or trailing period.
  - Leave a CLAUDE.md that contains only @AGENTS.md.
  - Acceptance: every path and command named in AGENTS.md exists or runs; CLAUDE.md contains only the import line; pnpm format:check passes.

### Deferred (needs owner input, not ready)

- Japanese locale: add `ja` to `locales` with `src/translations/ja.json`, the root-path client-side language redirect (`src/scripts/language-detection.js` with a `preferred_lang` cookie), and a language picker. Blocked on Japanese copy from the owner.
- Theme picker UI (`ThemeSelect.astro`, `src/lib/theme.ts`): the home page has no header, so where the picker goes is a design decision.
- Self-hosted webfont via the Astro fonts API: the site uses the system font stack, so adding a webfont would change its visual identity.
