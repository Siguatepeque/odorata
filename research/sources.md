# Sources and how to read them

Popularity decides what we consider ([[candidates]]); price ratios decide what we buy ([[pricing-filter]]).

## Popularity (assortment source)

- **Jomashop best sellers**: `https://www.jomashop.com/fragrances.html?sort=best_sellers`. Page text loads all ~50 items after scrolling. Shows US discount-shopper demand and is rewarded by big discounts. Used 2026-11-23.
- **Fragrantica**: popularity among enthusiasts (votes, review counts). The awards pages only list new releases. Use perfume pages: `fragrantica.com/perfume/<Brand>/<Name>-<id>.html` shows "Perfume rating X out of 5 with N votes". Designer pages (`/designers/<Brand>.html`) list perfume URLs, so a paced loop in the browser can collect votes; votes are lifetime and some names match a sibling scent. Pulled 2026-11-23 for 30 pages ([[signals]]).
- **Not useful**: FragranceX "best sellers" (`/shopping/best-selling-perfumes/`): gender filter ignored, mostly old classics (Light Blue, White Diamonds, Eternity). Blog "best of" pages are affiliate content with no unit sales.

## US buy prices

- **Jomashop**: cheapest for designer; coupons apply automatically (20% on many). Search dropdown shows price after coupon; the old `catalogsearch` URL 404s; submit the search box (type twice, the first keystrokes after a page load are dropped) and the results are at `/search?q=<terms>` (scroll to load all). Direct GraphQL calls were blocked: do not use them.
- **Venba Fragrance** (`venbafragrance.com`): niche (PdM). Product data at `/products/<brand>-<name>-edp.js` (sizes, prices, availability). Gray-market risk (testers, batch codes); stock intermittent. 2026-11-23: Althaïr in stock US$229.99; Layton, Pegasus, Libre, MYSLF out.
- **Olfactory Factory**: `olfactoryfactory.com` is now a parked domain for sale, so the 22 Nov source needs a new URL or should be dropped.
- **FragranceNet / FragranceX**: never cheapest on the 11 bottles checked.
- **MaxAroma**: blocked automated access, unchecked.

## Local price benchmark

- **Privé Perfumes** (`priveperfumes.com`): read with the store set to Honduras, not the US view. Best sellers: `/collections/all?sort_by=best-selling&filter.v.availability=1`. See [[competitor-prive]].
  - **Full catalog snapshot:** `data/prive-YYYY-MM-DD.csv` (one row per variant: brand, title, size, price in L, compare_at, available, gender, concentration, dates). First snapshot 2026-11-23: 8,235 variants, 3,826 in-stock fragrance SKUs, 216 brands; ADG EDT 100 ml = L4,059, confirming the Honduras view.
  - **How to refresh:** open priveperfumes.com in the Honduras-localized Chrome session and page through `/products.json?limit=250&page=N` (about 700 ms apart), then save a CSV from the page. A Python script from this machine gets HTTP 429 even on page 1, so don't script it outside the browser; don't hammer it.
  - Stock = the `available` column only. Do NOT filter on price: only 4 rows carry the L9,999 placeholder, and a price cut-off drops real bottles above L9,999 (Aventus L13,620, Tom Ford L11,375). I made exactly that mistake on 2026-11-23 and wrongly reported Aventus as out of stock.
  - Snapshots are the base for any competitor statistic: compare a new one against the previous to see price moves, stockouts and new arrivals.

## Fixed inputs

- FX L26.8/US$ (BCH via El Heraldo, June; Privé uses about 26.86). GBox US$5/bottle assumed.

Related: [[README]], [[log]].
