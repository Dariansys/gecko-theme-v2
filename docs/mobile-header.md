# Phase 03C — Mobile header and navigation

The existing Header section, logo snippet and Shopify Main menu are reused. Brand
remains left; Bag and a 44×44px inline SVG Menu button remain right. Below 768px
the normal header is 61px including its border; tablet retains the approved 69px
height. At 1024px desktop navigation/actions replace the mobile trigger. Search
and Account live in the drawer below 1024px. Logos preserve their proportions.
No separate mobile header or new Theme Editor settings are introduced.

## Drawer and content

`snippets/gecko-mobile-navigation.liquid` reads the same selected menu and route
objects as desktop. Parent destinations remain links; separate submenu buttons
control child/grandchild lists, update `aria-expanded` and change + to −. IDs are
unique per section/branch. Nested states persist through close/reopen; no hover
expansion is used. Search and Account obey the existing settings and account
availability. They link directly to Shopify routes. Bag/count stays in the header.

The native modal `dialog` fills viewport height and up to 28rem on the right; it
fills the width on narrow phones. Content scrolls independently while Close stays
at the top. Safe-area padding protects notched-device controls. Type, surfaces
and motion reuse Phase 02. Primary links are larger, secondary links muted.
Opening uses a 12px slide/fade and the standard motion token; closing is immediate.
Reduced motion removes drawer/backdrop animation. No heavy blur or library is used.

## Focus, scrolling and lifecycle

`assets/gecko-header.js` registers a guarded, Header-scoped custom element. It is
deferred and loaded by Header only, with no third-party dependency. The trigger
becomes visible after initialization; the drawer requires JavaScript and modern
native-dialog support.

Opening calls `showModal()`, sets trigger `aria-expanded` and focuses Close.
Native modality excludes background controls. A small Tab boundary handler keeps
Tab/Shift+Tab on visible drawer controls; hidden submenus leave the focus sequence.
Escape, Close and link activation close the menu and restore trigger focus.
Crossing to desktop closes it and focuses the visible home link instead of the
hidden trigger. Backdrop click does not dismiss; Close/Escape are explicit actions.

Before body locking, scroll position and inline position/top/left/width/overflow
values are saved. Closing restores them. Links unlock synchronously before default
navigation, including same-page anchors. Stale close events cannot unlock a rapidly
reopened drawer. AbortController removes listeners, and section removal releases
the lock for Theme Editor replacement.

## Validation and local review

Theme Check inspected 46 files with no offenses. Local Liquid fixtures with mocked
Shopify filters/globals and actual Header JavaScript passed 32 browser cases across
375, 390, 430, 768, 844×390 landscape, 1023, 1024 and 1440px. Cases covered default/
max logos, long labels, empty menus, action toggles, zero/nonzero counts, no overflow
or header collisions, image proportions, viewport-sized drawer, nested submenus,
Tab/Shift+Tab, Escape/Close, focus and body/scroll restoration, desktop resize,
reduced motion, link close, rapid reopen, and section teardown. Desktop disclosures
were checked after mobile changes. Fixtures/dependencies stay outside the theme.

Uploaded logos, real Theme Editor replacement, Shopify route responses, account
redirects and iOS/Android behavior require local unpublished-theme review. Codex
Cloud does not authenticate, synchronize or publish Shopify themes. Stop after
Phase 03C: no search overlay, cart drawer, hero, footer, mega menu, product page
or collection page is included.
