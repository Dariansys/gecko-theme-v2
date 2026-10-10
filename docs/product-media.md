# Phase 05C — unified Gecko product media

This refinement supersedes the media dimensions and missing-image presentation
in the Phase 04B / 05A / 05B guides. The approved page layouts, copy, product data,
pricing, options, purchase behavior, pagination and homepage section structure
remain intact. The shared featured/catalog card receives the same media treatment
on both pages; no second card system is introduced.

## One stage and one placeholder

The opt-in `.gecko-product-media` primitive in `assets/gecko-components.css` supplies
24px corners, the existing off-white surface/subtle border, a thin Gecko accent
and the shared 3% inset. It uses existing palette/spacing/radius/motion tokens.
Cards retain alternating warm/cool accent lines and hover strengthening; the
gallery uses the existing shared gradient line. Backgrounds remain clear neutrals.

`snippets/product-media-placeholder.liquid` supplies a lightweight outlined image
symbol and localized “Photography coming soon” label. Both empty product galleries
and cards without an image render it. The symbol is decorative; the visible label
is available to screen readers. No fake product photograph or external image is
introduced. Sold-out/archive products keep their normal photography and links;
the existing readable badge remains, with no whole-card dimming.

## Gallery fill

The former fixed square/mobile and 6:5/desktop frame with 16–32px inner padding
is replaced by a tightly contained, aspect-aware stage. Native image/preview
metadata supplies the ratio, bounded to **0.85–1.5 on mobile/tablet** and
**1–1.5 on desktop**. This keeps unusually tall/wide photos from producing an
unusable stage while giving ordinary landscape photos a shallower frame and
portrait photos more height. Images remain centered with `object-fit: contain`.
The 3% inset puts the image's dominant dimension roughly 91–95% across the stage.

The first ratio renders in Liquid, including without JavaScript. The existing
small gallery script updates the ratio as media becomes active. Its resize
observer realigns only on width changes so ratio/height changes do not cancel
navigation. Arrows, counter, swipe/scroll, keyboard navigation, variant-associated
media, native video/model handling and first-image eager loading are preserved.
The outer rounded frame owns the accent and visible focus ring independently
of the scrolling track. No height/reveal animation is added.

## Featured and collection cards

The single `gecko-product-card` snippet now adds the shared stage and placeholder.
Its price, availability, sale, vendor, title, link and arrow logic is unchanged.
The existing featured-products stylesheet changes the common 4:5 frame to a
**square stage**, reducing vertical dead space for square and landscape images
and keeping every image frame/text start aligned within each grid row. Both
homepage Selected Pieces and the collection grid inherit this refinement.

Images use the same small 3% breathing room and centered contain behavior.
The long axis uses roughly 94% of the square; long/narrow products still retain
whitespace on the other axis to preserve the whole photograph. Small hover scaling
stays inside that breathing room; reduced motion removes scaling/arrow movement.
Existing title/price spacing and top-aligned arrows remain intact.

“Fill” refers to the uncropped image rectangle, not detected product outlines.
These styles cannot remove whitespace embedded in the original photo without
cropping it. Extreme proportions remain fully visible rather than being forced
to cover a frame. Portrait card stages are more compact than the prior tall cards;
actual product-subject scale still depends on the uploaded composition.

## Validation

**210 responsive fixtures passed**: 91 product-page, 91 collection and 28
homepage featured-card layouts. They render production Liquid/CSS/JS at **375, 390, 430, 768, 1024,
1440 and 1920px**, including portrait/square/landscape and extreme tall/wide photos,
missing images, one/two/many products, sold-out/archive products and long titles.
Checks measure dominant-axis contain fill, corner/frame geometry, alignment,
overflow, accessible placeholders, focus, arrows/counters and reduced motion.
Existing product option, quantity, price, availability, variant-ID, request-failure,
rapid-change and native-form fixture checks remain in place. Smooth multi-slide
navigation and resize retention are also checked.

Collection fixtures exercise shared card rendering, pagination and settings;
homepage cards use the same snippet/CSS without changing section composition.
Fixtures emulate Shopify-only tags and data. Real product photographs, player
loading and server behavior still require local unpublished-theme verification.
Cloud does not authenticate, push Shopify themes, publish or modify store records.

Theme Check: **57 files inspected, no offenses**. JavaScript syntax and
`git diff --check` passed. The protected page/section files were verified unchanged.

Stop after this media refinement; filters, search and dedicated 3D remain outside
scope.
