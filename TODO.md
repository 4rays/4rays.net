# TODO

## Tasks

- [ ] Add analytics https://4rays.goatcounter.com/settings/main
- [ ] Migrate from Netlify to Cloudflare Pages

## Architecture Sync

Ordered queue: each item is one focused PR, and earlier items are prerequisites for later ones. Validate every item with `pnpm astro check`, `pnpm exec prettier --check .`, and `pnpm build` unless noted. Copy, the bilingual en/ja intent, and the visual identity must not change unless an item says so.

- [x] **Add Prettier config and format scripts**
  - Gap: `prettier`, `prettier-plugin-astro`, and `prettier-plugin-tailwindcss` are installed, but there is no Prettier config. Prettier 3 does not load plugins unless a config lists them, so `.astro` files are never formatted, and the existing code mixes styles (`{ changeLanguage }` vs `{SITE_TITLE, SITE_DESCRIPTION}`). `CLAUDE.md` wrongly says Prettier is configured.
  - Scope: add `.prettierrc.json` (`tabWidth: 2`, `useTabs: false`, `plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"]`, `bracketSpacing: false`, `trailingComma: "none"`). Add `.prettierignore` (`dist/`, `.astro/`, `node_modules/`, `pnpm-lock.yaml`). Add the `package.json` scripts `format` (`prettier --write .`), `format:check` (`prettier --check .`), and `check` (`astro check --minimumSeverity warning`). Run `pnpm format` once and commit the formatting-only diff.
  - Acceptance: `pnpm format:check` and `pnpm check` pass. The built `dist/index.html` text content does not change.
- [x] **Switch to the `@/` import alias and the current Astro tsconfig shape**
  - Gap: `tsconfig.json` defines four separate aliases (`@components/*`, `@layouts/*`, `@consts`, `@pages/*`) on top of `baseUrl`, which TypeScript 6 deprecates. It also has no `include`/`exclude`, and `src/env.d.ts` does not reference `.astro/types.d.ts`.
  - Scope: replace the paths with a single `"@/*": ["./src/*"]`. Remove `baseUrl` and `jsx`. Add `"include": [".astro/types.d.ts", "**/*"]`, `"exclude": ["dist"]`, `allowJs`, `strict`, `skipLibCheck`, and `noFallthroughCasesInSwitch`. Add `/// <reference path="../.astro/types.d.ts" />` to `src/env.d.ts`. Rewrite the alias imports in `src/pages/index.astro` and `src/layouts/Base.astro` to `@/components/…`, `@/layouts/…`, and `@/consts`. `src/layouts/Legal.astro` uses a relative `./Base.astro` import and needs no change.
  - Acceptance: no `@components`, `@layouts`, `@consts`, or `@pages` imports remain (`rg "@(components|layouts|consts|pages)\b" src` is empty). Check and build pass.
- [x] **Load Tailwind CSS 4 from `src/styles.css` and drop `tailwind.config.cjs`**
  - Gap: Tailwind 4 and `@tailwindcss/vite` are installed, but no stylesheet imports Tailwind. The CommonJS `tailwind.config.cjs` is ignored by v4, so the `prose dark:prose-invert` classes in `src/layouts/Legal.astro` produce no CSS.
  - Scope: create `src/styles.css` with `@import "tailwindcss";` and `@plugin "@tailwindcss/typography";`. Import it from the frontmatter of `src/layouts/Base.astro` (`import "@/styles.css";`). Delete `tailwind.config.cjs`. Leave the existing CSS variables and component styles in place; tokens come in a later item. If Tailwind's preflight reset visibly changes the home page (for example the default `h1`/`p`/`body` margins), restore the previous look with explicit rules in the affected component styles.
  - Acceptance: `tailwind.config.cjs` is gone. The built CSS contains Tailwind's preflight and `.prose` rules. `pnpm preview` renders `/` the same as before in light and dark OS schemes (compare manually side by side).
