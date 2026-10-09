# Phase 04B — Homepage featured products

`sections/gecko-featured-products.liquid` follows the approved category showcase.
It renders a curated collection through `snippets/gecko-product-card.liquid` and
loads only `assets/gecko-featured-products.css`. No JavaScript, quick add,
cart/filter behavior, product-page or collection-page work is introduced.

## Local Theme Editor setup

Customize the local unpublished theme → Home page → Featured products:

- Select an existing curated collection. Product order follows the collection's
  native storefront order. No collection or product is hard-coded or created.
- Edit the optional eyebrow, heading and optional description. The initial
  editable heading is SELECTED PIECES.
- Choose 1–8 products; the default is four. Toggle price, vendor and sale/sold-out
  badges independently. Prices and badges default on; vendor defaults off.

No collection is selected automatically. A missing/empty selection hides the
section on the live storefront and shows a setup hint in Theme Editor. Select a
collection with products available to the storefront before reviewing locally.
Product titles, URLs, vendors, images and prices come directly from Shopify's
collection/product objects. No photography is copied into Git.

## Product cards and prices

Each card is one semantic link using `product.url`. It includes a contained
product image, h3 title, optional vendor/price/badge and decorative arrow. Missing
photography leaves a neutral media area rather than an invented product image.
Image library alt text falls back to the product title. Responsive images load
lazily at low priority below the preceding homepage sections.

Native `money_with_currency` formats the current product price. Variable-price
products display a translated From label and their minimum price. Uniform-price
products whose compare-at price exceeds their current price show the current and
struck-through regular price, with screen-reader labels. The same condition
enables the Sale badge; variable-price products avoid a potentially misleading
aggregate sale label. Unavailable products use Sold out instead. Badges never
replace product information or disable the product link.

## Presentation and interaction

Four columns begin at 1024px, two at 600px, and one below 600px. Consistent 4:5
media frames retain the complete photograph using contain. Product text wraps
naturally without ellipses or fixed heights. Subtle warm/cool accent lines reuse
the Gecko palette; photos are untinted and remain the visual focus.

Hover and keyboard focus use the same 1.02 image scale, 4px arrow motion and a
slightly stronger accent. No card lift, shadow, per-card slideshow or hover-only
information is added. Visible focus rings, readable text contrast, reduced-motion
overrides and forced-color treatment retain accessibility.

## Validation and local review

Theme Check inspected 52 files with no offenses. Chromium passed 70 responsive
fixtures at 375, 390, 430, 768, 1024, 1440 and 1920px, plus focus/hover, contrast,
reduced-motion, forced-color, empty-selection/editor and text-escaping checks.
Fixtures covered collection limits, regular/sale/variable prices, USD/EUR money
format output, availability badges, display toggles, missing images and long
titles/prices. Tests render the actual Liquid and CSS with mocked Shopify product
objects/image/money filters; test photos and dependencies remain outside Git.

Native collection/Markets availability, actual product imagery, store money
format and prices require review in the local unpublished Shopify preview.
Approved Header, Hero and category sources/settings are preserved. Stop after
this section. Codex Cloud does not authenticate, synchronize or publish Shopify
themes; local Shopify CLI handles preview and theme synchronization.
