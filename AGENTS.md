# Gecko EDC V2 — Agent Rules

These rules apply to every file in this project.

## Architecture

1. Use native Shopify theme architecture.
2. Keep components modular and reusable.
3. Prefer Sections, Blocks, and Snippets over large monolithic files.
4. Do not hard-code product IDs.
5. Do not hard-code collection IDs.
6. Do not hard-code content that should be editable in Shopify.
7. Use Metafields and Metaobjects for structured content.
8. Use Shopify objects instead of manually entered URLs whenever possible.

## Code

9. Keep JavaScript minimal.
10. Prefer vanilla JavaScript.
11. Avoid unnecessary dependencies.
12. Avoid duplicate CSS.
13. Avoid duplicate Liquid logic.
14. Keep files organized and understandable.
15. Comment complex logic when necessary.

## Design

16. Design mobile-first.
17. Support large desktop displays.
18. Maintain consistent spacing and typography systems.
19. Maintain accessibility.
20. Respect prefers-reduced-motion.
21. Keep animations subtle and performance-friendly.

## Performance

22. Use responsive Shopify images.
23. Lazy-load below-the-fold imagery.
24. Do not lazy-load critical hero/LCP imagery.
25. Avoid large global JavaScript bundles.
26. Avoid unnecessary third-party libraries.
27. Optimize for Core Web Vitals.

## Development Process

28. Work phase-by-phase.
29. Do not attempt to build the entire site in one task.
30. Run Shopify Theme Check after significant changes.
31. Fix Liquid errors before continuing.
32. Test mobile and desktop.
33. Explain major architectural decisions.
34. Keep Git commits focused and descriptive.
35. Do not begin the next phase until instructed.

## Scope and store protection

Phase 03D-5 adds one-time Hero entrance motion and restrained control feedback only. Preserve Hero copy, layout, slideshow architecture, autoplay logic, all settings and the approved desktop/mobile Header. See docs/hero-slideshow.md and the earlier design/header guides. Stop before subsequent work until explicitly instructed.
Keep inherited Skeleton source components unchanged outside authorized work. Do not create page-wide scroll animation, parallax, additional homepage sections, mega menu, footer, collection page, product page, cart drawer, search overlay or functional Shopify product cards in this phase.
Use Codex Cloud for coding and static validation, GitHub for source control, and local Shopify CLI for preview and theme synchronization. Do not attempt Shopify authentication, theme pushes or publication from Codex Cloud. Commit and push work to dev/gecko-v2.
Do not migrate old Gecko code, assets, layouts, CSS, or JavaScript.
Never delete or modify products, variants, collections, inventory, customers, orders, payments, shipping settings, or domain settings as part of theme development.
Use a newly created unpublished development theme; never publish, overwrite, or develop against the live theme without an explicit instruction.
Use stable Shopify features only. No Hydrogen, Next.js, React storefront, headless architecture, heavy JavaScript frameworks, or developer-preview APIs. In particular, do not adopt preview-only `block` / `partial` Liquid tags from newer Skeleton branches.
Keep credentials, Theme Access tokens, storefront passwords, local CLI state, and personal data out of Git and documentation.

## Component ownership

Sections own reusable page components and expose merchant-editable schema settings.
Blocks own editable components within sections. Snippets own reusable Liquid logic and accept explicit parameters.
JSON templates compose sections. Theme settings own global visual choices. Product metafields own product-specific technical data; metaobjects own reusable structured content when useful.
Create metafield/metaobject definitions only in a later authorized phase. Theme setup must not create or alter business records.
The shipped Skeleton code is an inherited foundation, not an approved Gecko design system.
