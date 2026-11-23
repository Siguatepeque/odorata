import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Familjen_Grotesk, Martian_Mono } from "next/font/google";
import { dict, isLang, LANGS } from "@/lib/dict";
import BagButton from "@/components/BagButton";
import Icon from "@/components/Icon";
import "../globals.css";

const sans = Familjen_Grotesk({ variable: "--font-sans", subsets: ["latin"] });
const mono = Martian_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { default: "Marginalia", template: "%s · Marginalia" },
    description: lang === "en" ? "Curated fragrances in Honduras. Prices in lempiras, home delivery." : "Perfumes seleccionados en Honduras. Precios en lempiras, entrega a domicilio.",
  };
}

export default async function Layout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  return (
    <html lang={lang === "es" ? "es-HN" : "en"} className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip">
          {t.skip}
        </a>
        <header className="site-header">
          <div className="bar">
            <Link href={`/${lang}`} className="wordmark">
              Marginalia
            </Link>
            <div className="bar-actions">
              <Link href={`/${lang}/shop`} className="search-link">
                <Icon name="search" />
                <span>{t.nav.search}</span>
              </Link>
              <BagButton lang={lang} />
            </div>
          </div>
          <nav className="nav" aria-label={lang === "es" ? "Principal" : "Main"}>
            <Link href={`/${lang}/shop`}>{t.nav.shop}</Link>
            <Link href={`/${lang}#notas`}>{t.nav.notes}</Link>
            <Link href={`/${lang}#como-comprar`}>{t.nav.how}</Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <Link href={`/${lang}`} className="wordmark">
            Marginalia
          </Link>
          <nav aria-label="Footer">
            <Link href={`/${lang}/shop`}>{t.nav.shop}</Link>
            <Link href={`/${lang}#notas`}>{t.nav.notes}</Link>
            <Link href={`/${lang}#como-comprar`}>{t.nav.how}</Link>
            <Link href={`/${lang}/bag`}>{t.nav.bag}</Link>
          </nav>
          <p>
            {t.footer.lang}:{" "}
            <Link href={`/${t.other.lang}`} hrefLang={t.other.lang} lang={t.other.lang}>
              {t.other.label}
            </Link>
          </p>
          <p className="footer-mock">{t.footer.mock}</p>
        </footer>
      </body>
    </html>
  );
}
