"use client";

import Link from "next/link";
import { totals, useBag } from "@/lib/bag";
import { lempiras, type Lang } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import Icon from "./Icon";

export default function BagButton({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const { count, subtotal } = totals(useBag());
  return (
    <Link href={`/${lang}/bag`} className="bag-btn" aria-label={`${t.nav.bag}: ${t.bag.items(count)}, ${lempiras(subtotal)}`}>
      <Icon name="bag" />
      <span>{t.nav.bag}</span>
      <span className="bag-count mono">{count}</span>
      {count > 0 && <span className="bag-total mono">{lempiras(subtotal)}</span>}
    </Link>
  );
}
