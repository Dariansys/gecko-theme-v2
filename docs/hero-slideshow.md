# Phase 03D-4 — Gradient headline and Hero slideshow

The approved Hero layout and Header stay intact. The editable accent now uses
a warm-to-cool Gecko text gradient, including the period in the default `Gecko.`
phrase. Text clipping is feature-gated, with solid crimson as the fallback and
CanvasText in forced colors. Cool stops are darkened with the existing near-black
token to keep the large text readable. Merchant text is escaped before emphasis;
only the first matching phrase is accented, never the entire headline.

## Local Theme Editor setup

Customize the local unpublished theme → Home page → Gecko hero:

1. Add 2–5 **Slide** blocks and upload campaign photography. New section presets
   start with two empty blocks; existing section instances retain their settings.
2. Each block offers desktop/mobile images, label, caption, alt text and image
   presentation. **Fill frame** is the default. Set a Shopify image focal point to
   protect the product, or choose **Fit entire image** to prevent cropping.
3. Set autoplay on/off and a 4, 5, 6 or 8 second interval (default: 5 seconds).
   Arrows, dots and the two-digit counter each have a visibility toggle.

Existing section image pickers and alt settings remain as a one-image fallback
when no slide blocks have photography. They are not copied or deleted. Blocks
with no images are skipped on the storefront; editor placeholders keep empty
blocks selectable. A single image has no carousel controls or timer. Without
images, the stage retains its decorative composition. No photography or CDN URL
is committed. Add actual campaign images locally before reviewing the slideshow.

## Presentation and image loading

The media card presents full-frame photography with focal-point-aware `cover`.
Optional `contain` retains the whole image over the existing Gecko color fields.
Phones use a 4:5 frame and mobile image/focal point below 768px; tablets use 3:2
and desktop 6:5. Text stays first on mobile. Captions sit above a restrained dark
bottom scrim, with controls in a separate lower row and the counter at top-right.

Responsive `image_url` / `image_tag` output loads the first slide eagerly at high
priority. Later images stay in inert HTML templates until their slide is first
selected, then render at normal priority. They do not issue competing image
requests during initial rendering. The first slide stays available without JS;
enhancement controls remain hidden until initialized. Lightweight section-owned
JavaScript uses no external library or new dependency.

## Interaction and accessibility

Crossfades last 450ms with no zoom, swipe or page animation. Autoplay pauses during
mouse hover, control focus and hidden-tab states, and resumes with a full fresh
interval. Manual navigation also resets the timer. The Play/Pause button lets a
visitor stop playback persistently. Reduced motion removes transitions and
disables autoplay; arrows and dots still work. Autoplay is disabled in Theme
Editor so merchants can edit without advancing slides.

Inactive slides are inert and excluded from the accessibility tree. Controls have
translated names, visible focus and 44px heights. Dots expose the current slide;
manual changes announce slide position without moving focus. Automatic changes
stay silent. Theme Editor block selection reveals the exact block; section
disconnect/reconnect cleans up listeners and timers to avoid duplicate playback.

## Validation

Theme Check inspected 49 files with no offenses. Chromium passed 84 responsive
fixtures across 375, 390, 430, 768, 1024, 1440 and 1920px, covering 2–5 slides,
single/empty/fallback images, long captions and optional controls. Interaction
checks passed all interval choices, timer resets, hover/focus/visibility pausing,
explicit Play/Pause, manual controls, reduced motion, forced colors, deferred
images, editor block selection, disconnect/reconnect cleanup and no-JS fallback.
Local fixtures render the actual Liquid, CSS and JavaScript with mocked Shopify
image filters/globals; photography remains temporary test imagery outside Git.
Review real photography, crop/focal points, captions and native editor controls in
the local unpublished Shopify preview. Codex Cloud does not authenticate,
synchronize or publish Shopify themes. Stop after this Hero task; no scroll
reveals, additional homepage sections, drawers or product/collection work.
