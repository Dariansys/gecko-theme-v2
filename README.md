# Gecko EDC V2

Official Shopify storefront rebuild for Gecko EDC.

- Website: geckoedc.net
- Architecture: Native Shopify Theme
- Base: Shopify Skeleton Theme
- Development: Shopify CLI
- Frontend: Liquid + CSS + Vanilla JavaScript
- Status: Under Development — Phase 03D-5 Hero entrance motion
- Shopify store: yh5bqf-un.myshopify.com (local Shopify CLI development confirmed by the developer)

## Foundation and prerequisites

Node.js 22.12+ and Git are required. Shopify CLI is a development-only dependency pinned to 4.8.5. No frontend framework, bundler, or storefront dependency is installed.

This project was initialized with Shopify CLI from Shopify/skeleton-theme revision `a4f32d393b9eadf6c4403318ca39116832e5d1df` (February 26, 2026), the last conventional Sections/JSON-template revision before the October 1 developer-preview rewrite. The upstream source was fetched directly from Shopify; no old Gecko theme code was used. Preserve the included MIT license.

```bash
npm ci
npm run check
```

## Connect and start development

Shopify authentication, preview and theme synchronization are handled locally on
the developer's computer. Do not run Shopify authentication or theme pushes from
Codex Cloud; Cloud is for coding, Theme Check and GitHub source control.

Log in with the Shopify account that has theme access to this store. The CLI prompts for authentication; never put credentials or tokens in Git.

```bash
npm run themes
```

Create a **new unpublished** theme once (do not target an existing or live theme):

```bash
npm run dev:create
```

Record the returned theme ID locally. Run hot-reloading development against that new theme:

```bash
npm run dev -- --theme NEW_THEME_ID
```

`NEW_THEME_ID` is a placeholder: replace it with the ID returned by the creation command. Do not use `--allow-live`. The named theme is persistent and unpublished; Shopify's temporary development theme can instead be created by `npm run dev` without `--theme`, but its generated name and lifetime differ.

## Preview and verification

`theme dev` prints the local preview (normally http://127.0.0.1:9292), Shopify preview URL, and Theme Editor URL. Keep the process running and use the returned URLs. For the persistent named theme:

```bash
npm run preview -- --theme NEW_THEME_ID
npm run editor -- --theme NEW_THEME_ID
```

Verify existing routes on mobile and desktop, CSS requests, inherited section JavaScript, browser console errors, and Theme Editor settings locally. Theme Check is static analysis and does not prove server-side rendering or runtime functionality. Keep the local development theme ID in ignored local state, not in this document.

## Theme Check

```bash
npm run check
npm run check:json
```

`.theme-check.yml` extends Shopify's recommended configuration without disabled checks. Fix Liquid errors before continuing; document inherited warnings in `docs/phase-01-report.md`.

## Phase 02 design foundation

The Gecko CSS foundation is documented in [docs/design-system.md](docs/design-system.md).
It supplies tokens, light/dark surfaces, fluid typography, containers and opt-in
visual primitives. The inherited storefront sections are still scaffolding.
No homepage, header, footer, catalog page, cart or search has been built.
Stop after Phase 02; later phases require explicit instructions.

## Phase 03A brand assets

[docs/brand-assets.md](docs/brand-assets.md) describes image ownership and the
dual-logo Header settings. Brand mark and wordmark are independent Theme Editor
uploads, with responsive size caps and a shop-name/text fallback. Only the brand
area is implemented; no full header, navigation or mobile-menu design is added.
Upload/replacement verification runs in the local unpublished Shopify preview.
Stop after Phase 03A until further work is explicitly authorized.

## Phase 03B desktop header

[docs/header.md](docs/header.md) covers the sticky header, merchant-selected
desktop navigation and direct Shopify Search/Account/Bag links. Configure the
Main menu and action/sticky toggles in Header settings. Desktop navigation appears
from 1024px; smaller screens keep the brand and Bag without a mobile menu.
Review real storefront routes and Theme Editor behavior locally. Stop after
Phase 03B until the next scope is explicitly authorized.

## Phase 03C mobile navigation

[docs/mobile-header.md](docs/mobile-header.md) covers the mobile drawer, nested
submenus, keyboard focus and scroll locking. Below 1024px the Header shows the
existing brand, Bag and Menu trigger. Search/Account are inside the drawer;
desktop behavior resumes at 1024px. No new settings or dependencies are added.
Validate native dialog and Theme Editor behavior in the local unpublished
Shopify preview. Stop after Phase 03C until further work is explicitly authorized.

## Phase 03D-5 Hero entrance motion

[docs/hero-slideshow.md](docs/hero-slideshow.md) describes the editable gradient
headline and campaign slideshow. Add 2–5 image blocks in the local Theme Editor;
adjust mobile photography, focal points, captions and autoplay as needed. Existing
Hero settings and the Header are preserved. The Hero now enters once with a
restrained stagger and media fade/scale; editor and reduced-motion modes stay
immediately visible. No page-wide scroll effects or additional
homepage sections are included. Stop after this Hero task until further work is
explicitly authorized. The earlier static design is recorded in
[docs/static-hero.md](docs/static-hero.md).

## Folder structure

```text
gecko-theme-v2/
  assets/       CSS, icons, images, optional vanilla JavaScript
  blocks/       Reusable merchant-editable theme blocks
  config/       Theme schema and saved theme settings
  layout/       Liquid document shells
  locales/      Storefront and editor translations
  sections/     Reusable sections and header/footer groups
  snippets/     Shared Liquid components and utilities
  templates/    JSON page composition and gift-card Liquid template
  docs/         Setup provenance, checks, and Phase 01 report
  AGENTS.md
  README.md
  .theme-check.yml
  .gitignore
  .shopifyignore
  package.json
  package-lock.json
```

## Git workflow

Work on `dev/gecko-v2`. The main repository is https://github.com/Dariansys/gecko-theme-v2.git and is configured as `origin`. Preserve remote history and never force-push.

```bash
 git status
 npm run check
 git add <changed-files>
 git commit -m "chore: describe the focused change"
```

Commit small, focused changes. Keep dependency lockfiles committed. Keep `.shopify/`, `.env` files, tokens, generated archives, and node_modules ignored. Phase 02 needs a separate explicit instruction.

## Adding sections (later phases)

Create `sections/component-name.liquid` with accessible markup, schema settings, appropriate blocks and a preset if it should be addable in the editor. Compose sections through JSON templates or section groups. Use Shopify objects for product/collection selection and routes. Use locale keys for interface copy and editable settings for merchant content. Run Theme Check and verify in the editor.

## Adding snippets (later phases)

Create `snippets/component-name.liquid` and call it with `{% render 'component-name', product: product %}`. Pass required objects explicitly, document complex parameters with LiquidDoc, and reuse shared logic instead of duplicating it. Snippets are not independently editable sections.

## Managing assets (later phases)

Keep CSS, images, SVG, and minimal vanilla JavaScript in `assets/`. Reference them with Shopify `asset_url` and appropriate stylesheet/script tags. Scope component CSS and load JavaScript only where required; use `defer` for external scripts. Use Shopify image objects and responsive `image_url` / `image_tag` output for catalog images. Respect reduced motion and do not lazy-load LCP imagery. Do not import old Gecko CSS or JS.
