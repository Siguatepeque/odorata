import Link from "next/link";
import { LEVELS, alternativesTo, byLevel, lempiras, product, type Lang, type Product } from "@/lib/products";

const T = {
  es: {
    cheaper: "Alternativas más accesibles",
    inspired: "Inspirado en",
    less: (x: string) => `${x} menos`,
    save: (x: string) => `Ahorras ${x}.`,
    compare: (n: number) => `Comparar las ${n} alternativas`,
    similar: "Parecidos",
    original: "El original",
  },
  en: {
    cheaper: "More affordable alternatives",
    inspired: "Inspired by",
    less: (x: string) => `${x} less`,
    save: (x: string) => `You save ${x}.`,
    compare: (n: number) => `Compare all ${n} alternatives`,
    similar: "Similar",
    original: "The original",
  },
};

const Arrow = () => (
  <span className="notes-arrow" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 14 14">
      <path d="M2 7h9M7.5 3 11.5 7l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  </span>
);

/** One perfume as a hairline row: name and house on the left, price on the right, then the arrow. */
export function Row({ p, lang, detail, saving, note }: { p: Product; lang: Lang; detail?: string; saving?: number; note?: string }) {
  const t = T[lang];
  return (
    <Link href={`/${lang}/p/${p.handle}`} className="alt-row">
      <span className="alt-bottle" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- small cut-out; empty slot keeps rows aligned */}
        {p.photo && <img src={p.photo.src} alt="" width={p.photo.w} height={p.photo.h} loading="lazy" />}
      </span>
      <span className="alt-name">
        <strong>{p.name}</strong>
        <span>{detail ? `${p.house} · ${detail}` : p.house}</span>
        {note && <span className="alt-note">{note}</span>}
      </span>
      <span className="alt-price">
        <strong>{lempiras(p.price)}</strong>
        {saving ? <span>{t.less(lempiras(saving))}</span> : null}
      </span>
      <Arrow />
    </Link>
  );
}

/** Under the price: cheaper alternatives on an original, the original on an alternative. */
export function AltWidget({ product: p, lang }: { product: Product; lang: Lang }) {
  const t = T[lang];
  const alts = alternativesTo(p.handle);
  const original = p.inspiredBy && product(p.inspiredBy.handle);

  if (alts.length)
    return (
      <aside className="alt" aria-label={t.cheaper}>
        <p className="alt-title">{t.cheaper}</p>
        {alts.slice(0, 2).map((a) => (
          <Row key={a.handle} p={a} lang={lang} detail={LEVELS[a.inspiredBy!.level].name[lang]} saving={p.price - a.price} />
        ))}
        <a href="#parecidos" className="link alt-more">
          {t.compare(alts.length)} ↓
        </a>
      </aside>
    );

  if (original)
    return (
      <aside className="alt" aria-label={t.inspired}>
        <p className="alt-title">{t.inspired}</p>
        <Row p={original} lang={lang} />
        <p className="alt-verdict">
          <strong>{LEVELS[p.inspiredBy!.level].name[lang]}.</strong> {p.inspiredBy!.tradeoff[lang]}
          {original.price > p.price && <> {t.save(lempiras(original.price - p.price))}</>}
        </p>
      </aside>
    );

  return null;
}

/** Below the notes: the original, then every alternative grouped by how closely it follows it. */
export function Similar({ product: p, lang }: { product: Product; lang: Lang }) {
  const t = T[lang];
  const original = p.inspiredBy ? product(p.inspiredBy.handle) : undefined;
  const root = original ?? p;
  const alts = alternativesTo(root.handle).filter((a) => a.handle !== p.handle);
  if (!original && !alts.length) return null;

  return (
    <section id="parecidos" aria-labelledby="sim-h">
      <h2 id="sim-h" className="label">
        {t.similar}
      </h2>
      {original && (
        <div className="sim-tier">
          <h3>{t.original}</h3>
          <Row p={original} lang={lang} />
        </div>
      )}
      {byLevel(alts).map(({ level, items }) => (
        <div key={level} className="sim-tier">
          <h3>{LEVELS[level].name[lang]}</h3>
          <p className="sim-meaning">{LEVELS[level].meaning[lang]}</p>
          {items.map((a) => (
            <Row key={a.handle} p={a} lang={lang} saving={root.price - a.price} note={a.inspiredBy!.tradeoff[lang]} />
          ))}
        </div>
      ))}
    </section>
  );
}
