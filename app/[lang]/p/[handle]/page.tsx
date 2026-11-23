import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, LANGS } from "@/lib/i18n";
import { NOTES, PRODUCTS, product, type Lang } from "@/lib/products";
import AccordStage from "@/components/AccordStage";
import FitText from "@/components/FitText";
import BuyBox from "@/components/BuyBox";
import PreviewSwitch from "@/components/PreviewSwitch";

export const generateStaticParams = () => LANGS.flatMap((lang) => PRODUCTS.map((p) => ({ lang, handle: p.handle })));

export async function generateMetadata({ params }: PageProps<"/[lang]/p/[handle]">): Promise<Metadata> {
  const p = product((await params).handle);
  return p ? { title: `${p.name}, ${p.house}` } : {};
}

export default async function ProductPage({ params }: PageProps<"/[lang]/p/[handle]">) {
  const { lang: l, handle } = await params;
  const lang = l as Lang;
  const p = product(handle);
  if (!p) notFound();
  const t = dict(lang);

  return (
    <article className="pdp">
      <header className="pdp-head">
        <FitText>{p.name}</FitText>
        <p className="pdp-line">
          <span>{p.house}</span>
          <span>
            {p.type[lang]} · {p.ml} ml · {p.year}
          </span>
        </p>
        {/* ponytail: details as tags vs table under review (?ver=1); keep one */}
        <dl className="pdp-tags">
          {p.facts.slice(0, 3).map((f) => (
            <div key={f.label.es}>
              <dt>{f.label[lang]}</dt>
              <dd>{f.value[lang]}</dd>
            </div>
          ))}
        </dl>
      </header>

      <AccordStage product={p} lang={lang} priority />

      <div className="pdp-body">
        <BuyBox product={p} lang={lang} />

        <div className="pdp-info">
          <section aria-labelledby="about-h">
            <h2 id="about-h" className="label">
              {t.about}
            </h2>
            <p className="about">{p.about[lang]}</p>
          </section>

          <section id="notas" aria-labelledby="notes-h">
            <h2 id="notes-h" className="label">
              {t.pyramid.title}
            </h2>
            <div className="tiers">
              {(["top", "heart", "base"] as const).map((tier) => (
                <div key={tier} className="tier">
                  <h3>{t.pyramid[tier]}</h3>
                  <ul className="notes">
                    {p.pyramid[tier].map(([id, level]) => (
                      <li key={id} data-level={level}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- small square ingredient photo */}
                        <img src={NOTES[id].img} alt="" width={160} height={160} loading="lazy" />
                        <span>
                          {NOTES[id].name[lang]}
                          {level !== 2 && <span className="sr-only">, {level === 3 ? t.pyramid.lead : t.pyramid.subtle}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="details-table" aria-labelledby="details-h">
            <h2 id="details-h" className="label">
              {t.details}
            </h2>
            <dl className="rows">
              {p.facts.map((f) => (
                <div key={f.label.es}>
                  <dt>{f.label[lang]}</dt>
                  <dd>{f.value[lang]}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
      <PreviewSwitch />
    </article>
  );
}