- [x] **Replace `astro-i18next` with type-safe JSON translations and a `[...lang]` route**
  - Gap: i18n runs on `astro-i18next@1.0.0-beta.21`, an unmaintained beta that pulls in `i18next@22` alongside the direct `i18next@25`. In practice it does nothing: `public/locales/` does not exist, `index.astro` only calls `changeLanguage("en")`, `src/env.d.ts` stubs the module with `declare module "i18next"`, the copy is hard-coded, and `<html lang="en">` is fixed. It also blocks the Astro upgrade below.
  - Scope:
    - Remove `astro-i18next`, `i18next`, and `i18next-fs-backend` from `package.json`. Delete `astro-i18next.config.mts`, the integration in `astro.config.mjs`, the `changeLanguage` call, and the `declare module` stub.
    - Add `src/i18n/constants.ts`: a `locales` const tuple, the `Locale` type, `defaultLocale = "en"`, a `Translations` type inferred from `en.json`, the `translations` map, and `localeNames`.
    - Add `src/i18n/utils.ts`: `getLocaleFromParams`, `useTranslations`, `localizeUrl` (default locale unprefixed, others under `/<locale>/`), and `getLocaleStaticPaths`.
    - Move every user-facing English string, verbatim, into `src/translations/en.json`: page title, intro, both cards, and the footer line. Also move the site title and description from `src/consts.ts`; keep the non-translatable constants (URL, email, author) there.
    - Keep markup out of the JSON. Split the intro into three plain-text keys around the emphasized phrase (`lead`: "We build cutting-edge, AI-native, human-friendly ", `emphasis`: "digital products", `trail`: "."), and keep the `<em>` element in `index.astro`.
    - Move `src/pages/index.astro` to `src/pages/[...lang]/index.astro` with `getStaticPaths() { return getLocaleStaticPaths(); }`.
    - Give `Base.astro` a required `locale: Locale` prop that drives `<html lang={locale}>` and the default title/description. `Footer.astro` also takes `locale`; keep the copyright year computed at build time and only the surrounding text in `en.json`. `Legal.astro` renders `Base` without a locale today, so give it an optional `locale` prop defaulting to `defaultLocale` and pass it through, or `pnpm check` fails.
    - Declare only `en` in `locales` for now. No Japanese copy exists, so declaring `ja` would publish English text at `/ja/`. Adding `ja` later should only take a `ja.json` and a one-entry change to `locales` (see Deferred).
  - Acceptance: `rg "i18next" --glob '!pnpm-lock.yaml'` returns nothing outside docs. The lockfile no longer contains `astro-i18next` or `i18next`. Build output is a single `dist/index.html` whose visible text matches the current page exactly. A missing translation key fails `pnpm check`.
- [ ] **Upgrade to Astro 7 with Node and pnpm pins**
  - Gap: the site is on Astro 5.15, `@astrojs/mdx` 4, TypeScript 5, `prettier-plugin-astro` 0.14, and `prettier-plugin-tailwindcss` 0.7, with no Node or pnpm version pinned. `@astrojs/rss` is installed but no feed exists, and `@astrojs/check` sits in `dependencies`. Depends on the i18next removal above, so the upgrade does not have to carry the unmaintained integration.
  - Scope (one toolchain change, kept whole): bump `astro` to `^7.3.7`, `@astrojs/mdx` to `^8.0.3`, `@astrojs/sitemap` to `^3.7.4`, `tailwindcss`/`@tailwindcss/vite` to `^4.3.3`, `@tailwindcss/typography` to `^0.5.20`, `typescript` to `^6.0.3`, `prettier` to `^3.9.9`, `prettier-plugin-astro` to `^1.1.0`, and `prettier-plugin-tailwindcss` to `^0.8.1`. Move `@astrojs/check` (`^0.9.10`) to `devDependencies`. Remove the unused `@astrojs/rss`. Add `"engines": {"node": ">=22.13.0"}`, `"packageManager": "pnpm@11.22.0"`, `.nvmrc` (`22.13.0`), and a `pnpm-workspace.yaml` (`packages: ["."]`, `allowBuilds: {esbuild: true, sharp: true}`) so pnpm 11 runs the required build scripts. Add `// @ts-check` and `output: "static"` to `astro.config.mjs`. Change `preview` to `astro build && astro preview`. Regenerate `pnpm-lock.yaml` and re-run `pnpm format` if the new plugin versions change formatting.
  - Acceptance: `pnpm install --frozen-lockfile` succeeds on Node 22.13+ with pnpm 11. Check, `format:check`, and build pass with no new warnings. `dist/` still contains `index.html` and `sitemap-index.xml`.
- [ ] **Add a Check & Build GitHub Actions workflow**
  - Gap: no CI exists, so formatting, type errors, and build failures are only caught locally. Depends on the format scripts and the `packageManager` pin above.
  - Scope: add `.github/workflows/test.yml`, named `Test` with job `Check & Build`, triggered on pull requests to and pushes to `main`. Steps: `actions/checkout@v7`, `pnpm/action-setup@v6` (reads `packageManager`), `actions/setup-node@v7` with `node-version: "24"` and `cache: "pnpm"`, then `pnpm install --frozen-lockfile`. Run `pnpm format:check`, `pnpm check`, and `pnpm build` as separate steps, each with `if: ${{ !cancelled() }}` so one run reports every failure.
  - Acceptance: the workflow passes on its own PR. Validate the YAML locally by running the three commands in order.
