import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, LANGS } from "@/lib/i18n";
import { PRODUCTS, product, type Lang } from "@/lib/products";
import AccordStage from "@/components/AccordStage";
import FitText from "@/components/FitText";
import BuyBox from "@/components/BuyBox";

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

          <section aria-labelledby="notes-h">
            <h2 id="notes-h" className="label">
              {t.pyramid.title}
            </h2>
            <dl className="rows">
              <div>
                <dt>{t.pyramid.top}</dt>
                <dd>{p.pyramid.top[lang]}</dd>
              </div>
              <div>
                <dt>{t.pyramid.heart}</dt>
                <dd>{p.pyramid.heart[lang]}</dd>
              </div>
              <div>
                <dt>{t.pyramid.base}</dt>
                <dd>{p.pyramid.base[lang]}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="details-h">
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
    </article>
  );
}
