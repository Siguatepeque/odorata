# Research log

Newest first. One entry per session: what was checked, what changed in [[candidates]], what's next.

## 2026-11-23 (Imagination session, local with Chrome)

- Synced the cloud session's branch (handoff.md, customs and fixed-cost corrections) into master.
- LV Imagination 100 ml is US$360 on louisvuitton.com, in stock. The handoff's US$440 was a memory guess and wrong.
- Imagination dupes priced live: Hectic, Marwa, Hawas Kobra (Jomashop); Montagne Imaginary (maker's site, owner's pick, 50 ml). Table and dropped candidates in [[decisions]].
- Added Imagination + 4 alternatives to `lib/products.ts` (8 new notes, photos pending). Imagination has stock 0 until the "por encargo" state exists.
- Parfumo returns scrambled data after quick repeated reads. Owner prefers Fragrantica for notes: all Imagination-cluster notes re-read there; Marwa corrected.
- Added Amber Oud Aqua Dubai (most-voted look-alike on Fragrantica) and Hawas Ice (owner's pick, standalone). Fragrantica vote counts in [[decisions]].

## 2026-11-23 (later session)

- Owner asked for an actual buy list. Turned the saved data into profit per bottle in lempiras ([[decisions]], core order about L21,400 landed / L10,800 profit).
- Reasoning fix: coupon dependency affects restock, not a bottle bought while the coupon is live. Coupon-dependent bottles are a buy this week.
- New ratios from the Privé CSV: Paradigme 1.69, Bottled Absolu 1.69, Naxos 1.71, Erba Pura 1.83, Ombre Leather EDP 1.68, Gris Charnel 1.39 (fail). Sizes on the Jomashop side not verified.
- **Correction:** Privé *does* list Liquid Brun (L1,670, under brand "Fragrance World"). Rayhaan, Maison Asrar and Hawas Ice not listed; Khamrah Qahwa listed but out of stock.
- Dupes under US$30 only pay when Privé lacks the bottle: Club de Nuit nets about L125.
- Owner: list must follow the site's formula (original + inspired-by alternatives) and site pricing. Rebuilt as clusters in [[decisions]]. Dupe-to-original links from reviewer and retailer pages (Parfumo, Scento): Nocturno Elixir → Bleu de Chanel L'Exclusif, Vanguard → Absolu Aventus, Belgravia → Bal d'Afrique Absolu, Proud of You Intense → SWY Intensely, Philos Pura / Amber Oud Gold → Erba Pura, Khamrah → Angels' Share (no brand statement). Jomashop dupe prices from search snippets: Monarque 32.99, Historic Sahara 29.99; IVD, Art of Nature II, Philos Pura, Amber Oud Gold, Proud of You Intense estimated. Re-read before buying.
- Re-read dupe prices live at Jomashop (browser): IVD 30.99, AoN II 44.95, Amber Oud Gold Ed 120 ml 43.99, Khamrah 34.99, Qahwa 29.99, Vanguard/Belgravia 39.99 and Nocturno Elixir 17.99 after $10 coupon. Proud of You Intense and Philos Pura EDP not at Jomashop. No more estimates (owner).

## 2026-11-23

- **Corrections after a re-check of the math:** (1) [[pricing-filter]] said no bottle reaches the 15% target if customs charges; ADG EDT and EDP 75 do (about 19% and 21%). (2) The ratio ≥ 1.6 rule (A1) ignores about L290 of fixed cost per bottle, so it overstates margin below about US$100 (9% at US$60, −4% at US$30). The gate is now computed margin, with a ratio-by-price table. Added a coupon × customs stress table to [[signals]]: only the two ADG bottles survive either shock, nothing survives both. [[decisions]]: the first purchase is now the 2-bottle test import (ADG EDT + EDP 75). A9 (dupes) weakened: Club de Nuit Intense makes about L120 a sale with the coupon and loses money without it.
- Full ADG line priced (in [[candidates]]; the separate per-brand note was removed as too narrow for this folder). Core passes (EDT 100 2.28, EDP 75 2.33, Profondo EDP 100 1.75 and 200 1.90). Parfum 100 (1.39) and Elixir 50 (1.45) fail. Privé lacks Profondo Parfum, Absolu, Intense.
- [[signals]]: Fragrantica votes for 30 pages, Venba niche prices, and a coupon stress test. Finding: without Jomashop's 20% coupon only ADG EDT keeps a clear margin (1.82×, about 23% at Privé −10%); Most Wanted, SWI, Eros EDP and Profondo fall to about 5–6% or fail. LV Imagination: strong demand (4.51, 14,809 votes) but no legitimate discounted source. Olfactory Factory's domain is now parked; Venba has Althaïr in stock (US$229.99).
- Discounters ([[discounters]]): FragranceX is 13–37% above Jomashop on 6 of 6 comparable bottles; FragranceNet blocks automation; Jomashop stays the buy price. Method per owner: the three signals (margin vs discounters, demand from Fragrantica/best sellers, Privé gap) are kept as separate columns, never combined into one score; margin is the gate.
- **Correction:** the gap analysis said Creed Aventus was out of stock at Privé. Wrong (price filter bug, see [[sources]]): 5 Aventus variants are in stock, 100 ml L13,620. Re-verified from the CSV: still out are Althaïr, Percival, MYSLF, all 24 YSL Libre listings, Mojave Ghost, Vibrato, Tobacco Vanille, Green Irish Tweed, Lost Cherry. Corrected totals: 3,826 in-stock SKUs; 38% on sale, average −17.4%.
- Saved Privé's full Honduras catalog as `data/prive-2026-11-23.csv` (method in [[sources]]). A Python scraper got HTTP 429 and was removed; the browser route works.
- Owner's rule: notes are hypotheses to be challenged and stress-tested, updated often. Added [[assumptions]] (12 claims, tests, confidence) and a stale rule in [[README]]. Weakest claims: customs L0, GBox, Black Friday-distorted ratios, ADG on one observation.
- Priced ADG EDT 100 ml: ratio 2.28, best found. Not a top seller on either list, so a margin bet. See [[candidates]].
- Read Privé best sellers ([[competitor-prive]]) and Jomashop best sellers ([[sources]]). Owner ruled that Privé is the competition and the source is online popularity.
- Added ratios for Eros EDP (1.84) and Le Male Elixir 125 ml (1.53, fail).
- Dropped FragranceX best-seller list as noise.
- Open: Babycat US price and source; Fragrantica review-count popularity; price ratios for MYSLF, Paradigme, Paradoxe Intense, Guilty Elixir, Replica Jazz Club, Invictus Victory Elixir, Naxos; Honduran demand evidence.
- Misreads to avoid: "Babycat" is a YSL perfume, not a dupe brand; "Amogue" most likely meant Amouage (unconfirmed).

## 2026-11-22

- Reassessment in the strategy doc: 11 bottles priced against Privé with the same sizes, cost basis agreed. Source of [[pricing-filter]].
