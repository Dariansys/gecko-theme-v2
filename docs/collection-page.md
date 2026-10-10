# Phase 05B — Gecko collection / Store page

`sections/collection.liquid` replaces the inherited plain product list with a
Gecko collection header, shared product-card grid and native pagination.
`assets/gecko-collection.css` owns page composition; the existing
`assets/gecko-featured-products.css` supplies the approved card presentation.
`templates/collection.json` saves the initial settings. No JavaScript, dependencies,
filters, sort controls, quick add, cart drawer or search UI are added.

## Header and editor

The heading uses the actual escaped `collection.title`, including Shopify's
Products title for `/collections/all`. There are no hard-coded collection names.
A small shared Gecko gradient line and generous whitespace give the header its
structure; the page is complete without a collection banner image. Optional rich
`collection.description` and localized `collection.products_count` follow it.
Long text wraps, and wide description tables scroll within their own content.

Editor settings expose products per page (8–48 in steps of four, default 24),
collection description, product count, vendor, price and sale/sold-out badges.
Description/count/price/badges default on; vendor defaults off. Empty collections
show a localized neutral message and no product grid or pagination.

## Product cards and grid

Every item renders **the unchanged `gecko-product-card` snippet**. Its existing
styles remain unchanged, so homepage Selected Pieces is preserved. The whole card
links to the native product URL and includes the product title, optional vendor,
native currency-aware pricing and an arrow. Variable prices use the existing
From treatment. The existing conservative sale badge/compare-at treatment applies
to uniform-price products; sold-out status takes badge precedence. Archive and
sold-out products remain fully styled and clickable.

Consistent 4:5 frames have rounded 16px corners, subtle borders and neutral
surfaces. Shopify responsive images are centered using `object-fit: contain`,
with their original proportions intact. Images use their alt text or the product
title fallback and retain the shared card's lazy loading. Missing images leave
an intentional neutral frame with a usable product link rather than a broken
image. Product photography is not stored in Git.

Columns: one below 600px, two from 600–1023px, four from 1024px. Grid columns use
`minmax(0, 1fr)` and generous gaps; a small collection keeps the same card sizes.
Titles and prices can wrap. Shared warm/cool accents brighten slightly on
hover/focus; images scale 1.02 and arrows shift 4px. Reduced motion disables these
transforms/transitions. There is no card lift or heavy shadow.

## Native pagination and accessibility

Shopify's `paginate collection.products` controls slicing and page links. URLs come
from `paginate.parts`, `previous` and `next`, preserving Shopify query parameters.
Rounded controls have 44px minimum touch targets, visible focus rings and a subtle
Gecko gradient current-page border. Controls wrap on narrow screens without
horizontal overflow. Current page uses `aria-current="page"`; boundary controls
are disabled non-links and ellipses are noninteractive. No pagination appears
for a single page.

The collection is a labeled section with one h1, the grid is a semantic list,
product links remain keyboard accessible, and pagination is a named navigation.
The shared card's readable sale/sold-out labels, image alt fallback and focus
behavior are preserved. Forced-colors mode gives the current page a solid outline.

## Validation

91 responsive Chromium fixtures passed. They render the actual collection section, unchanged shared
card and production CSS at **375, 390, 430, 768, 1024, 1440 and 1920px**. Cases
cover empty/one/two/many products, mixed portrait/square/landscape images, missing
images, archive/sold-out products, sale/variable prices, long titles/prices and
rich descriptions, hidden settings, and first/middle/last pagination pages.

Checks cover exact card counts, column breakpoints, consistent media geometry,
contain fit, readable badges/prices, no horizontal overflow, product URLs,
count pluralization, optional settings, preserved pagination queries, current
and boundary states, focus/touch targets, restrained interaction and reduced
motion. Desktop/mobile screenshots are visually reviewed.

Fixtures supply Shopify-shaped product/pagination objects and translations; the
Shopify-only paginate tag is replaced by supplied page data. They validate layout
and markup but do not prove Shopify server slicing or real storefront routing.
Verify pagination and Theme Editor settings locally on the unpublished theme.
Cloud does not authenticate to Shopify, synchronize themes or publish.

Theme Check: **56 files inspected, no offenses**. `git diff --check` passed.

The approved Header, Footer, homepage and product page files, including the shared
card snippet/styles, were verified unchanged. Stop after this collection page.
