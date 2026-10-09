# Phase 03D-2 — Refined static homepage hero

`sections/gecko-hero.liquid` replaces the homepage's Skeleton welcome instance.
The inherited `hello-world` source stays intact; no other homepage sections are
added and the approved desktop/mobile Header is unchanged. `assets/gecko-hero.css`
is loaded by this section only. No JavaScript, carousel, scroll effect, parallax
or new dependency is introduced.

## Composition and gradient

At 1024px and above, the hero container divides available column space 42/58:
editable copy left, dominant product media right. Fluid display type, restrained
body text and existing dark/text CTA primitives reuse Phase 02. Content grows
naturally for long copy instead of clipping. The light surface and whitespace
remain neutral so the launch color fields are confined to the media card. The
hero now uses a 1760px maximum container, a smaller column gap and reduced outer
vertical spacing to give the media more presence without going edge-to-edge.

The light card has a 32px radius and the existing subtle border. Three radial
ellipses use the existing Gecko color tokens: orange/red enters from lower-left,
cyan/teal from upper-right, and a translucent crimson/wine field sits at lower
center-right. Defined color cores and short transparent edges preserve clean
light space; no blur filter or opaque brown base mixes them into one glow.
Standard uses full field opacity; Subtle uses 0.5. The existing toggle removes
all fields. Photography stays above the composition without tint, filter,
blend mode, shadow or hover scale. No global palette is changed.

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
a 5:4 phone frame, a wider 3:2 tablet frame and 6:5 desktop frame. The picture
area uses 9% vertical and 4% horizontal insets. Portrait photography fills about
82% of stage height and stays vertically centered. `object-fit: contain` retains
the complete photograph without stretching or aggressive cropping; landscape
and panoramic uploads use more of the available width and less height. Blank
space within an uploaded image itself remains merchant-controlled. All changes
are scoped to the hero; existing Header heights and menus are retained.

## Validation

Theme Check inspected 47 files with no offenses. Local Liquid fixtures using
mocked Shopify filters/globals and Chromium passed 70 cases across 375, 390, 430,
768, 1024, 1440 and 1920px. Scenarios covered portrait, landscape and panoramic photography, long/empty
copy, desktop-only/mobile-only/missing images, art direction, secondary CTA
configuration, gradient off and both intensities. Checks confirmed no horizontal overflow, Header integration,
42/58 columns, mobile reading order, uncropped image proportions, portrait scale
within the 70–85% target, three unblurred fields, eager/high-priority media,
keyboard focus, usable buttons, contrast, escaped headline emphasis, no full-
headline emphasis and no hero animation. Test imagery/dependencies remain outside
the repository. The approved Header files have no changes.

Actual uploaded photography, Theme Editor controls, Shopify-generated image
filter output, real Work Sans metrics and mobile-device review remain local
unpublished-theme checks. Codex Cloud does not authenticate, synchronize or publish
Shopify themes. Stop after the static visual refinement; later motion, carousel and homepage
sections require separate authorization.
