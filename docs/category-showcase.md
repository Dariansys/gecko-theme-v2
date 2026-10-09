# Phase 04A — Homepage category showcase

`sections/gecko-category-showcase.liquid` follows the approved Hero in the homepage
template. It adds an editable section header and category blocks, with BALISONGS
and FOLDERS as the two initial cards. Labels and example descriptions are editable
template/preset settings, not fixed Liquid copy. No Hero/Header source, product
grid, collection page, footer or JavaScript is changed.

## Local Theme Editor setup

Customize the local unpublished theme → Home page → Category showcase:

- Edit the optional eyebrow, heading and optional description.
- Configure 2–4 category blocks. Each offers an image, optional mobile image,
  label, short description, link, alt override, Warm/Cool/None accent and image
  presentation (Fill frame or Fit entire image).
- Upload category photography and choose real category destinations locally.
  Blank links use Shopify's native all-products route until configured. No
  collection handles/IDs, external image URLs or campaign photos are embedded.

The image library alt is used unless overridden. Provide an accurate shared
description for desktop/mobile photography; decorative imagery may have empty
alt text. Blank labels retain a link name from alt text or the translated generic
category action. Images missing on the storefront leave a graphic stage; upload
hints appear only in Theme Editor, with no invented product illustration.

## Layout, color and interaction

Below 768px cards stack vertically with a 4:5 media frame. From 768px two columns
use 4:3 frames, with third/fourth blocks continuing on the next row. Rounded 32px
cards have a subtle border, dominant media and a separate light editorial text
area. Text wraps naturally and repeated rows align without fixed text heights.

Warm accents use orange, crimson and wine; cool accents use cyan and teal.
Defined radial fields sit behind photography, with a thin matching accent above
the text area. No blur, image tint, heavy shadow or global token change is added.
Opaque cover photography can hide the fields while the editorial accent remains.
None removes both treatments.

Native responsive `image_url` / `image_tag` rendering is lazy/low priority below
the Hero. Mobile images and focal points take effect below 768px. Fill frame uses
focal-point-aware cover; Fit entire image avoids the default crop. Actual product
visibility and framing still require a local review using uploaded photography.

Each card is one semantic, keyboard-accessible link with an h3 under the section
h2. Focus rings stay visible, text sits on a solid light surface, and hover/focus
use the same restrained image scale and 4px arrow movement. Reduced motion removes
those transitions/transforms. Forced colors removes decorative fields. No reveal,
autoplay or other JavaScript is introduced for categories.

## Validation and scope

Theme Check inspected 50 files with no offenses. Chromium passed 70 responsive
cases across 375, 390, 430, 768, 1024, 1440 and 1920px, plus focus/hover, contrast,
reduced-motion, forced-color, editor-hint and escaping checks. Local browser
fixtures use the actual section/CSS with mocked Shopify image filters and temporary
photography outside Git. Check 2–4 blocks, long text, missing/mobile-only images,
image presentation, focal points, full-card links, focus/hover, contrast and reduced
motion. Native Theme Editor and real photography review remain local.

Stop after this section. Codex Cloud handles coding and GitHub source control;
Shopify synchronization remains local. Do not authenticate, push themes or publish
from Codex Cloud, or continue to other homepage sections.
