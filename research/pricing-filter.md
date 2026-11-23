# Pricing filter

Used by [[candidates]]. Inputs verified 2026-11-22/23; see [[sources]] for where each came from.

## Cost basis (landed, per bottle)

US price after coupon × 1.07 (Miami sales tax, unavoidable) + US$5 GBox freight, × L26.8/US$. Customs: L0 in the base case (owner's experience, unverified at commercial volume).

Other costs per order: card 4.25% + US$0.35 (Tilopay), delivery L120 absorbed, packaging L25. Shopify about US$39/month fixed.

## The rule

Ratio = Privé price ÷ (cheapest verified US price × 26.8).

| Ratio | Meaning |
|---|---|
| ≥ 1.6 designer / ≥ 1.55 niche | Passes: about 15%+ margin selling 10% below Privé |
| 1.25–1.6 | Thin: only worth it as an add-on or at Privé's price |
| < 1.25 designer / < 1.15 niche | Break-even or loss |

Where Privé doesn't stock it, use the price we would charge instead of Privé's.

## Coupon rule

Compute every ratio twice: at the discounter's coupon price and without the coupon. A bottle is a safe buy only if it still clears the gate without the coupon; otherwise it is a coupon-dependent buy ([[signals]], A14 in [[assumptions]]). Landed cost for margin: price × 1.07 + US$5, card 4.25% + US$0.35, L120 delivery, L25 packaging.

## Risk case

If customs charges 15% DAI + 15% ISV, subtract 15–18 points of margin from everything. Then the 15% target needs about 2.1× / 2.0×, and no bottle reaches it. Test import of 2 bottles settles this: see "What to verify next" in the strategy doc.

## Known unknowns

- GBox accepting perfume (flammable liquid, written approval needed)
- Customs at repeated multi-bottle volume
- Demand at L20,000/month
- Whether best-seller ranks abroad predict Honduran sales

Related: [[candidates]], [[competitor-prive]], [[log]].
