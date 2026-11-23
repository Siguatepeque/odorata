# Odorata research network

Start with [[decisions]]. Plain markdown notes, linked with `[[name]]` (= `research/name.md`).

| Note | What it holds | Update when |
|---|---|---|
| [[decisions]] | Current recommendation, first purchase, what only the owner can settle. Start here | Whenever a re-read changes the answer |
| [[pricing-filter]] | Cost basis, the buy/no-buy ratio rule, risk case | Cost inputs change (tax, freight, customs, FX) |
| [[sources]] | Where each kind of data comes from and how to read it | A source breaks or a better one appears |
| [[candidates]] | Every bottle considered: US price, local price, ratio, status | Every price check (at least weekly in sale season) |
| [[competitor-prive]] | What Privé stocks, prices, best sellers | Monthly, or before pricing a bottle |
| [[signals]] | The per-bottle table: margin, demand, Privé gap as separate columns, plus the coupon stress test | Each price or stock check |
| [[discounters]] | Which US discounter is readable and cheapest, with a compare table | Each price check; add sources as they open up |
| [[assumptions]] | Every claim we depend on, how it could be wrong, the test, last result | Every session: run the oldest test, record the result |
| [[log]] | Dated entries: what was checked and what changed | Every research session, newest on top |

## Stance

These notes are working hypotheses, not a source of truth. Each is meant to be challenged, stress-tested and rewritten, not trusted. See [[assumptions]].

- **Stale rule:** a price older than 14 days (7 during sales: Black Friday, Christmas) counts as unchecked. Re-read it before acting on it.
- **Every session** should try to break at least one claim in [[assumptions]] and log the outcome, even if the claim survives.
- A result that contradicts a note beats the note. Change the note the same day.
- Single observations stay marked **low** confidence until repeated at another time or source.

## Rules

- Assortment comes from online popularity (Jomashop best sellers, Fragrantica), never from copying Privé. Privé is only the price benchmark. See [[sources]].
- Every price carries a date and a source. A number without both goes stale silently.
- A bottle's status in [[candidates]] changes only with a new dated number, not a hunch.
- Dupe levels and trade-offs written to the site (`lib/products.ts`) summarize reviewer consensus. Research here can propose them, not decide them.
- New session: read [[log]] first, then update [[candidates]], then add a log entry.

Strategy background (cost basis, L20k/month goal, checkpoints): Claude Doc "Fragrance retail Honduras: strategy research", tab "Reassessment".
