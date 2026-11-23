import type { Metadata } from "next";
import { dict } from "@/lib/i18n";
import { DELIVERY, lempiras, type Lang } from "@/lib/products";

export async function generateMetadata({ params }: PageProps<"/[lang]/como-comprar">): Promise<Metadata> {
  return { title: dict((await params).lang as Lang).how.title };
}

export default async function HowToBuy({ params }: PageProps<"/[lang]/como-comprar">) {
  const lang = (await params).lang as Lang;
  const t = dict(lang);
  return (
      <section className="how" aria-labelledby="how-h">
        <h1 id="how-h" className="section-title">
          {t.how.title}
        </h1>
        <ol className="steps">
          {t.how.steps.map(([title, body], i) => (
            <li key={title}>
              <span className="step-n" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <div className="terms">
          <table>
            <caption>{t.how.delivery}</caption>
            <tbody>
              {[DELIVERY.city, DELIVERY.rest].map((d) => (
                <tr key={d.fee}>
                  <th scope="row">{d.where[lang]}</th>
                  <td>{lempiras(d.fee)}</td>
                  <td>{d.days[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <h3 className="terms-title">{t.how.payment}</h3>
            <ul className="payments">
              {t.how.payments.map(([name, body]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
  );
}
