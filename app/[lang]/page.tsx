import Link from "next/link";
import { dict } from "@/lib/i18n";
import { DELIVERY, lempiras, type Lang } from "@/lib/products";
import Catalog from "@/components/Catalog";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Lang;
  const t = dict(lang);

  return (
    <section className="catalog" aria-labelledby="catalog-h">
      <h1 id="catalog-h" className="section-title">
        {t.nav.fragrances}
      </h1>
      <Catalog lang={lang} />
      <p className="reassure">
        {t.terms.short(lempiras(DELIVERY.city.fee))} <Link href={`/${lang}/como-comprar`}>{t.terms.link}</Link>
      </p>
    </section>
  );
}
