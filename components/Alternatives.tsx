import Link from "next/link";
import { LEVELS, alternativesTo, byLevel, lempiras, product, type Lang, type Level, type Product } from "@/lib/products";

const T = {
  es: { cheaper: "Alternativas más accesibles", inspired: "Inspirado en", save: (x: string) => `ahorras ${x}`, saveVs: (x: string) => `Ahorras ${x} frente al original.`, compare: "Comparar todas", similar: "Parecidos", original: "El original", others: "Otras alternativas" },
  en: { cheaper: "More affordable alternatives", inspired: "Inspired by", save: (x: string) => `you save ${x}`, saveVs: (x: string) => `You save ${x} versus the original.`, compare: "Compare all", similar: "Similar", original: "The original", others: "Other alternatives" },
};

const Arrow = () => (
  <span className="notes-arrow" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 14 14">
      <path d="M2 7h9M7.5 3 11.5 7l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  </span>
);

function Row({ p, lang, vs, level }: { p: Product; lang: Lang; vs: Product; level?: Level }) {
  const t = T[lang];
  const cheap = p.price < vs.price ? p : vs;
  const dear = cheap === p ? vs : p;
  return (
    <Link href={`/${lang}/p/${p.handle}`} className="alt-row">
      {level && <span className="alt-level">{LEVELS[level].name[lang]}</span>}
      <span className="alt-name">
        <strong>{p.name}</strong> · {p.house}
      </span>
      <span className="alt-price">
        {lempiras(p.price)}
        {cheap === p && <em>{t.save(lempiras(dear.price - cheap.price))}</em>}
      </span>
      <Arrow />
    </Link>
  );
}

/** The small block under the price: cheaper alternatives on an original, the original on an alternative. */
export function AltWidget({ product: p, lang }: { product: Product; lang: Lang }) {
  const t = T[lang];
  const alts = alternativesTo(p.handle);
  const original = p.inspiredBy && product(p.inspiredBy.handle);

  if (alts.length)
    return (
      <aside className="alt" aria-label={t.cheaper}>
        <p className="alt-title">{t.cheaper}</p>
        {alts.slice(0, 2).map((a) => (
          <Row key={a.handle} p={a} lang={lang} vs={p} level={a.inspiredBy!.level} />
        ))}
        <a href="#parecidos" className="link alt-more">
          {t.compare} ({alts.length}) ↓
        </a>
      </aside>
    );

  if (original)
    return (
      <aside className="alt" aria-label={t.inspired}>
        <p className="alt-title">{t.inspired}</p>
        <Row p={original} lang={lang} vs={p} />
        <p className="alt-trade">
          <strong>{LEVELS[p.inspiredBy!.level].name[lang]}.</strong> {p.inspiredBy!.tradeoff[lang]}{" "}
          {original.price > p.price && <em>{t.saveVs(lempiras(original.price - p.price))}</em>}
        </p>
      </aside>
    );

  return null;
}

function Card({ p, lang, vs }: { p: Product; lang: Lang; vs?: Product }) {
  const t = T[lang];
  const saving = vs && p.price < vs.price ? vs.price - p.price : 0;
  return (
    <li>
      <Link href={`/${lang}/p/${p.handle}`} className="sim-card">
        <span className="sim-tile">
          {p.photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- small cut-out
            <img src={p.photo.src} alt="" width={p.photo.w} height={p.photo.h} loading="lazy" />
          ) : (
            <span className="sim-initials" aria-hidden="true">
              {p.house
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
          )}
        </span>
        <span className="sim-text">
          <strong>{p.name}</strong>
          <span>{p.house}</span>
          <span className="sim-price">
            {lempiras(p.price)}
            {saving > 0 && <em>{t.save(lempiras(saving))}</em>}
          </span>
          {p.inspiredBy && <span className="sim-trade">{p.inspiredBy.tradeoff[lang]}</span>}
        </span>
      </Link>
    </li>
  );
}

/** Full comparison below the notes, grouped by how closely each one follows the original. */
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
          <ul className="sim-list">
            <Card p={original} lang={lang} />
          </ul>
        </div>
      )}
      {byLevel(alts).map(({ level, items }) => (
        <div key={level} className="sim-tier">
          <h3>{LEVELS[level].name[lang]}</h3>
          <p className="sim-meaning">{LEVELS[level].meaning[lang]}</p>
          <ul className="sim-list">
            {items.map((a) => (
              <Card key={a.handle} p={a} lang={lang} vs={root} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
