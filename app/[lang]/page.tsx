import Link from "next/link";
import { dict } from "@/lib/i18n";
import { DELIVERY, lempiras, product, type Lang } from "@/lib/products";
import AccordStage from "@/components/AccordStage";
import FitText from "@/components/FitText";
import { QuickAdd } from "@/components/BuyBox";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Lang;
  const t = dict(lang);
  const p = product("liquid-brun")!;
  const href = `/${lang}/p/${p.handle}`;

  return (
    <>
      <section className="announce" aria-labelledby="announce-h">
        <div className="announce-head">
          <FitText>{p.name}</FitText>
          <p id="announce-h" className="announce-sub">
            {lang === "es" ? `de ${p.house} llegó a Marginalia` : `by ${p.house} has arrived at Marginalia`}
          </p>
        </div>
        <AccordStage product={p} lang={lang} priority />
        <div className="announce-foot">
          <p className="announce-desc">
            {lang === "es" ? "Canela, vainilla bourbon y praliné." : "Cinnamon, bourbon vanilla and praline."}{" "}
            <span>
              {p.type[lang]}, {p.ml} ml.
            </span>
          </p>
          <p className="announce-price">{lempiras(p.price)}</p>
          <div className="announce-actions">
            <Link href={href} className="btn btn-line">
              {t.view}
            </Link>
            <QuickAdd product={p} lang={lang} />
          </div>
        </div>
        <p className="reassure">
          {t.terms.short(lempiras(DELIVERY.city.fee))}{" "}
          <Link href={`/${lang}/como-comprar`}>{t.terms.link}</Link>
        </p>
      </section>
    </>
  );
}
