"use client";

import Link from "next/link";
import { useState } from "react";
import { add, totals, useBag } from "@/lib/bag";
import { lempiras, type Lang, type Product } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import Icon from "./Icon";

// Add with an explicit confirmation: what happened, what the bag holds now, and both next steps.
export default function AddToBag({ product: p, lang, compact = false }: { product: Product; lang: Lang; compact?: boolean }) {
  const t = dict(lang);
  const bag = useBag();
  const [done, setDone] = useState(false);
  const inBag = bag.find((l) => l.handle === p.handle)?.qty ?? 0;
  const full = inBag >= p.stock;
  const { count, subtotal } = totals(bag);

  if (p.stock === 0)
    return (
      <button type="button" className={compact ? "btn btn-card" : "btn btn-band"} disabled>
        {t.soldOut}
      </button>
    );

  return (
    <div className="add">
      <button
        type="button"
        className={compact ? "btn btn-card" : "btn btn-band"}
        disabled={full}
        aria-label={compact ? `${t.add}: ${p.name}` : undefined}
        onClick={() => {
          add(p.handle);
          setDone(true);
        }}
      >
        <Icon name={done ? "check" : "bag"} />
        {compact ? (lang === "es" ? "Agregar" : "Add") : t.add}
      </button>
      <div role="status" className="add-status">
        {done && !compact && (
          <div className="added">
            <p>
              <strong>{t.added}</strong> · {t.bag.items(count)} · {lempiras(subtotal)}
            </p>
            <div className="added-actions">
              <Link href={`/${lang}/bag`} className="btn btn-paper">
                {t.viewBag}
              </Link>
              <button type="button" className="btn btn-ghost-band" onClick={() => setDone(false)}>
                {t.keepShopping}
              </button>
            </div>
          </div>
        )}
        {done && compact && <span className="added-chip">{t.added} ({inBag})</span>}
      </div>
    </div>
  );
}
