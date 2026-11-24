"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import FitText from "@/components/FitText";
import { motionQuery, subscribeMotion } from "@/lib/motion";
import { dict } from "@/lib/i18n";
import { DELIVERY, PRODUCTS, lempiras, type Lang } from "@/lib/products";

gsap.registerPlugin(SplitText);

// The title at full width, delivery as two big prices, then the steps and the ways to pay in hairline
// rows. Headlines rise out of their masks as they come into view.
export default function HowToBuy({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const es = lang === "es";
  const root = useRef<HTMLElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, () => motionQuery().matches, () => false);

  useEffect(() => {
    if (reduced) return;
    const made: SplitText[] = [];
    const tweens: gsap.core.Tween[] = [];
    let live = true;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          const lines = made.find((s) => s.elements[0] === el)?.lines;
          if (lines) tweens.push(gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.75, ease: "power4.out", stagger: 0.08 }));
          else tweens.push(gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }));
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.fonts.ready.then(() => {
      if (!live) return;
      root.current!.querySelectorAll(".how-rise").forEach((h) => made.push(SplitText.create(h, { type: "lines", mask: "lines" })));
      root.current!.querySelectorAll(".how-rise, .how-fade").forEach((el) => io.observe(el));
    });
    return () => {
      live = false;
      io.disconnect();
      tweens.forEach((tw) => tw.progress(1).kill());
      made.forEach((s) => s.revert());
    };
  }, [reduced]);

  return (
    <article className="how" ref={root}>
      <section className="how-section how-top" aria-labelledby="how-h">
        <FitText id="how-h">{t.how.title}</FitText>
        <p className="how-lead how-fade">
          {es ? "Entrega a domicilio en todo Honduras." : "Home delivery across Honduras."} {t.pay}
        </p>
        <dl className="how-fees">
          {[DELIVERY.city, DELIVERY.rest].map((d) => (
            <div key={d.fee} className="how-fade">
              <dt>{d.where[lang]}</dt>
              <dd>
                <strong>{lempiras(d.fee)}</strong>
                <span>{d.days[lang]}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="how-section" aria-labelledby="steps-h">
        <h2 id="steps-h" className="section-title how-rise">
          {es ? "Cuatro pasos" : "Four steps"}
        </h2>
        <ol className="how-steps">
          {t.how.steps.map(([title, body], i) => (
            <li key={title}>
              <span className="how-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="story-h how-rise">{title}</h3>
              <p className="how-fade">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="how-section" aria-labelledby="pay-h">
        <h2 id="pay-h" className="section-title how-rise">
          {t.how.payment}
        </h2>
        <ul className="how-pay">
          {t.how.payments.map(([name, body]) => (
            <li key={name} className="how-fade">
              <strong>{name}</strong>
              <span>{body}</span>
            </li>
          ))}
        </ul>
        <Link href={`/${lang}/perfumes`} className="btn btn-solid how-cta">
          {es ? `Ver los ${PRODUCTS.length} perfumes` : `See all ${PRODUCTS.length} fragrances`}
        </Link>
      </section>
    </article>
  );
}
