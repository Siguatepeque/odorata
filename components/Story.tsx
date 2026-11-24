"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import GlyphField, { LOOKS, noteLook } from "@/components/GlyphField";
import { motionQuery, subscribeMotion } from "@/components/AccordStage";
import { dict } from "@/lib/i18n";
import { DELIVERY, LEVELS, PRODUCTS, alternativesTo, lempiras, product, type Lang, type Level } from "@/lib/products";

gsap.registerPlugin(ScrollToPlugin, SplitText);

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const HEADER = 60;
const COOLDOWN = 600; // ms after a step lands before the next gesture counts
const FLAG = { image: `${BASE}/brand/honduras.jpg`, focus: { x: 0.5, y: 0.5, zoom: 1 } };
const ORIGINALS = ["althair", "imagination"]; // each gets its own step, its own top note behind it
const LEVEL_ORDER: Level[] = ["closest", "dna", "vibe"];
type Step = string; // "hero", an original's handle, or "home"


// The landing as one scroll: the flag, then each original with its alternatives in front of its own
// top note, then the flag again for delivery and payment.
export default function Story({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const es = lang === "es";
  const [step, setStep] = useState<Step>("hero");
  const steps = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLParagraphElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, () => motionQuery().matches, () => false);

  // One gesture, one step: inside the story a wheel tick, a swipe or an arrow key moves exactly one
  // step and GSAP frames it. Past the last step (or above the first) the page scrolls normally.
  useEffect(() => {
    const els = [...steps.current!.querySelectorAll<HTMLElement>("[data-step]")];
    const tops = () => els.map((el) => el.getBoundingClientRect().top + scrollY - HEADER);
    let busy = false;
    let lastWheel = 0;
    let doneAt = 0;

    // Where a gesture in this direction goes, or null when it should scroll the page natively.
    const target = (dir: 1 | -1) => {
      const t = tops();
      const h = t[1] - t[0];
      const pos = (scrollY - t[0]) / h; // 0 = first step framed, n-1 = last
      if (pos < -0.01 || pos > t.length - 1 + (dir < 0 ? 0.99 : 0.01)) return null;
      const i = dir > 0 ? Math.floor(pos + 0.01) + 1 : Math.ceil(pos - 0.01) - 1;
      return i >= 0 && i < t.length ? i : null;
    };
    const go = (i: number) => {
      busy = true;
      setStep(els[i].dataset.step!); // the stage moves with the gesture, not halfway through it
      const y = tops()[i];
      // The owner asked for the scroll itself to be the transition, whatever the OS motion setting.
      gsap.to(window, {
        scrollTo: { y, autoKill: false },
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          doneAt = performance.now();
          // Cooldown: the next step can't start until this one has been on screen a moment.
          setTimeout(() => (busy = false), COOLDOWN);
        },
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const y = target(dir);
      if (y === null && !busy) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      // A trackpad keeps sending momentum after the step lands; a new step needs a fresh flick.
      if (busy || y === null || (gap < 160 && now - doneAt < 1000)) return;
      go(y);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchY - e.touches[0].clientY;
      if (busy || (Math.abs(dy) > 4 && target(dy > 0 ? 1 : -1) !== null)) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY - e.changedTouches[0].clientY;
      if (busy || Math.abs(dy) < 30) return;
      const y = target(dy > 0 ? 1 : -1);
      if (y !== null) go(y);
    };

    const KEYS: Record<string, 1 | -1> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key];
      const el = e.target as HTMLElement;
      if (!dir || e.shiftKey || el.closest("input, textarea, select, button, a, dialog")) return;
      const y = target(dir);
      if (y === null) return;
      e.preventDefault();
      if (!busy) go(y);
    };

    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("touchend", onTouchEnd);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("wheel", onWheel);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("touchend", onTouchEnd);
      removeEventListener("keydown", onKey);
      gsap.killTweensOf(window);
    };
  }, []);

  // Headlines rise line by line out of a mask when their step lands.
  const splits = useRef(new Map<Element, SplitText>());
  useEffect(() => {
    const made = splits.current;
    let live = true;
    document.fonts.ready.then(() => {
      if (!live) return;
      steps.current!.querySelectorAll(".story-title, .story-h").forEach((h) => made.set(h, SplitText.create(h, { type: "lines", mask: "lines" })));
    });
    return () => {
      live = false;
      made.forEach((s) => s.revert());
      made.clear();
    };
  }, []);
  useEffect(() => {
    const card = steps.current!.querySelector(`[data-step="${step}"] .story-card`);
    if (!card) return;
    const h = card.querySelector(".story-title, .story-h");
    const lines = (h && splits.current.get(h)?.lines) || [];
    const rest = [...card.children].filter((c) => c !== h);
    const tl = gsap.timeline();
    if (lines.length) tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.75, ease: "power4.out", stagger: 0.08 }, 0.15);
    tl.fromTo(rest, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 }, 0.35);
    return () => void tl.progress(1).kill();
  }, [step]);

  // The price drop: the original's price, then it falls to what its alternatives start at.
  useEffect(() => {
    const el = tag.current!;
    const o = product(step);
    const alts = o ? alternativesTo(o.handle) : [];
    if (!o || !alts.length) return;
    const from = Math.min(...alts.map((a) => a.price));
    const [k, v] = [el.children[0], el.children[1]];
    const n = { v: o.price };
    k.textContent = lang === "es" ? "El original" : "The original";
    v.textContent = lempiras(o.price);
    const tl = gsap.timeline({ delay: 0.9 });
    tl.to(n, {
      v: from,
      duration: 1.3,
      ease: "power3.inOut",
      onStart: () => void (k.textContent = lang === "es" ? "Alternativas desde" : "Alternatives from"),
      onUpdate: () => void (v.textContent = lempiras(Math.round(n.v / 5) * 5)),
    });
    return () => void tl.kill();
  }, [step, lang]);

  // Depth: the bottles lean after the pointer, alternatives more than the original.
  useEffect(() => {
    const el = stage.current!;
    const x = gsap.quickTo(el, "--mx", { duration: 0.8, ease: "power3.out" });
    const y = gsap.quickTo(el, "--my", { duration: 0.8, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x((e.clientX / innerWidth - 0.5) * 2);
      y((e.clientY / innerHeight - 0.5) * 2);
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  // The step whose middle crosses the middle of the screen is the one on stage.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStep((e.target as HTMLElement).dataset.step!)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current!.querySelectorAll("[data-step]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const on = product(step);
  const field = on ? on.accord : FLAG;
  const step$ = (s: Step, i: number) => ({ "data-step": s, id: `paso-${i}` });

  return (
    <div className="story">
      <div className="story-stage" ref={stage} aria-hidden="true" data-scene={on ? "original" : "flag"}>
        <GlyphField image={field.image} focus={field.focus} playing={!reduced} look={(on && noteLook(on.accord.note)) || LOOKS.flag} />
        <p className="story-tag" ref={tag}>
          <span />
          <strong />
        </p>
        {ORIGINALS.map((h) => {
          const o = product(h)!;
          const alts = alternativesTo(h);
          const live = step === h ? " is-on" : "";
          return (
            <div key={h}>
              {/* eslint-disable-next-line @next/next/no-img-element -- transparent cut-outs */}
              {o.photo && <img className={`story-bottle story-orig${live}`} src={o.photo.src} width={o.photo.w} height={o.photo.h} alt="" />}
              {alts.map((a, i) => {
                // Alternatives stand in closeness groups, one label per group.
                const lvl = a.inspiredBy!.level;
                const j = alts.slice(0, i).filter((b) => b.inspiredBy!.level === lvl).length;
                // ponytail: fixed group starts suit up to ~6 alternatives; lay out by count if a cluster grows past that
                const fl = [0, 0.42, 0.74][LEVEL_ORDER.indexOf(lvl)] + j * 0.14;
                return (
                  <figure key={a.handle} className={`story-bottle story-alt${live}`} data-first={j === 0 || undefined} style={{ "--i": i, "--fl": fl } as React.CSSProperties}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {a.photo && <img src={a.photo.src} width={a.photo.w} height={a.photo.h} alt="" />}
                    <figcaption>{LEVELS[lvl].name[lang]}</figcaption>
                  </figure>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="story-steps" ref={steps}>
        <section className="story-step story-hero" {...step$("hero", 0)}>
          <div className="story-card">
            <h1 className="story-title">{es ? "Perfumes en Honduras" : "Fragrances in Honduras"}</h1>
            <p>
              {es
                ? "Los famosos, y alternativas que huelen parecido por mucho menos. Precio final en lempiras, entrega a domicilio."
                : "The famous ones, and alternatives that smell alike for far less. Final prices in lempiras, home delivery."}
            </p>
            <div className="story-actions">
              <Link href={`/${lang}/perfumes`} className="btn btn-solid">
                {es ? "Ver perfumes" : "See fragrances"}
              </Link>
              <a href="#paso-1" className="link">
                {es ? "Cómo funciona ↓" : "How it works ↓"}
              </a>
            </div>
          </div>
        </section>

        {ORIGINALS.map((h, k) => {
          const o = product(h)!;
          const alts = alternativesTo(h);
          const from = lempiras(Math.min(...alts.map((a) => a.price)));
          return (
            <section key={h} className="story-step" {...step$(h, k + 1)}>
              <div className="story-card">
                <h2 className="story-h">
                  {k === 0 ? (es ? "Los perfumes que quieres" : "The fragrances you want") : es ? "Te decimos qué tan parecidas" : "We tell you how close"}
                </h2>
                <p>
                  <strong>{o.name}</strong>, {o.house}: {lempiras(o.price)}.{" "}
                  {es ? `Y ${alts.length} alternativas que huelen parecido, desde ${from}.` : `And ${alts.length} alternatives that smell alike, from ${from}.`}
                </p>
                {k > 0 && (
                  <dl className="story-levels">
                    {LEVEL_ORDER.map((l) => (
                      <div key={l}>
                        <dt>{LEVELS[l].name[lang]}</dt>
                        <dd>{LEVELS[l].meaning[lang]}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <Link href={`/${lang}/p/${o.handle}#parecidos`} className="link">
                  {es ? `Comparar con ${o.name}` : `Compare with ${o.name}`}
                </Link>
              </div>
            </section>
          );
        })}

        <section className="story-step" {...step$("home", ORIGINALS.length + 1)}>
          <div className="story-card">
            <h2 className="story-h">{es ? "A todo Honduras. Pagas al recibir." : "All of Honduras. Pay on delivery."}</h2>
            <p>
              {DELIVERY.city.where[lang]} {lempiras(DELIVERY.city.fee)}, {DELIVERY.rest.where[lang].toLowerCase()} {lempiras(DELIVERY.rest.fee)}. {t.pay}
            </p>
            <div className="story-actions">
              <Link href={`/${lang}/perfumes`} className="btn btn-solid">
                {es ? `Ver los ${PRODUCTS.length} perfumes` : `See all ${PRODUCTS.length} fragrances`}
              </Link>
              <Link href={`/${lang}/como-comprar`} className="link">
                {t.terms.link}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
