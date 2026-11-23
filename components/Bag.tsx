"use client";

import { useEffect, useRef, useState } from "react";
import { setQty, totals, useBag } from "@/lib/bag";
import { dict } from "@/lib/i18n";
import { DELIVERY, lempiras, product, type Lang } from "@/lib/products";

// One way to open the bag from anywhere on the page.
export const openBag = () => dispatchEvent(new Event("bag:open"));

export function BagButton({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const { count } = totals(useBag());
  return (
    <button type="button" className="bag-button" onClick={openBag} aria-haspopup="dialog">
      {t.nav.bag} <span className="bag-count">{count}</span>
    </button>
  );
}

export function Qty({ value, max, onChange, label, lang }: { value: number; max: number; onChange: (n: number) => void; label: string; lang: Lang }) {
  const t = dict(lang);
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t.less}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t.more}>
        +
      </button>
    </div>
  );
}

// The bag as a side sheet: native <dialog>, so focus, Escape and the backdrop come for free.
export function BagSheet({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const ref = useRef<HTMLDialogElement>(null);
  const bag = useBag();
  const [open, setOpen] = useState(false);
  const { count, subtotal } = totals(bag);

  useEffect(() => {
    const show = () => {
      ref.current?.showModal();
      setOpen(true);
    };
    addEventListener("bag:open", show);
    return () => removeEventListener("bag:open", show);
  }, []);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="bag-title"
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      {open && (
        <div className="sheet-inner">
          <header className="sheet-head">
            <h2 id="bag-title">
              {t.bag.title} <span>{t.bag.items(count)}</span>
            </h2>
            <button type="button" className="link" onClick={() => ref.current?.close()}>
              {t.bag.close}
            </button>
          </header>

          {count === 0 ? (
            <p className="sheet-empty">{t.bag.empty}</p>
          ) : (
            <>
              <ul className="lines">
                {bag.map((l) => {
                  const p = product(l.handle)!;
                  return (
                    <li key={l.handle}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- small cut-out thumbnail */}
                      <img src={p.photo.src} alt="" width={36} height={100} />
                      <div className="line-text">
                        <strong>{p.name}</strong>
                        <span>
                          {p.house} · {p.type[lang]} · {p.ml} ml
                        </span>
                        <div className="line-row">
                          <Qty value={l.qty} max={p.stock} onChange={(n) => setQty(p.handle, n)} label={`${t.qty}: ${p.name}`} lang={lang} />
                          <button type="button" className="link" onClick={() => setQty(p.handle, 0)}>
                            {t.bag.remove}
                          </button>
                        </div>
                      </div>
                      <span className="line-total">{lempiras(p.price * l.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              <dl className="sums">
                <div>
                  <dt>{t.bag.subtotal}</dt>
                  <dd>{lempiras(subtotal)}</dd>
                </div>
                <div>
                  <dt>{t.bag.shipping}</dt>
                  <dd>{t.bag.shippingFrom(lempiras(DELIVERY.city.fee))}</dd>
                </div>
                <div className="sums-total">
                  <dt>{t.bag.total}</dt>
                  <dd>{lempiras(subtotal + DELIVERY.city.fee)}</dd>
                </div>
              </dl>
              <button type="button" className="btn btn-solid" disabled aria-describedby="checkout-note">
                {t.bag.checkout}
              </button>
              <p id="checkout-note" className="sheet-note">
                {t.bag.checkoutNote}
              </p>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
