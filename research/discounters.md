# Discounters

Where the margin gate gets its buy price ([[pricing-filter]]). Hypotheses, read 2026-11-23 (Black Friday week, so coupons are at their deepest). Stale after 7 days in sale season ([[README]]).

## Source status

| Source | Readable by automation? | Result |
|---|---|---|
| Jomashop | Yes (best-seller listing, search-box dropdown). Direct GraphQL calls blocked, don't use | Cheapest on every bottle compared |
| FragranceX | Yes. Search results are client-rendered; product pages are server-rendered with every size and price (`aria-label="3.3 Oz Eau De Toilette Spray, $89.24"`), but URL slugs must be guessed | 13–37% above Jomashop on all 6 comparable bottles |
| FragranceNet | No: security check page. Not bypassed | Unknown. Earlier doc: about 35% coupon, never cheapest on 11 bottles |
| Perfumania | Partly: results are mostly bundles | Not compared |
| Venba, Olfactory Factory | Not rechecked | Doc: cheapest on Parfums de Marly (35–40% under Jomashop) |
| MaxAroma | Blocked earlier | Unknown |
| Wholesale accounts | Not opened | Free to try; may beat all retail |

## Jomashop vs FragranceX (US$, full-size, after Jomashop's coupon; FragranceX before its 15% new-customer offer)

| Bottle | Jomashop | FragranceX | FX ÷ Jomashop |
|---|---|---|---|
| ADG EDT 3.3 oz | 66.49 | 89.24 | 1.34 |
| La Vie Est Belle EDP 3.4 oz | 99.99 | 124.94 | 1.25 |
| Good Girl EDP 2.7 oz | 94.99 | 130.43 | 1.37 |
| Aventus 3.3 oz | 329.99 | 399.99 | 1.21 |
| Club de Nuit Intense EDT | 26.99 | 32.95 | 1.22 |
| YSL Libre EDP 3 oz | 116.24 | 131.12 | 1.13 |

With FragranceX's extra 15% off, ADG (75.85), La Vie Est Belle (106.20) and Good Girl (110.87) are still above Jomashop. Other FragranceX prices seen: ADG EDP 3.3 oz 108.47, ADG Parfum 3.3 oz 144.86, Profondo EDP 4.2 oz 132.50, Dior Sauvage EDT 3.4 oz 158.58, Pegasus EDP 2.5 oz 170.48, Light Blue EDT 3.3 oz 63.16, Bad Boy EDT 96.80, 1 Million EDT 87.86, Invictus EDT 85.81.

## Reading

- Jomashop is the buy price for designer in this sample: 6 of 6. That is why the margin ratios in [[candidates]] stay on Jomashop.
- Sample is small and one day. FragranceX could beat Jomashop in a non-sale week or on niche; coupons and stock change daily.
- **Dior Sauvage** exists at FragranceX at US$158.58 (about list price): little discount, so a Chanel/Dior line would need a local price that beats that by a margin ([[assumptions]]).
- Not found at FragranceX by guessed URL (not proof of absence): Most Wanted, Eros, Born in Roma, Le Beau, Le Male, Scandal, MYSLF, Phantom, Khamrah, Layton, Toy Boy, Imagination.

## To do

- Venba and Olfactory Factory for niche (PdM, Xerjoff, Creed); Perfumania single-bottle pages; open a wholesale account.
- Per-bottle record: price, coupon, stock, tester or boxed, shipping threshold, tax ([[sources]]).

Related: [[candidates]], [[log]].
