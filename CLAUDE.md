# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a company website for Four Rays built with Astro 5, using Tailwind CSS v4 and internationalization support via astro-i18next.

## Package Manager

This project uses **pnpm**. Do not use npm or yarn.

## Common Commands

```bash
# Development
pnpm dev              # Start dev server at localhost:4321

# Build & Preview
pnpm build            # Build production site to ./dist/
pnpm preview          # Preview production build locally

# Type checking
pnpm astro check      # Run Astro's built-in type checker

# Astro CLI
pnpm astro [command]  # Run any Astro CLI command
```

## Architecture

### Tech Stack

- **Astro 5**: Static site generator with islands architecture
- **Tailwind CSS v4**: Utility-first CSS framework (via Vite plugin)
- **astro-i18next**: Internationalization support for English (en) and Japanese (ja)
- **TypeScript**: Type-safe development

### Key Configuration

- **Site URL**: https://4rays.net
- **Default Locale**: English (en)
- **Supported Locales**: en, ja
- **Integrations**: MDX, Sitemap, astro-i18next

### Directory Structure

- `src/pages/` - Page routes (currently minimal)
- `src/layouts/` - Reusable layout components (Base, Legal)
- `src/components/` - UI components (Card, CompanyLogo, Footer)
- `src/consts.ts` - Site-wide constants (title, description, author info)
- `public/locales/` - i18n translation files
- `astro.config.mjs` - Astro configuration
- `astro-i18next.config.mts` - i18n configuration
- `tailwind.config.cjs` - Tailwind CSS configuration

### Styling

- Tailwind CSS v4 is integrated via Vite plugin (not PostCSS)
- CSS variables for theming defined in [Base.astro](src/layouts/Base.astro)
- Supports light/dark mode via `prefers-color-scheme`
- Uses `@tailwindcss/typography` plugin for content styling

### Meta & SEO

The [Base.astro](src/layouts/Base.astro) layout handles:
- Open Graph tags
- Twitter cards
- Canonical URLs
- Meta descriptions

Site constants in [src/consts.ts](src/consts.ts) should be used for site-wide metadata.

## Code Formatting

Prettier is configured with:
- `prettier-plugin-astro` for Astro files
- `prettier-plugin-tailwindcss` for class sorting
