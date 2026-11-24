# Handoff: catalog direction and Imagination (2026-11-24)

Written at the end of a cloud session that had no Chrome access. The next session runs in local Claude Code with the Chrome extension, so it can read live prices. Read this first, then `research/decisions.md`.

## Owner's direction (decided, don't relitigate)

The owner chooses the catalog on their own judgement first and backs it with data later. The research notes' "buy only what passes the margin gate" advice now applies to **what gets stocked**, not to **what gets listed**.

The concept:
1. **Coveted perfumes people can't afford, each paired with thoughtful dupe alternatives.** This is the passion lane and what the site's Alternatives / "inspired by" feature is built for.
2. **Obvious profitable fragrances that competitors (Privé) overprice**, e.g. ADG EDT 100, ADG EDP 75, Eros EDP, Most Wanted Parfum, La Vie Est Belle (see `research/candidates.md`).
3. **Dupes with thin margins are sold at Privé's price** instead of Privé −10%. The owner accepts this.

This is not the long-term business model, just the starting catalog.

## Imagination (Louis Vuitton): list it, sell to order

Agreed: list Imagination as the showcase for its dupes.

- **Why it's worth it:** strong demand and nobody sells it locally. Privé's 2026-11-23 snapshot lists 5 LV perfumes (Coeur Battant, Spell On You, Nuit de Feu, Fleur du Désert, Ombre Nomade), **all out of stock**. Imagination isn't listed at all. LV sells only through its own boutiques, with no discounters and no sales, so even Privé can't source it reliably.
- **How it's different from PDM / Creed / Tom Ford:** those have discounted supply (Layton US$239 vs Privé L9,975; Althaïr US$229 vs L10,600), so they're treated like the designers. Imagination is bought at full boutique price.
- **Sell to order only, paid 100% up front.** Never show it as in stock.
- **Price:** from LV's *current* US price. Roughly US$440 (from memory, unverified) → landed about L12,750 → about **L16,000** for a 15% margin (about L20,000+ if customs charges duty). Don't discount it.
- **Page copy:** "Por encargo · pago completo · comprado en boutique, con factura · entrega en X días". Use your own photos and wording. Reselling LV is legal, but the site must not look like an authorized LV dealer.

### Do before it goes live (needs Chrome / the owner)
1. Read LV's current US price for Imagination 100 ml, and 30 ml if it's offered. Record the date and the source.
2. Confirm that LV (boutique or louisvuitton.com) will ship to the GBox Miami address, and whether there's a per-customer purchase limit.
3. Delivery time for "entrega en X días" depends on the 2-bottle test import (`research/decisions.md`). Until then, use a range the owner is comfortable promising.

## Imagination dupes: next task

The owner has checked dupes in Chrome. For each one:
1. Record its US price and source (Jomashop or another discounter) with the date.
2. Record its Privé price. If Privé doesn't carry it, use the price we'd charge. `research/data/prive-2026-11-23.csv` has nothing named as an Imagination dupe. The only match on "Imagin" is Bharara Mast Rome Imagine (L1,435), and there's no evidence it smells like Imagination, so don't assume it.
3. Compute the margin twice, with the Jomashop coupon and without it. Formula in `research/pricing-filter.md`: price × 1.07 + US$5 freight, × L26.8; card 4.25% + US$0.35; L120 delivery; L25 packaging.
4. Price at Privé −10% if margin ≥15%. Otherwise match Privé (owner's rule).
5. Set the closeness level (Casi idéntico / Mismo ADN / Mismo estilo) from reviewer consensus (`lib/products.ts` LEVELS). Research proposes the level; the owner decides.
6. Add Imagination and its dupes to the catalog with real notes and prices.

## Things to keep in mind (from this session's analysis)

- **Cheap dupes only pay when bundled.** About L290 per bottle is fixed (freight, delivery, packaging, card fee). Club de Nuit Intense at Privé's L1,375 makes about L255 (19%) with the coupon and about L60 (4%) without. On the site, make "add the alternative" easy from the coveted perfume's page, so dupes ride in the same box as another bottle.
- **Don't stock expensive showcase bottles** (Aventus L13,620, Imagination). They're there to sell dupes, and an unsold bottle ties up a large share of the capital. List them to order.
- **Stock only what passes margin without the coupon:** right now that's ADG EDT 100 and ADG EDP 75 (the 2-bottle test import).

## Website work this implies

- Products currently carry only `stock: number` (`lib/products.ts`). Add an availability state: **en stock** / **por encargo** (with delivery time and payment rule: full prepayment for Imagination, at least a 50% deposit for other made-to-order bottles). Show it on the product card, the product page, the bag and checkout.
- Cash on delivery can't apply to made-to-order items. The checkout must make this clear, because PRODUCT.md notes that buyers are wary of paying online.
- The six current products are placeholders (PRODUCT.md). Replace them with the owner's list as it firms up.

## Research notes to correct

- **Olfactory Factory works.** The owner confirmed it in Chrome. `research/candidates.md` and `research/decisions.md` still say its domain is parked. Fix them, and re-read the Althaïr / Layton prices there with a date.
- Log this session's decisions in `research/log.md` and `research/decisions.md` (owner-judgement catalog, made-to-order listing, Imagination showcase).
