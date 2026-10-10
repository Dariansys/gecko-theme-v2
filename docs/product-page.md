# Phase 05A — Gecko product page UI

The product template now uses `sections/main-product.liquid`, supported by
`snippets/product-media-gallery.liquid`, `snippets/product-variant-picker.liquid`,
`assets/gecko-product.css` and `assets/gecko-product.js`. The inherited Skeleton
product section stays intact. Approved Header, Footer and homepage files are
unchanged. No cart drawer, collection redesign or dedicated 3D experience is added.

## Layout and appearance

Below 1024px, media precedes product details. Desktop uses a 1.35:1 column ratio
(about 57% media / 43% details before the gap) within the existing wide container.
The square mobile stage and 6:5 desktop stage have 24px rounded corners, a subtle
border and a light neutral surface. Responsive images are centered with
`object-fit: contain`; portrait, square and landscape photography stays intact
instead of being cropped to the frame. The first displayed image loads eagerly
with high priority; other images load lazily. No product photography is stored
in Git.

A native horizontal scroll-snap track supports touch scrolling. Lightweight arrow
buttons navigate previous/next media; left/right keys work when the track has
focus. Controls are 48px, counters announce the current position, and boundary
arrows disable. Off-screen enhanced slides are inert and hidden from accessibility
navigation. Outgoing videos pause; external players reset to stop hidden playback.
A selected variant's featured media becomes active without rebuilding the gallery.

Existing Shopify videos, external videos and models use native Liquid media tags.
Only products with model media load Shopify's native model-viewer UI feature and
`assets/gecko-product-model.css`. This small stylesheet is Shopify's v1.0 UI CSS
served as a theme asset; its public CDN source is recorded in the file. No slider
library, new npm dependency or custom 3D renderer is added.

Options are wrapped rounded pills, grouped with fieldsets and legends. Checked
options have a thin shared Gecko gradient border and solid outline; radio focus
has its own visible ring. Unavailable combinations are struck through and named
for screen readers, but remain selectable so changing another option can recover
a valid combination. Add to cart uses `--gecko-orange` with near-black text for
contrast; sold-out/unavailable states use the muted neutral palette. Reduced
motion disables arrow movement and uses immediate gallery navigation.

## Native product behavior

Titles, optional vendor, variant price/compare-at price, availability, description,
media and options come from the actual product. Editor settings expose vendor,
optional dynamic checkout (off by default) and an optional shipping note.

The native Shopify product form submits the selected variant ID and quantity to
Shopify, using the standard cart-page flow. No add-to-cart AJAX or cart drawer is
introduced. Quantity min/max/increment rules come from the selected variant.

Enhanced option selection uses `product_option_value.id` with the storefront
Section Rendering API (`option_values` + `section_id`). Shopify resolves the
combination and renders current pricing, availability, quantity rules and purchase
controls; JavaScript replaces only the details, preserves quantity within the new
rules, restores radio focus, updates the variant URL and selects associated media.
Combined-listing option URLs navigate to the associated product when supplied.

No complete variant JSON is embedded. An enhanced hidden ID input is supplied
directly by the server-selected variant, so it remains correct when that variant
is outside the Liquid `product.variants` list. The native select is disabled in
enhanced mode to prevent duplicate or stale IDs being submitted. A missing or
sold-out combination blocks purchase; updating blocks form submission until the
server response completes. Superseded requests abort. Failures restore the
server-confirmed choices and show an accessible message, preserving the existing
variant rather than submitting the newly requested option with an old ID.

Without JavaScript, the native select and separate native purchase button remain
usable; the gallery can still scroll. The select labels include variant prices
and availability, while the main details reflect the initial server selection.
The fallback follows Shopify's Liquid variant-list limit (250); the enhanced
option picker uses server resolution for higher variant counts. Dynamic checkout
is exposed only in enhanced mode and reinitializes after successful updates.

Reference: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products

## Validation

77 responsive Chromium fixtures passed. They render the actual section/snippets and production CSS/JS
at **375, 390, 430, 768, 1024, 1440 and 1920px**. They cover portrait, square,
landscape, mixed native media markup, missing images, a single default variant,
sold-out and nonexistent combinations, a server-selected variant outside the
fallback list, and long text. No horizontal overflow is allowed; desktop column
proportions, mobile order, rounded frames and contain-fit geometry are checked.

Interaction fixtures check gallery arrows and keyboard navigation, settled scroll
positions, radio focus/shape, sale pricing, quantity-rule clamping, featured-media
selection, variant URLs, request failures/rapid changes and exact variant/quantity
submission to a local fixture endpoint. The no-JavaScript fallback also submits
selected available variants, including recovery from an initially sold-out variant.
Desktop/mobile screenshots are visually reviewed.

Fixtures supply Shopify-shaped objects and emulate Shopify-only media/form tags
and section responses. They do not prove Shopify's server rendering, real media
player loading, dynamic-checkout processing or live cart submission. Verify these
locally on the unpublished Shopify theme with real products and currencies. Theme Check inspected 56 files with no offenses; JavaScript syntax and
`git diff --check` passed. Approved component files were verified unchanged. Cloud
did not authenticate to Shopify, submit store records, synchronize or publish.
