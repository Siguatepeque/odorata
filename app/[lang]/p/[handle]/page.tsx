import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS } from "@/lib/dict";
import { PRODUCTS, note, product, hasNote, type Lang, type Tier } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import Feature from "@/components/Feature";
import ProductCard from "@/components/ProductCard";

export const generateStaticParams = () => LANGS.flatMap((lang) => PRODUCTS.map((p) => ({ lang, handle: p.handle })));

export async function generateMetadata({ params }: PageProps<"/[lang]/p/[handle]">): Promise<Metadata> {
  const p = product((await params).handle);
  return { title: p ? `${p.name} · ${p.house}` : undefined };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/p/[handle]">) {
  const { lang: l, handle } = await params;
  const lang = l as Lang;
  const p = product(handle);
  if (!p) notFound();
  const t = dict(lang);
  const related = PRODUCTS.filter((x) => x.handle !== p.handle && hasNote(x, p.chord.heart.lead)).slice(0, 3);

  return (
    <>
      <Feature product={p} lang={lang} />

      <section className="section" aria-labelledby="about-h">
        <div className="section-head">
          <h2 id="about-h">{t.facts.smells}</h2>
          <p className="about">{p.about[lang]}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{t.facts.family}</dt>
            <dd>{p.family[lang]}</dd>
          </div>
          <div>
            <dt>{t.facts.wear}</dt>
            <dd>{p.wear[lang]}</dd>
          </div>
          <div>
            <dt>{t.facts.lasts}</dt>
            <dd>{p.lasts[lang]}</dd>
          </div>
          <div>
            <dt>{t.facts.type}</dt>
            <dd>
              {t.type[p.type]}
              <span className="fact-help">{t.typeHelp[p.type]}</span>
            </dd>
          </div>
          <div>
            <dt>{t.facts.size}</dt>
            <dd className="mono">{p.ml} ml</dd>
          </div>
        </dl>
        <ol className="chord-list">
          {(["top", "heart", "base"] as Tier[]).map((k) => {
            const n = note(p.chord[k].lead);
            return (
              <li key={k} style={{ "--tint": n.tint } as React.CSSProperties}>
                <span className="tier-label">{t.tiers[k]}</span>
                <span className="mono">No. {n.no}</span>
                <strong>
                  {n.name[lang]}, {p.chord[k].also[lang]}
                </strong>
                <span>{n.smell[lang]}</span>
              </li>
            );
          })}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="section" aria-labelledby="rel-h">
          <div className="section-head">
            <h2 id="rel-h">{lang === "es" ? `También con ${note(p.chord.heart.lead).name.es.toLowerCase()}` : `Also with ${note(p.chord.heart.lead).name.en.toLowerCase()}`}</h2>
          </div>
          <div className="grid">
            {related.map((x) => (
              <ProductCard key={x.handle} product={x} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
