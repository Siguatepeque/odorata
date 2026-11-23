# Assumptions and stress tests

Nothing in this folder is truth. Each claim below is a hypothesis with a way to break it. Run the oldest test first. When a test result changes a conclusion, update [[candidates]] or [[pricing-filter]] and write it in [[log]].

Confidence: **low** (one observation), **med** (checked twice or from two sources), **high** (verified at the source and repeatable).

| # | Claim we rely on | Conf. | How it could be wrong | Test | Last run | Result |
|---|---|---|---|---|---|---|
| A1 | Ratio ≥ 1.6 means about 15% margin at Privé −10% | **broken (partly)** | Privé discounts weekly, so "Privé price" moves; our price may need to chase it. **Also: about L290 per bottle is fixed cost, so the rule only holds for bottles of about US$100+** | Re-read Privé for the 10 passing bottles every 2 weeks, outside sale periods | 11-23 | Recomputed 11-23: at ratio 1.6, margin is −4% at US$30, 9% at US$60, 14% at US$100, 18% at US$200. Gate now on computed margin ([[pricing-filter]]). Black Month sale running: ratios still need the January retest |
| A2 | Jomashop coupon prices are repeatable | low | Black Friday week prices, coupons expire, stock "limited quantity" | Re-read the same 10 bottles after 5 Dec and again mid-January | 11-23 | Stress-tested 11-23: without the coupon only ADG EDT and EDP 75 keep a clear margin ([[signals]]). Durability itself unconfirmed |
| A3 | Customs charges L0 on repeated shipments | low | Owner's personal-use experience only; legal rate 15% DAI + 15% ISV | 2-bottle test import, keep every receipt | never | Open. Not fatal on its own: ADG EDT and EDP 75 keep about 19–21% with customs charged; every other bottle drops to about 12% or less ([[signals]]) |
| A4 | GBox ships perfume | low | Flammable liquid, written approval required | One WhatsApp message; ask air vs sea | never | Open |
| A5 | US best sellers predict Honduran demand | low | Jomashop ranking rewards discounts; Honduran taste may differ; Privé's own list is mostly cheap dupes | Compare the Jomashop top 50 with Privé's top 36 and with what we actually sell | 11-23 | Overlap is partial: Aventus, Y, Eros, Born in Roma and Club de Nuit Intense appear on both, Liquid Brun and the Rayhaan line only on Jomashop. Real test is our own sales |
| A6 | Privé is the only price benchmark that matters | low | Instagram/WhatsApp sellers, grey-market resellers, and Honduran Amazon-style buyers may undercut both | Search 3 local Instagram sellers for the top 5 bottles | never | Open |
| A7 | One size/concentration per bottle is enough | med | Eros EDP 1.84 vs EDT 1.57 shows ratios swing by concentration and size | Price at least two sizes of every pass bottle | 11-23 | Only Eros checked both |
| A8 | ADG EDT 100 ml is a margin winner (2.28) | low | One shop, one size, sale week; not on either best-seller list, so demand unproven; maybe overpriced at Privé because it rarely sells | Price ADG at 2 more sources; ask whether anyone in Honduras actually buys it | 11-23 | One observation only |
| A9 | Cheap dupes (US$18–40) are worth carrying | **low, weakening** | Margin per sale is a few hundred lempiras; GBox US$5/bottle is a big share of a US$25 bottle | Compute margin per sale at Privé price and landed cost, with freight at US$5 and US$8 | 11-23 (US$5 only) | Club de Nuit Intense at Privé −10%: about L120 (10%) with the coupon, −6% without. Only worth carrying as an add-on to a designer order, if at all. US$8 freight not yet run |
| A10 | FX L26.8 and freight US$5/bottle | med | FX from June; freight assumes 1–1.5 lb bottle | Re-read BCH rate; weigh one real bottle | never | Open |
| A11 | Authentic stock from Venba/Olfactory Factory | low | Gray-market, testers, batch codes | Check batch codes on first niche bottle against a genuine one | never | Open |
| A12 | Dupe "levels" (closest/dna/vibe) and trade-offs on the site | low | Written from reviewer consensus summaries, not our own wear tests | Wear-test each dupe; compare against the three most-cited reviews | never | Open |
| A13 | Buying complete product lines helps a reseller | low | Demand drops per flanker; some variants fail the gate; capital; no wholesale terms | Ask customers which variants they want; test one flanker at a time | 11-23 | Reasoned from data in [[decisions]], not tested with customers |
| A14 | Jomashop's 20% coupon will still be there | low | Third-party pages are inconsistent; some 20% offers are code-based | Re-read after 5 Dec and mid-January; note the coupon each time | 11-23 | Unconfirmed |
| A15 | Fragrantica votes measure demand | low | Lifetime votes favor old scents; some pages matched a sibling (Eau Sauvage, Absolu Aventus, L'Homme Libre) | Check the matched URL for each bottle; compare with sales | 11-23 | Used as a ranking signal only |
| A16 | Privé's gap (absent or out of stock) means opportunity | low | Absence can mean no demand, or no legitimate supply (Louis Vuitton) | Check a legitimate discounted source exists before treating a gap as a buy | 11-23 | Imagination: no legitimate source found |

## Stress tests to run next (cheapest first)

1. Re-read all A1/A2 prices after 5 December (sale over) and compare with 11-23.
2. Price ADG EDP and Parfum plus a second size (A7, A8).
3. Price the unchecked Jomashop best sellers against Privé ([[candidates]], "Popular but no local price yet").
4. Margin at US$8 freight (customs risk case done 11-23: only ADG EDT and EDP 75 pass, [[signals]]).
5. Ask who is actually selling Aventus, Y and ADG locally outside Privé (A6).

## How to challenge a note

- When you read a number, ask when and where it came from. No date or source means untrusted.
- Try to make the claim fail, not to confirm it. Look for the sale, the other size, the other seller.
- If two notes disagree, fix both and log it.
- Prefer deleting a claim to keeping a stale one.

Related: [[README]], [[candidates]], [[sources]], [[log]].
