# Research log

Newest first. One entry per session: what was checked, what changed in [[candidates]], what's next.

## 2026-11-23

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
