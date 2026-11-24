import Link from "next/link";
import { PRODUCTS, type Lang } from "@/lib/products";
import { Card } from "@/components/Catalog";
import Story from "@/components/Story";

export default async function Landing({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Lang;
  const es = lang === "es";

  return (
    <article className="home">
      <Story lang={lang} />
      <section className="home-section" aria-labelledby="sel-h">
        <h2 id="sel-h" className="section-title">
          {es ? "La selección" : "The selection"}
        </h2>
        <ul className="catalog-grid">
          {PRODUCTS.filter((p) => p.stock > 0)
            .slice(0, 4)
            .map((p) => (
              <Card key={p.handle} p={p} lang={lang} />
            ))}
        </ul>
        <Link href={`/${lang}/perfumes`} className="btn btn-line home-all">
          {es ? `Ver los ${PRODUCTS.length} perfumes` : `See all ${PRODUCTS.length} fragrances`}
        </Link>
      </section>
    </article>
  );
}
