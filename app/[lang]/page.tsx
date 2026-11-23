import Link from "next/link";
import { DEPARTMENTS, delivery, lempiras, NOTES, PRODUCTS, hasNote, product, type Lang } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import Feature from "@/components/Feature";
import ProductCard from "@/components/ProductCard";
import GlyphTile from "@/components/GlyphTile";
import Icon from "@/components/Icon";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Lang;
  const t = dict(lang);
  const city = delivery("Francisco Morazán");
  const rest = delivery("Olancho");

  return (
    <>
      <Feature product={product("peonia-nocturna")!} lang={lang} hook={t.hook} />

      <section id="notas" className="section" aria-labelledby="notas-h">
        <div className="section-head">
          <h2 id="notas-h">{t.indexTitle}</h2>
          <p>{t.indexLead}</p>
        </div>
        <ol className="index">
          {NOTES.map((n) => {
            const count = PRODUCTS.filter((p) => hasNote(p, n.id)).length;
            return (
              <li key={n.id}>
                <Link href={`/${lang}/shop?nota=${n.id}`} className="index-row" style={{ "--tint": n.tint } as React.CSSProperties}>
                  <span className="index-tile">
                    <GlyphTile note={n} x={0.5} y={0.5} z={1.15} cell={6} />
                  </span>
                  <span className="index-no mono">No. {n.no}</span>
                  <span className="index-name">{n.name[lang]}</span>
                  <span className="index-smell">{n.smell[lang]}</span>
                  <span className="index-count">
                    {t.fragrances(count)} <Icon name="arrow" size={18} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="section" aria-labelledby="sel-h">
        <div className="section-head">
          <h2 id="sel-h">{t.selectionTitle}</h2>
          <p>{t.selectionLead}</p>
        </div>
        <div className="grid">
          {PRODUCTS.slice(1, 7).map((p) => (
            <ProductCard key={p.handle} product={p} lang={lang} />
          ))}
        </div>
        <Link href={`/${lang}/shop`} className="btn btn-outline btn-wide">
          {t.seeAll} <Icon name="arrow" />
        </Link>
      </section>

      <section id="como-comprar" className="section how" aria-labelledby="how-h">
        <div className="section-head">
          <h2 id="how-h">{t.how.title}</h2>
        </div>
        <ol className="steps">
          {t.how.steps.map(([title, body], i) => (
            <li key={title}>
              <span className="step-no mono">{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <div className="terms">
          <table>
            <caption>{t.bag.delivery}</caption>
            <tbody>
              <tr>
                <th scope="row">Francisco Morazán · Cortés</th>
                <td className="mono">{lempiras(city.fee)}</td>
                <td>{city.days[lang]}</td>
              </tr>
              <tr>
                <th scope="row">{lang === "es" ? `Otros ${DEPARTMENTS.length - 2} departamentos` : `Other ${DEPARTMENTS.length - 2} departments`}</th>
                <td className="mono">{lempiras(rest.fee)}</td>
                <td>{rest.days[lang]}</td>
              </tr>
            </tbody>
          </table>
          <ul className="pay-list">
            {(["cod", "transfer", "card"] as const).map((k) => (
              <li key={k}>
                <strong>{t.checkout.pay[k][0]}</strong>
                <span>{t.checkout.pay[k][1]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
