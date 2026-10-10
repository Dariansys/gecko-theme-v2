# Product specifications — Phase 05D

The product section renders `snippets/product-specifications.liquid` immediately
below the description. It reads product metafield `.value` properties, escapes
text, and displays populated fields in the order below. Missing, empty and
whitespace-only values omit their rows. If no rows remain, the entire disclosure
is omitted. No sample product values are included in the theme.

## Create the Shopify product metafields

These definitions are **not created by the theme**. In Shopify Admin, go to
**Settings → Custom data → Products → Add definition** (some Admin versions call
this **Metafields and metaobjects → Products**). Create each definition below with
namespace `custom`, the exact key shown, and type **Single line text**
(`single_line_text_field`). Do not select a list type. Enable storefront access
where the Admin exposes that setting. No app, API credentials or theme code change
is required to create these definitions.

| Label | Namespace and key | Recommended type | Example value |
| --- | --- | --- | --- |
| Model | `custom.spec_model` | Single line text | Pulse |
| Series | `custom.spec_series` | Single line text | MONO / Second balisong |
| Handle material | `custom.spec_handle_material` | Single line text | TC4 titanium |
| Handle construction | `custom.spec_handle_construction` | Single line text | One-piece handles / Handle-stop structure |
| Blade material | `custom.spec_blade_material` | Single line text | S35VN |
| Blade edge | `custom.spec_blade_edge` | Single line text | Factory unsharpened |
| Overall length (open) | `custom.spec_overall_length_open` | Single line text | 265 mm |
| Closed length | `custom.spec_closed_length` | Single line text | 145 mm |
| Blade thickness | `custom.spec_blade_thickness` | Single line text | 3.5 mm |
| Handle thickness | `custom.spec_handle_thickness` | Single line text | 13 mm |
| Weight | `custom.spec_weight` | Single line text | 130–135 g |
| Current batch finishes | `custom.spec_batch_finishes` | Single line text | Natural Titanium / Two-tone Black |

Then open each product in **Products**, populate its metafields, and save. Include
units in the text values; the theme does not calculate or append units. The
examples above are illustrative; enter the correct specifications for each
product. Leave inapplicable fields empty. No Shopify definitions or product data
were created or modified from Codex Cloud.

## Theme Editor and presentation

Open a product template and select **Gecko product**. Settings provide:

- **Show product specifications**: enabled by default.
- **Specifications heading**: defaults to “Product specifications”; blank uses
  the translated default heading.
- **Specifications open by default**: enabled by default; disable for an initially
  collapsed disclosure.

The native `details`/`summary` disclosure works without JavaScript, toggles with
Enter/Space, exposes its expanded state to assistive technology, and has a visible
focus ring. A semantic definition list associates labels and values. Subtle row
dividers and a thin Gecko gradient line keep the presentation restrained. Below
480px, rows stack label above value; wider screens use aligned columns. Long text
wraps within either layout. Labels and the fallback heading use storefront locale
keys; the custom heading is escaped merchant-editable text.

Validate in your local unpublished Shopify preview after creating definitions:
populate all fields, remove several values, and clear all fields; verify rows and
the disclosure disappear appropriately. Check open/collapsed editor defaults and
keyboard activation at mobile and desktop widths. Local fixture tests validate
theme markup and styles; they do not create or verify actual Shopify metafields.

## Completed validation

56 Chromium fixture layouts passed at 375, 390, 430, 768, 1024, 1440 and 1920px,
covering all fields, sparse values, empty/whitespace values, long text, escaped
content, disabled visibility and collapsed defaults. Native keyboard toggling,
focus visibility and definition-list alignment were checked without JavaScript.
Two additional mobile/desktop checks verified the Gecko gradient accent and
screenshots. Existing gallery, variant selection and native product-form regression
fixtures passed. Theme Check inspected 58 files with no offenses.
