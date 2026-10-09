# Phase 03D-1 — Static homepage hero

`sections/gecko-hero.liquid` replaces the homepage's Skeleton welcome instance.
The inherited `hello-world` source stays intact; no other homepage sections are
added and the approved desktop/mobile Header is unchanged. `assets/gecko-hero.css`
is loaded by this section only. No JavaScript, carousel, scroll effect, parallax
or new dependency is introduced.

## Composition and gradient

At 1024px and above, the wide container divides available column space 44/56:
editable copy left, dominant product media right. Fluid display type, restrained
body text and existing dark/text CTA primitives reuse Phase 02. Content grows
naturally for long copy instead of clipping. The light surface and whitespace
remain neutral so the launch color field is confined to the media card.

The card has the existing large radius and a subtle border. One circular/elliptical
field uses `--gradient-gecko`, with opacity 0.78 for Standard and 0.38 for Subtle.
It is softly blurred behind the product, not applied to photography. Turning off
the gradient removes that decorative layer. The photograph stays fully opaque
with no tint, filter, blend mode or hover scale. No new gradient palette is added.

The optional accent setting matches the first exact, case-sensitive word/phrase
in the headline and colors it with Gecko crimson. The whole headline cannot be
accented. Plain text segments are escaped before rendering, preserving line
breaks and preventing markup/entity corruption. Crimson and muted body text pass
4.5:1 contrast on the default light surface; no saturated gradient text is used.

## Theme Editor setup

In the local unpublished theme, Customize → Home page → Gecko hero exposes:

- Eyebrow, multiline headline, optional accent phrase and body text.
- Primary CTA label/link and optional secondary CTA label/link.
- Hero image, optional mobile hero image and shared image-alt override.
- Show Gecko gradient accent and Subtle/Standard intensity.

Initial copy is an editable schema default, not final locked marketing copy.
Review/edit it before publication. A blank primary link uses Shopify's native
all-products route; clear its label to omit the action. A secondary action appears
only with both label and destination. No catalog IDs or destination URLs are
hard-coded. The section is available only on the homepage.

## Image ownership and responsive behavior

Upload photography through the two native image pickers; no product photograph
or image URL is stored in theme source. Transparent, tightly cropped product
images best reveal the glow and give the object visual prominence. Opaque photos
keep their original background and can obscure the field. No product is invented
when images are missing: only decorative geometry remains; an upload hint appears
in Theme Editor and is absent on the storefront.

Below 768px, `picture` selects the mobile image when supplied. Otherwise the hero
image is reused. If only a mobile image exists, it is used at every width. Native
`image_url`/`image_tag` produce responsive candidates and intrinsic dimensions;
mobile candidates cap at the upload width. The image is eager with high fetch
priority because this is above-the-fold/LCP content. Library alt text is reused
unless overridden. Choose wording accurate for both desktop/mobile photographs;
if imagery is purely decorative, leave both alt values empty.

Below 1024px, text is first and media second. Mobile type and spacing stay fluid;
CTAs occupy full rows below 430px and wrap naturally at wider widths. Media uses
a 5:4 phone frame, a wider 3:2 tablet frame and 6:5 desktop frame. The photograph
is contained at its original aspect ratio, not stretched or cropped. All changes
are scoped to the hero; existing Header heights and menus are retained.

## Validation

Theme Check inspected 47 files with no offenses. Local Liquid fixtures using
mocked Shopify filters/globals and Chromium passed 56 cases across 375, 390, 430,
768, 1024, 1440 and 1920px. Scenarios covered long/empty copy, desktop-only/mobile-
only/missing images, art direction, secondary CTA configuration, gradient off and
both intensities. Checks confirmed no horizontal overflow, Header integration,
44/56 columns, mobile reading order, image proportions, eager/high-priority media,
keyboard focus, usable buttons, contrast, escaped headline emphasis, no full-
headline emphasis and no hero animation. Test imagery/dependencies remain outside
the repository. The approved Header files have no changes.

Actual uploaded photography, Theme Editor controls, Shopify-generated image
filter output, real Work Sans metrics and mobile-device review remain local
unpublished-theme checks. Codex Cloud does not authenticate, synchronize or publish
Shopify themes. Stop after the static hero; later motion, carousel and homepage
sections require separate authorization.
