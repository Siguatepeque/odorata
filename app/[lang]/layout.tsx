import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archivo } from "next/font/google";
import { dict, isLang, LANGS } from "@/lib/i18n";
import { BagButton, BagSheet } from "@/components/Bag";
import "../globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { default: "Marginalia", template: "%s · Marginalia" },
    description: lang === "en" ? "Fragrances in Honduras. Final prices in lempiras, home delivery." : "Perfumes en Honduras. Precio final en lempiras, entrega a domicilio.",
  };
}

export default async function Layout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  return (
    <html lang={t.htmlLang} className={archivo.variable}>
      <body>
        <a href="#main" className="skip">
          {t.skip}
        </a>
        <header className="top">
          <Link href={`/${lang}`} className="wordmark">
            Marginalia
          </Link>
          <nav className="top-nav" aria-label={lang === "es" ? "Principal" : "Main"}>
            <Link href={`/${lang}/p/liquid-brun`}>{t.nav.fragrances}</Link>
            <Link href={`/${lang}/como-comprar`}>{t.nav.how}</Link>
          </nav>
          <BagButton lang={lang} />
        </header>
        <main id="main">{children}</main>
        <footer className="foot">
          <Link href={`/${lang}`} className="wordmark">
            Marginalia
          </Link>
          <nav className="foot-nav" aria-label={lang === "es" ? "Pie de página" : "Footer"}>
            <Link href={`/${lang}/p/liquid-brun`}>{t.nav.fragrances}</Link>
            <Link href={`/${lang}/como-comprar`}>{t.nav.how}</Link>
          </nav>
          <p>
            {t.footer.lang}:{" "}
            <Link href={`/${t.other.lang}`} hrefLang={t.other.lang} lang={t.other.lang}>
              {t.other.label}
            </Link>
          </p>
          <p className="foot-demo">{t.footer.demo}</p>
        </footer>
        <BagSheet lang={lang} />
      </body>
    </html>
  );
}
