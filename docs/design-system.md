# Phase 02 — Gecko EDC design system

This is the visual foundation only. No header, footer, homepage, hero, product,
collection, cart or search component is implemented. The inherited Skeleton
components remain scaffolding. Shopify development and preview run locally;
Codex Cloud handles code, Theme Check and GitHub. Do not authenticate, synchronize
themes or publish from Cloud. Stop before Phase 03 until explicitly instructed.

## Visual reference and color

The supplied brief describes a circular Gecko logo with white linework and a
warm/cool color field. No logo image was attached to Phase 02, so the supplied
palette is the reference; direct image comparison remains a local review step.
Use neutral surfaces for roughly 85–90% of a composition and accents for 10–15%.
This is an editorial guideline, not a CSS-enforced quota. Photography remains
realistic, neutral and dominant.

| Token | Value | Role |
| --- | --- | --- |
| `--gecko-black` | `#141414` | Primary text, buttons, dark photography |
| `--gecko-graphite` | `#292929` | Dark control surfaces |
| `--gecko-white` | `#F7F7F5` | Default light surface, dark-surface text |
| `--gecko-off-white` | `#F1F1EF` | Soft studio surface |
| `--gecko-light-gray` | `#E9E9E7` | Secondary neutral plane |
| `--gecko-border` | `#D8D8D5` | Decorative light-surface dividers |
| `--gecko-silver` | `#B9B9B4` | Secondary dark-surface text |
| `--gecko-muted` | `#61615C` | Secondary light-surface text |
| `--gecko-orange` | `#E3552D` | Warm gradient field |
| `--gecko-red` | `#DF2121` | Warm gradient field |
| `--gecko-crimson` | `#BC2E3F` | Warm transition |
| `--gecko-wine` | `#9B5262` | Mauve transition |
| `--gecko-cyan` | `#4CCDC2` | Cool gradient field |
| `--gecko-teal` | `#6CABA0` | Cool transition |
| `--gecko-warm-neutral` | `#B18865` | Organic warm base |

`--gradient-gecko` combines circular orange, red/crimson and cyan/teal light over
a warm-neutral/wine base. `--gradient-gecko-soft` and `--gradient-gecko-glow`
veil that same field with light/dark neutral layers. No gradient text, continuous
gradient animation or full-gradient button is provided. Reserve accent lines,
badge dots and circular discs for occasional emphasis. Decorative discs and
contours should be `aria-hidden="true"`; do not put essential text directly on
the saturated gradient. Glow media works best with transparent product images:
opaque photography will cover the background light. Never recolor metal.

## CSS and Shopify integration

- `assets/gecko-tokens.css`: palette, semantic surfaces, gradients, fluid type,
  spacing, container widths, corners, borders, depth, motion and stacking tokens.
- `assets/gecko-base.css`: extends the existing `critical.css` reset, low
  specificity typography, focus, selection, containers and surface utilities.
- `assets/gecko-components.css`: opt-in buttons, catalog silhouette, labels,
  badges, media and restrained circular/contour accents.
- `snippets/gecko-stylesheets.liquid`: loads those three layers after
  `critical.css` in both layouts and the standalone gift-card document. The
  gift-card body and all inherited sections/blocks remain unchanged.

The existing Shopify Work Sans font picker remains merchant-editable; no new font
service, JavaScript or dependency is introduced. Defaults for background and
foreground become `#F7F7F5` and `#141414`. Previously saved merchant settings are
preserved in `settings_data.json`; explicit choices take precedence over defaults.
The original Skeleton section grid is retained. New components should use
`gecko-container` inside a section's full-width wrapper rather than nesting a
second width constraint inside the inherited central grid column.

## Type, rhythm and responsive behavior

| Tier | Token | Range |
| --- | --- | --- |
| Display XL | `--type-display-xl` | 3–6.5rem |
| Display L | `--type-display-l` | 2.5–5rem |
| Heading 1 | `--type-h1` | 2–3.5rem |
| Heading 2 | `--type-h2` | 1.625–2.75rem |
| Heading 3 | `--type-h3` | 1.25–1.75rem |
| Body large | `--type-body-large` | 1.125–1.25rem |
| Body | `--type-body` | 1rem |
| Body small | `--type-body-small` | 0.875rem |
| Caption | `--type-caption` | 0.8125rem |
| Technical label | `--type-technical` | 0.75rem |

Headings and display use fluid `clamp()` sizes, tight but readable leading and
restrained tracking. Body leading is 1.6. Semantic headings preserve document
hierarchy; display classes change appearance only. Technical labels use the
system monospace stack, uppercase and 0.08em tracking sparingly.

