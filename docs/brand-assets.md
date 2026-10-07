# Phase 03A — Brand assets and header lockup

## Image ownership

Only permanent UI icons, fallback brand graphics and technical decoration belong
in theme assets. Do not commit campaign, lifestyle, hero or product photography,
large base64 images or hard-coded Shopify CDN URLs. Merchant content belongs in
Shopify: section `image_picker` settings for banners/editorial imagery, Product
Media for catalog photography, metafields for product-specific editorial images,
and metaobjects for reusable structured visual content. No new definitions or
business records are created in this phase.

## Configure locally

After synchronizing this branch locally to an unpublished theme, open Shopify
Admin → Online Store → Themes → Customize → Header → Brand lockup.
Choose **Brand mark image** and **Wordmark image** independently. Neither upload
needs a Git commit. Prefer transparent, tightly cropped files: internal padding
affects perceived alignment and visual size. No supplied logo files are committed.

Controls: mark maximum width 24–60px (default 34), wordmark maximum width 80–200px
(default 120), gap 4–20px (default 10), and optional fallback brand text.
Each image can be replaced or removed independently without changing code.

## Rendering and fallbacks

`snippets/gecko-brand-lockup.liquid` receives `brand_settings` explicitly from the
existing Header section. The existing text title alone is replaced. Inherited
menu/account/cart scaffolding is untouched; this phase does not design or extend
those components or change the overall header height.

| Mark | Wordmark | Visible result |
| --- | --- | --- |
| Present | Present | Mark and wordmark |
| Missing | Present | Wordmark only |
| Present | Missing | Mark and fallback text |
| Missing | Missing | Fallback text only |

Fallback text uses the optional setting, then `shop.name`. It is escaped. There
is no invented Gecko illustration or asset/CDN fallback. Both images use native
`image_url`/`image_tag`, responsive widths/sizes and eager loading, with generated
intrinsic dimensions. Width settings cap size rather than forcing distortion.
Desktop height caps are 36px for the mark and 26px for the wordmark; wide/tall
images may appear smaller to preserve proportions. The horizontal lockup aligns
centers and uses a single configured gap with no empty slots for missing logos.

Below 768px logo caps and gap scale to 87.5%; at 768px and above they use full
size. The home link retains a 44px minimum target height. Text does not wrap and
long fallback names truncate visually while the full accessible label remains.
No mobile header/menu layout is introduced. Existing Gecko type, spacing and
focus styles are reused; no duplicate design-token palette or motion is added.

The home link uses `routes.root_url` and one translated accessible name
(`{{ name }} home`). Uploaded logos have empty alt text; fallback text is hidden
from assistive technology inside the labeled link. There is one announcement,
not two separate image names. The Phase 02 focus ring remains available.

## Validation boundaries

Theme Check validates Liquid, settings and translation references. Browser
fixtures validate image sizing, fallback states, mobile geometry and accessibility
without logging in to Shopify. Schema inspection confirms both image pickers are
independent settings in Header; actual Theme Editor appearance and replacement
must be checked locally after synchronization. Codex Cloud does not authenticate,
push or publish themes. Stop after Phase 03A: no navigation, search, cart, mobile
menu or hero work is authorized.

Phase 03A validation: Theme Check inspected 44 files with no offenses. Local
Liquid rendering with mocked Shopify image/translation filters and Chromium
passed 24 cases (six asset/fallback scenarios at 375, 430, 768 and 1440px).
Cases covered independent image replacement, all four presence combinations,
unusual image ratios, long/escaped fallback text, no horizontal overflow,
the 44px home target and visible focus. Native Shopify image-filter output and
Theme Editor upload UI still require the local Shopify review described above.