- [ ] **Move theming to semantic tokens with class-based dark mode**
  - Gap: colors are ad-hoc global variables in a `<style is:global>` block in `Base.astro` (`--accent` as an RGB triplet, `--background-color`, `--card-color`, `--text-primary-color`, `--logo-color`), switched by `prefers-color-scheme`. `Legal.astro` redefines `--background-color`, and Tailwind's `dark:` variant cannot follow a site-controlled theme. Depends on `src/styles.css` existing.
  - Scope:
    - In `src/styles.css`, define semantic tokens on `:root` (light) and `.dark` (dark) using today's exact brand values, and only the tokens the site uses: `--background`, `--foreground`, `--card`, `--card-foreground` (same value as `--foreground`), `--accent`, plus a site-specific `--logo`. Light: background `#fff`, foreground `#23262d`, card `aliceblue`, logo `#e6440e`. Dark: background `#13151a`, foreground `#fff`, card `#23262d`, logo `aliceblue`. Accent `rgb(237 103 44)` in both. The footer's `opacity: 0.8` and the card's inset `box-shadow` stay as they are.
    - Expose the tokens through `@theme inline` as `--color-*`. Add `@variant dark (&:where(.dark, .dark *));` and a `@layer base` rule `body { @apply bg-background text-foreground; }`.
    - Add `src/components/SetTheme.astro`: an inline script, rendered first in `<head>`, that toggles `.dark` on `<html>` from a valid `localStorage.theme` or else the system scheme, and follows live system-scheme changes. Add `<meta name="color-scheme" content="light dark">`.
    - Rewrite `index.astro`, `Card.astro`, `Footer.astro`, `CompanyLogo.astro`, and `Legal.astro` to use the tokens. `rgba(var(--accent), 25%)` becomes `color-mix(in oklab, var(--accent) 25%, transparent)` and `rgba(var(--accent))` becomes `var(--accent)`. Delete the old variables, the `prefers-color-scheme` blocks, and `Legal.astro`'s local override; no page uses `Legal.astro` today. Keep the `body { margin: 8px; }` and `main` layout rules that `Base.astro`'s global style block gained in the Tailwind item; they restore the pre-preflight look and are not theme variables.
    - A visible theme picker is out of scope (see Deferred).
  - Acceptance: `rg -- "--(background-color|card-color|text-primary-color|logo-color)" src` and `rg "prefers-color-scheme" src --glob '*.astro' --glob '!SetTheme.astro'` are empty. `/` looks the same as before in both OS schemes, with no flash of the wrong theme on load. Switching the OS scheme updates the page live.
- [ ] **Complete the SEO head and add `robots.txt`**
  - Gap: `Base.astro` sets canonical, Open Graph, and Twitter tags, but has no sitemap link, no `generator` meta, and no `twitter:image` even when `previewImage` is passed. The sitemap integration builds `sitemap-index.xml`, but there is no `public/robots.txt` pointing crawlers to it.
  - Scope: in `Base.astro`, add `<link rel="sitemap" href="/sitemap-index.xml" />`, `<meta name="generator" content={Astro.generator} />`, and a `twitter:image` meta that mirrors the existing conditional `og:image`. Add `public/robots.txt` (`User-agent: *`, `Allow: /`, `Sitemap: https://4rays.net/sitemap-index.xml`). Leave the title format, copy, and the commented-out icon block unchanged.
  - Acceptance: `dist/index.html` contains the sitemap link and generator meta. `dist/robots.txt` exists with the 4rays.net sitemap URL. Check, format, and build pass.
- [ ] **Replace `CLAUDE.md` with an accurate `AGENTS.md`**
  - Gap: `CLAUDE.md` describes astro-i18next, `public/locales/`, `tailwind.config.cjs`, and theme variables in `Base.astro`, all of which the items above remove. It also does not say which commands CI runs.
  - Scope: rename `CLAUDE.md` to `AGENTS.md` (`git mv`) and rewrite it for the post-migration site:
    - Project overview: static Four Rays site, `output: "static"`.
    - Development Commands, with the CI-run ones marked `(CI)`.
    - Architecture: static-only with no adapter, i18n via `src/i18n/` + `src/translations/` + `[...lang]` routes and `localizeUrl()` for internal links, theming via semantic tokens in `src/styles.css` with `SetTheme.astro` required in `Base.astro`, and SEO in `Base.astro` + sitemap.
    - Conventions: pnpm only, Node >= 22.13.0, the `@/*` alias, the Prettier settings, and the sentence-case imperative commit style with no prefix.
    - Keep a one-line `CLAUDE.md` containing `@AGENTS.md` so Claude Code still loads it.
  - Acceptance: every path and command named in `AGENTS.md` exists or runs. `pnpm format:check` passes.

### Deferred (needs owner input, not ready)

- Japanese locale: add `ja` to `locales` with `src/translations/ja.json`, the root-path client-side language redirect (`src/scripts/language-detection.js` with a `preferred_lang` cookie), and a language picker. Blocked on Japanese copy from the owner.
- Theme picker UI (`ThemeSelect.astro`, `src/lib/theme.ts`): the home page has no header, so where the picker goes is a design decision.
- Self-hosted webfont via the Astro fonts API: the site uses the system font stack, so adding a webfont would change its visual identity.
