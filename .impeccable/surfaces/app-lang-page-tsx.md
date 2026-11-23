---
version: 1
slug: "app-lang-page-tsx"
primary_target: "app/[lang]/page.tsx"
related_targets: ["app/[lang]/shop/page.tsx","app/[lang]/p/[handle]/page.tsx","app/[lang]/bag/page.tsx","app/[lang]/checkout/page.tsx"]
---

# Storefront (home, shop, product, bag, checkout)

Mode: Persuade for home and product; checkout and bag behave as Operate inside the same world.

Audience: Honduran phone shoppers, many new to buying online. Job: find a fragrance by what it smells like or by name, understand it, see the full price in Lempiras, and order with cash on delivery, bank transfer or card. Constraints: Spanish default, English when the device prefers it; front-end mock, Shopify later; no invented reviews or claims.

Chosen direction: Índice de Notas, raised by La Banda's density collision. Memorable moment: tapping a note in the chord readout morphs the live glyph field from one note into the next.

## Direction contract

THESIS: The store is indexed by what things smell like. Every note is a live glyph field rendered from footage; every fragrance is a chord of notes. Refuses the category default of a bottle hero over a bestseller carousel.

OWN-WORLD: White ground (dark: #121110) and one ink (#141312 / #ece6da). Colour comes only from the notes themselves (strawberry red, peony crimson, saffron-crocus lilac, violet magenta, musk-white) rendered as star/dot glyph fields. Hairline-ruled index rows numbered like a perfumer's organ (No. 012). Buying facts live in a solid ink band with paper text: dense, explicit, boxed. Buttons are solid rectangles with plain labels; secondary actions are bordered. Familjen Grotesk for voice, Martian Mono only for numbers and measurements.

STORY: The visitor sees scent made visible, understands each fragrance through three plain notes, sees one total price and how they will pay and receive it, and adds to the bag without leaving the first screen.

FIRST VIEWPORT (390 wide): header with wordmark, Search, and a bordered Bag button showing count and total; a one-line hook; the glyph stage (~46vh) morphing the featured fragrance's notes; a three-column chord readout (Salida / Corazón / Fondo) whose tiers are buttons; the ink buy band starting inside the first viewport with name, house · type · ml, price in L and a full-width Add to bag. Desktop: stage spans the width; the band anchors at bottom right, overlapping the stage's lower edge.

FORM: Índice de Notas, my grounded list position 1 (pick card), chosen by the user's delegation over the roll's position 3 (La Encomienda); raises kept from Bazaar (image poses, type answers across one seam), Miura (bag unfolds into checkout as one sheet), Film (the glyph field is the material, never a filter), Step Row (checkout steps never wrap, marker shows where you are), Algorave (totals preview changes before commit). Seed key 441790d9.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
