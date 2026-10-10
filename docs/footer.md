# Phase 04C — Gecko EDC footer

The footer group now uses `sections/gecko-footer.liquid` with its own scoped
`assets/gecko-footer.css`. The inherited Skeleton footer source and the approved
Header, Hero, category showcase, featured products and homepage template are
unchanged. No storefront JavaScript or dependencies are added.

## Structure and editor settings

The semantic footer contains brand, Shop and Info navigation, a newsletter/social
column, and a bottom legal row. Its full-width off-white surface has a thin shared
Gecko gradient divider. Existing typography, spacing, border and color tokens
control the presentation; the newsletter button has a small gradient underline
on hover and keyboard focus.

The shared brand lockup uses the existing uploaded brand mark and wordmark,
initially copied from the saved Header settings. Footer image pickers remain
independently editable, with restrained default caps of 34px / 120px. The shared
snippet accepts optional `image_loading`; footer images are lazy-loaded while
Header calls retain the original eager default. The fallback brand text names
the home link and copyright; optional tagline and statement are escaped text.
No photography or logo files are stored in Git.

Select the Shop and Info **link_list** settings locally in Theme Editor. No menu
or navigation destination is invented. Actual menu links, including Shopify's
three navigation levels, are rendered as semantic lists. Empty menus have no
column. The existing Skeleton footer menu, if configured, maps to the Info menu.

Newsletter settings provide visibility, heading, optional text and button label
(default Join, also used if cleared). Signup uses Shopify's native `customer`
form with `contact[email]` and the `newsletter` contact tag. Shopify renders the
form action and hidden fields; no client-side submission code is needed. The
required email field has a visible label, native email validation, autocomplete
and escaped retained input. Server errors use Shopify `default_errors`, an alert,
`aria-invalid` and a described-by association. Success uses a status message.

Instagram, YouTube and TikTok URL settings render understandable text links only
when configured. The policy toggle renders only actual populated `shop.policies`
links. Copyright uses the current year and editable fallback brand text (initially
Gecko EDC). No localization selector is added because this theme has no existing
simple native selector. Empty social/newsletter combinations omit their column;
empty policies omit their navigation.

## Responsive and accessibility validation

Below 768px the order is brand, Shop, Info, newsletter, social, legal, with generous
vertical spacing and no accordion. Tablet uses wrapping columns; from 1024px the
columns sit side by side. Missing columns naturally redistribute space. Long
labels wrap; the email field can shrink without horizontal overflow.

Local Chromium fixtures rendered the actual Liquid section/shared snippet and
production CSS at **375, 430, 768, 1024, 1440 and 1920px**. Full, minimal, default,
one-menu, social-only, blank-button-label, long-content, error and success cases
passed (54 layouts). Fixtures supplied Shopify-shaped menu/policy/image objects,
translations and form states. They replaced the Shopify-only form tag with a
representative form wrapper, so they validate layout and structure rather than
Shopify's server handling. Desktop/mobile screenshots were visually reviewed.

Checks covered nested menus, hiding unset settings, configured social links,
no horizontal overflow, mobile order, desktop columns, labeled email controls,
newsletter tag, nonempty button label, error/success associations, keyboard focus
on links/inputs/buttons, lazy footer images and preserved eager Header images.
Reduced motion disables the subtle underline transition through existing tokens.

Theme Check: **53 files inspected, no offenses**. Approved component files and
`templates/index.json` were verified unchanged; `git diff --check` passed.

Actual newsletter submission, customer registration and Theme Editor behavior
must be verified locally against the unpublished Shopify development theme.
Cloud validation did not authenticate to Shopify, submit customers, synchronize
the theme or publish anything. Stop after this footer.