Spacing is a 4px rhythm at the default root size: `--space-1/2/3/4/5/6/8/10/12/16/20/24`
map to 0.25/0.5/0.75/1/1.25/1.5/2/2.5/3/4/5/6rem. Section spacing grows from
3 to 7.5rem; gutters from 1 to 3rem. Body text does not shrink on mobile.

Containers: narrow 44rem, content 72rem, wide 100rem, full 100%. At 1920px a
wide container stops at 1600px. `gecko-stack` uses a configurable vertical gap.
Primitive media defaults to square; override `--media-ratio` for the specific
future component. Use content-driven layouts in later phases; this foundation
does not impose desktop grids or build a mobile copy of a page. Validate at
375, 430, 768, 1024, 1440 and 1920px, plus zoom and long content.

## Buttons and catalog silhouette

Use `gecko-button` with one modifier: `--primary`, `--secondary`, `--text`,
`--icon`. Primary is near-black/off-white and inverts on dark surfaces. Secondary
uses a solid readable outline. Text links retain an underline. Icon buttons are
44px circles and require an accessible name. Other buttons have at least a 44px
height and allow wrapping. A 2px Gecko accent appears on focus/eligible hover;
optional arrows move only 3px. Never depend on the gradient for focus contrast.

```html
<button class="gecko-button gecko-button--primary" type="button">
  Action label <span class="gecko-button__arrow" aria-hidden="true">→</span>
</button>
<button class="gecko-button gecko-button--secondary" type="button">Action label</button>
<a class="gecko-button gecko-button--text" href="…">Descriptive destination</a>
<button class="gecko-button gecko-button--icon" type="button" aria-label="Descriptive action">
  <!-- An aria-hidden inline icon supplied by the future component -->
</button>
```

Use native `disabled` for buttons. `aria-disabled="true"` supplies visual state
only: future components must suppress their action and manage focus explicitly.
Use anchors for navigation and buttons for actions; do not render both semantics.

`gecko-card` provides a borderless, shadowless catalog silhouette, not a Shopify
product card. `gecko-card__media` uses `gecko-media`; `__details`, `__title`,
`__meta`, `__price` define whitespace and hierarchy. No hard-coded catalog data,
product IDs, image swap behavior, forms or add-to-cart logic are shipped. Later
Liquid components must use Shopify objects, responsive image filters, informative
alt text, and lazy loading only below the fold. Fine-pointer hover scales imagery
to 1.02 and shows one small line; keyboard focus-within shows the same accent.

## Surfaces, motion and accessibility

`surface-light`, `surface-white`, `surface-soft`, `surface-dark` and the rare
`surface-gradient-soft` reset their semantic text/control colors, including when
nested. Decorative borders are 1px; interactive outlines use contrasting text
colors. Radii are 4/10/16px, with 50% reserved for intentional circles. Cards have
no shadow; `--shadow-subtle` is available only for exceptional depth.

Motion: fast 140ms, standard 240ms, slow 480ms with
`cubic-bezier(0.22, 1, 0.36, 1)`. `gecko-fade-in` and `gecko-reveal` are opt-in
entrance classes, not scroll observers; reveal travels 12px. No bouncing, parallax,
looping gradients or animation libraries. Reduced-motion disables entrance
animations and transitions and sets all movement tokens to zero/scale 1.

Default text and muted text use neutral colors, never raw accent hues. Focus uses
two solid rings so it stays visible on light/dark surfaces. Forced-color mode
preserves system focus and control outlines. `gecko-visually-hidden` exposes
assistive text while allowing focused content to become visible. The light/dark
color scheme adapts native controls; normal text remains at least 1rem by default.
Palette contrast checks apply to documented default surfaces; new merchant color
choices and future imagery still need local contrast and keyboard review.

## Validation

Run `npm run check` for static Liquid/schema validation. Phase 02 also uses a
temporary local HTML fixture to exercise actual CSS in Chromium at all six widths,
keyboard focus, dark/nested surfaces, disabled controls, hover and reduced motion.
The fixture is outside the theme and is not a storefront page. Browser CSS checks
do not prove Shopify-rendered behavior. Local Shopify preview, Theme Editor and
real product photography verification remain the user's local workflow.

Phase 02 results: Theme Check inspected 43 files with no offenses. Chromium
passed all six viewport checks without horizontal overflow; the wide container
was capped at 1600px on a 1920px viewport. Keyboard focus, disabled hover,
image hover, nested light/dark control colors, reduced motion and forced-color
focus checks passed. Measured default primary text contrast was 17.17:1,
muted light text 5.80:1 and muted dark text 9.35:1. No browser page errors were
reported. The three CSS assets total approximately 14KB before compression.
