"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { add, totals, useBag } from "@/lib/bag";
import { dict } from "@/lib/i18n";
import { DELIVERY, lempiras, type Lang, type Product } from "@/lib/products";
import { Qty, openBag } from "./Bag";

// Price, quantity and the one action. On phones a slim bar keeps the action in reach
// once the main button scrolls away.
export default function BuyBox({ product: p, lang }: { product: Product; lang: Lang }) {
  const t = dict(lang);
  const bag = useBag();
  const inBag = bag.find((l) => l.handle === p.handle)?.qty ?? 0;
  const room = p.stock - inBag;
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const { count, subtotal } = totals(bag);
  const q = Math.max(1, Math.min(qty, room));

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(button.current!);
    return () => io.disconnect();
  }, []);

  const buy = () => {
    add(p.handle, q);
    setDone(true);
    setQty(1);
  };

  return (
    <div className="buy">
      <p className="buy-price">{lempiras(p.price)}</p>
      <p className="buy-note">
        {t.priceNote} {t.delivery(lempiras(DELIVERY.city.fee))}
      </p>
      <p className={p.stock ? "buy-stock" : "buy-stock out"}>{p.stock ? t.left(p.stock) : t.soldOut}</p>

      <div className="buy-row">
        <Qty value={q} max={Math.max(1, room)} onChange={setQty} label={t.qty} lang={lang} />
        <button ref={button} type="button" className="btn btn-solid" disabled={room <= 0} onClick={buy}>
          {room <= 0 && p.stock === 0 ? t.soldOut : t.add}
        </button>
      </div>

      <p className="buy-pay">
        {t.pay}{" "}
        <Link href={`/${lang}/como-comprar`} className="link">
          {t.terms.link}
        </Link>
      </p>

      <div role="status" className="buy-status">
        {done && (
          <p>
            <strong>{t.added}.</strong> {t.bag.items(count)} · {lempiras(subtotal)}.{" "}
            <button type="button" className="link" onClick={openBag}>
              {t.bag.title}
            </button>
          </p>
        )}
      </div>

      <div className="buy-bar" data-show={showBar || undefined} aria-hidden={!showBar}>
        <span>
          <strong>{p.name}</strong> {lempiras(p.price)}
        </span>
        <button type="button" className="btn btn-solid" tabIndex={showBar ? 0 : -1} disabled={room <= 0} onClick={buy}>
          {t.add}
        </button>
      </div>
    </div>
  );
}

// The landing page's one-tap add, with the same confirmation language.
export function QuickAdd({ product: p, lang }: { product: Product; lang: Lang }) {
  const t = dict(lang);
  const inBag = useBag().find((l) => l.handle === p.handle)?.qty ?? 0;
  const [done, setDone] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn btn-solid"
        disabled={inBag >= p.stock}
        onClick={() => {
          add(p.handle);
          setDone(true);
          openBag();
        }}
      >
        {p.stock ? `${t.add} · ${lempiras(p.price)}` : t.soldOut}
      </button>
      <span role="status" className="sr-only">
        {done ? `${t.added}: ${p.name}` : ""}
      </span>
    </>
  );
}
