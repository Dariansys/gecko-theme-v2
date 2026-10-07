# Phase 03B — Header layout and desktop navigation

The existing `sections/header.liquid` is retained so saved Phase 03A logo/menu
settings and the header-group section identity survive local synchronization.
`assets/gecko-header.css` scopes layout to Gecko classes; the inherited broad
`header`, `header a` and `header svg` selectors are removed. The existing
`gecko-brand-lockup` snippet remains the single logo implementation.

## Layout and settings

The wide container holds brand at left, merchant navigation in the middle and
Search/Account/Bag at right. The background is the Phase 02 light surface
(`#F7F7F5`) with a 1px neutral bottom border. Normal header heights including the
border are 65px on mobile, 69px on tablet and 73px on desktop. Long menu labels
may wrap and increase height so navigation remains readable. The desktop brand
area caps at 16rem; long fallback text truncates without shortening its accessible
name. Logo proportions are preserved, including constrained mobile widths.

Customize → Header exposes Main menu (`menu`, default `main-menu`), Sticky header,
Show account, Show search and Show cart count, plus all Phase 03A brand settings.
No layout variants are added. The old Skeleton account-menu selector is removed:
Account is now a direct route link, not an account popup/menu component.

Menu labels and destinations come entirely from the selected Shopify Navigation
menu. To use SHOP, G SERIES, ACCESSORIES and ABOUT, configure those entries in
Shopify Admin; no labels, catalog IDs or destination URLs are hard-coded here.
An empty menu produces no empty nav landmark. Shopify business data is untouched.

## Navigation behavior

`snippets/gecko-desktop-navigation.liquid` renders semantic lists with normal
links and native `details`/`summary` disclosures for parents with children.
Activate the summary with click, Enter or Space; activate it again to close.
Parent destinations remain available as a translated "View [title]" link inside
the panel. Child and grandchild links preserve Shopify's three-level menu
structure without a mega menu. Current links receive `aria-current="page"`;
active top-level paths get a 2px gradient accent. Text itself remains neutral.

Panels anchor to the nav area rather than a potentially narrow/wrapped label,
stay compact, and scroll internally if tall. Native disclosure grouping permits
one open dropdown per header in supporting browsers. There is no custom menu
keyboard model, Escape/outside-click handler or hover-triggered opening: these
are native disclosures, not JavaScript ARIA menus. The default document Tab order
and visible focus are retained; closed dropdown links leave the focus sequence.

Search uses `routes.search_url`. Account uses `routes.account_url` and appears
only when both the Header setting and `shop.customer_accounts_enabled` allow it.
Bag always uses `routes.cart_url`. Optional count comes from `cart.item_count`,
including zero, and is translated with singular/plural screen-reader text.
Visible count is decorative to avoid a duplicate announcement. Counts render
with the server response; no live AJAX cart synchronization or drawer is added.

## Sticky and responsive behavior

The Shopify section wrapper owns `position: sticky; top: 0` via its Header setting.
Putting sticky only on the header child would confine it to the section's height.
There is no JavaScript, heavy blur, transparent-on-hero mode or scroll animation.
The Phase 02 stacking token keeps dropdowns above ordinary page content.

Below 768px, only brand and Bag are shown. At 768px Search and eligible Account
appear; desktop navigation stays hidden until 1024px. At 1024px and above the
three-column desktop layout appears. No mobile menu is built, so desktop menu
destinations are intentionally unavailable from this header on smaller screens
until the next authorized phase. Focus and motion preferences reuse Phase 02.

## Validation and local review

Theme Check inspected 45 files with no offenses. Temporary local Liquid fixtures
with mocked Shopify filters/routes and Chromium passed 30 scenarios across
375, 430, 768, 1024, 1440 and 1920px. Checks covered default and maximum logo
sizes, long labels/fallbacks, empty menu, action toggles, enabled/disabled customer
accounts, zero/nonzero counts, no overlap or horizontal overflow, preserved logo
ratios, keyboard dropdown opening/closing/Tab order, sticky on/off and reduced
motion. Browser fixtures are outside the theme; no dependencies are added.

Real Shopify route responses, customer-account integration, Theme Editor toggles,
actual uploaded logos and current-theme CSS still need local unpublished-theme
review. Codex Cloud does not authenticate, synchronize or publish Shopify themes.
Stop after Phase 03B: no mobile menu, hero, search overlay, cart drawer, mega menu,
footer, product-page or collection-page work is included.
