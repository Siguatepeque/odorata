import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { NOTES, PRODUCTS, hasNote, type Lang } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop">): Promise<Metadata> {
  return { title: dict((await params).lang as Lang).shop.title };
}

export default async function Shop({ params, searchParams }: PageProps<"/[lang]/shop">) {
  const lang = (await params).lang as Lang;
  const t = dict(lang);
  return (
    <section className="section shop" aria-labelledby="shop-h">
      <div className="section-head">
        <h1 id="shop-h">{t.shop.title}</h1>
      </div>
      {/* The static shell shows the whole selection; the note filter resolves per request. */}
      <Suspense fallback={<Results lang={lang} />}>
        <Filtered lang={lang} searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function Filtered({ lang, searchParams }: { lang: Lang; searchParams: PageProps<"/[lang]/shop">["searchParams"] }) {
  const { nota } = await searchParams;
  return <Results lang={lang} noteId={typeof nota === "string" ? nota : undefined} />;
}

function Results({ lang, noteId }: { lang: Lang; noteId?: string }) {
  const t = dict(lang);
  const active = NOTES.find((n) => n.id === noteId);
  const list = active ? PRODUCTS.filter((p) => hasNote(p, active.id)) : PRODUCTS;
  return (
    <>
      <nav className="filters" aria-label={t.shop.filter}>
        <p className="filters-label">{t.shop.filter}</p>
        <ul>
          <li>
            <Link href={`/${lang}/shop`} className="chip" aria-current={!active ? "page" : undefined}>
              {t.shop.all}
            </Link>
          </li>
          {NOTES.map((n) => (
            <li key={n.id}>
              <Link href={`/${lang}/shop?nota=${n.id}`} className="chip" aria-current={active?.id === n.id ? "page" : undefined}>
                {n.name[lang]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="results" role="status">
        {t.shop.results(list.length)}
        {active && ` ${t.shop.withNote(active.name[lang].toLowerCase())}`}
      </p>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.handle} product={p} lang={lang} />
        ))}
      </div>
    </>
  );
}
