# Pricing filter

Used by [[candidates]]. Inputs verified 2026-11-22/23; see [[sources]] for where each came from.

## Cost basis (landed, per bottle)

US price after coupon × 1.07 (Miami sales tax, unavoidable) + US$5 GBox freight, × L26.8/US$. Customs: L0 in the base case (owner's experience, unverified at commercial volume).

Other costs per order: card 4.25% + US$0.35 (Tilopay), delivery L120 absorbed, packaging L25. Shopify about US$39/month fixed.

## The rule

Ratio = Privé price ÷ (cheapest verified US price × 26.8).

| Ratio | Meaning |
|---|---|
| ≥ 1.6 designer / ≥ 1.55 niche | Passes only for bottles of about US$100 and up: see "Fixed costs per bottle" below. Cheaper bottles need a higher ratio |
| 1.25–1.6 | Thin: only worth it as an add-on or at Privé's price |
| < 1.25 designer / < 1.15 niche | Break-even or loss |

Where Privé doesn't stock it, use the price we would charge instead of Privé's.

## Fixed costs per bottle (correction 2026-11-23)

The ratio rule treats cost as proportional to the US price, but about L290 per bottle is fixed whatever the price: US$5 freight (L134), L120 delivery, L25 packaging, US$0.35 card fee (L9). So the same ratio gives less margin on a cheaper bottle. At ratio 1.6, selling at Privé −10%:

| US price | Margin at ratio 1.6 | Ratio needed for 15% | …with customs at the risk case |
|---|---|---|---|
| US$30 | −4% | 1.97 | 2.45 |
| US$60 | 9% | 1.72 | 2.20 |
| US$100 | 14% | 1.63 | 2.10 |
| US$200 | 18% | 1.55 | 2.03 |

**Gate on computed margin (≥ 15% at Privé −10%), not on the ratio alone.** Use the table as a shortcut: below US$60, a ratio of 1.6 is not enough. This hits the dupe lane hardest: Club de Nuit Intense (US$26.99, ratio 1.90) makes about L120 a sale (10%) with the coupon and loses money without it (A9 in [[assumptions]]).

## Coupon rule

Compute every ratio twice: at the discounter's coupon price and without the coupon. A bottle is a safe buy only if it still clears the gate without the coupon; otherwise it is a coupon-dependent buy ([[signals]], A14 in [[assumptions]]). Landed cost for margin: price × 1.07 + US$5, card 4.25% + US$0.35, L120 delivery, L25 packaging.

## Risk case

If customs charges 15% DAI + 15% ISV (modelled as +32% on the goods cost, ISV on top of DAI; the real base is the customs value, so this is an approximation), margins drop by about 15–20 points. The 15% target then needs a ratio of about 2.1 at US$100 and 2.2 at US$60 (table above).

**Correction 2026-11-23:** this note used to say no bottle reaches that. It was written before ADG was priced. ADG EDT 100 (2.28) and ADG EDP 75 (2.33) do: about 19% and 21% margin with the coupon and customs charged. Every other priced bottle falls to about 12% or less (La Vie Est Belle 12%, Most Wanted 1%, Eros EDP 0%, Profondo −1%). No bottle survives losing the coupon *and* paying customs (ADG EDT 2%, EDP 75 4%). Full table in [[signals]].

The 2-bottle test import settles customs: see [[decisions]].

## Known unknowns

- GBox accepting perfume (flammable liquid, written approval needed)
- Customs at repeated multi-bottle volume
- Demand at L20,000/month
- Whether best-seller ranks abroad predict Honduran sales

Related: [[candidates]], [[competitor-prive]], [[log]].
