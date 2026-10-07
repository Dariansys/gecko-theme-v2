# Gecko EDC V2 — Phase 01 report

Status: Local infrastructure complete; Shopify integration pending; main repository is Dariansys/gecko-theme-v2.

## Environment

- Shopify CLI: 4.8.5, pinned as a development dependency. Node.js: 24.19.0; npm: 11.9.0; Git: 2.51.1.
- Website: geckoedc.net.
- Store: yh5bqf-un.myshopify.com, identified from public Shopify storefront metadata. Store access is not authenticated.
- Development theme requested: Gecko EDC V2 Development. Not created; no theme ID.
- Preview: not started successfully. The CLI reached Shopify's login prompt; no authenticated store connection or theme upload occurred.
- Initial global CLI installation encountered a runtime filesystem permission error. Project-local installation succeeded; use npm scripts or node_modules/.bin/shopify.

## Architecture and provenance

Native Liquid, JSON templates, Sections, Blocks, Snippets, theme settings, CSS, and minimal vanilla JavaScript. Metafields/metaobjects are reserved for later authorized work; no definitions or business data were modified.

Shopify's October 1, 2026 Skeleton main revision uses preview-only block/partial syntax and omits Sections/JSON templates. To meet the stable-architecture requirement, Shopify CLI initialized this project from the last conventional upstream revision: a4f32d393b9eadf6c4403318ca39116832e5d1df (February 26, 2026). A local branch of the fetched official repository was used because CLI init accepts a branch/tag rather than a commit SHA. All eight theme directories are byte-identical to that revision. No visual design was created or migrated.

Inherited Skeleton header/footer, welcome section, and catalog/cart templates are base scaffolding, not final Gecko components. The baseline has no authored JavaScript files or section JavaScript; Shopify-supplied runtime behavior must be checked in an authenticated preview.

## Git

- Repository: https://github.com/Dariansys/gecko-theme-v2.git; configured as origin.
- Branch: dev/gecko-v2.
- Initial commit: chore: initialize Gecko EDC V2 Shopify theme.
- main and dev/gecko-v2 contain the initialized foundation.
- Exact commit hash is returned in the delivery report; use git log -1 to inspect.
- GitHub write access was confirmed on October 6, 2026. The initially empty repository was initialized through the connected GitHub integration because command-line Git had no credentials. No existing remote history was overwritten.

## Structure

```text
gecko-theme-v2/
  assets/
  blocks/
  config/
  layout/
  locales/
  sections/
  snippets/
  templates/
  docs/
  .github/workflows/ci.yml
  AGENTS.md
  README.md
  .theme-check.yml
  .gitignore
  .shopifyignore
  package.json
  package-lock.json
```

## Theme Check and verification

- Final Theme Check: 0 errors, 0 warnings. Recommended configuration; no checks disabled. Machine-readable diagnostics: docs/theme-check.json.
- All theme source files match the selected official Skeleton revision.
- Dependency installation succeeded and npm scripts use the pinned CLI.
- Liquid rendering, CSS loading, Shopify JavaScript loading, Theme Editor, mobile/desktop previews, and browser console verification remain unverified because authentication is required. Static checks are not runtime proof.
- Business data, current theme, domain settings, and shipping/payment configuration were untouched.

## Files created or modified

All project files are new. docs/files-created.txt lists every tracked source/document/configuration file. Of the inherited upstream files, README.md, .gitignore, .shopifyignore, .theme-check.yml and .github/workflows/ci.yml were customized. The upstream Shopify-only CLA workflow was removed. AGENTS.md, package.json, package-lock.json and docs/ were added. No files in the eight Shopify theme directories were modified.

## Attention and recommendation

Complete Shopify CLI sign-in, confirm access to the identified store, create the new unpublished named theme with npm run dev:create, and start npm run dev -- --theme NEW_THEME_ID. Verify the returned preview and editor URLs on mobile and desktop, inspect CSS requests and console errors, and record the theme ID. Use the configured main repository for subsequent focused commits.

Phase 02 readiness: local foundation ready; Phase 01 acceptance is incomplete until authenticated store preview verification is completed. Do not begin Phase 02 yet.
