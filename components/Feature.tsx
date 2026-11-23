"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { DELIVERY_FROM, lempiras, note, type Lang, type Product, type Tier } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import NoteStage from "./NoteStage";
import AddToBag from "./AddToBag";
import Icon from "./Icon";

const TIERS: Tier[] = ["top", "heart", "base"];
const motionQuery = () => matchMedia("(prefers-reduced-motion: reduce)");
const subscribeMotion = (cb: () => void) => {
  const mq = motionQuery();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// The index entry at full scale: a live glyph field of the fragrance's notes, the chord as
// buttons that morph the field, and one ink band holding every fact needed to buy.
export default function Feature({ product: p, lang, hook }: { product: Product; lang: Lang; hook?: string }) {
  const t = dict(lang);
  const reduced = useSyncExternalStore(subscribeMotion, () => motionQuery().matches, () => false);
  const [tier, setTier] = useState(0);
  const [picked, setPicked] = useState(false); // the visitor took over: stop cycling
  const [playPicked, setPlaying] = useState<boolean | null>(null);
  const playing = playPicked ?? !reduced;

  useEffect(() => {
    if (!playing || picked) return;
    const id = setInterval(() => setTier((i) => (i + 1) % 3), 5200);
    return () => clearInterval(id);
  }, [playing, picked]);

  const active = note(p.chord[TIERS[tier]].lead);
  const stockLine = p.stock === 0 ? t.soldOut : p.stock <= 3 ? t.fewLeft(p.stock) : t.inStock;
  const Name = hook ? "h2" : "h1";

  return (
    <section className="feature" aria-labelledby={`f-${p.handle}`}>
      {hook && <h1 className="hook">{hook}</h1>}
      <div className="stage">
        <NoteStage note={active} playing={playing} reduced={reduced} />
        <p className="stage-caption" aria-hidden="true">
          <span className="mono">No. {active.no}</span> {active.name[lang]}
        </p>
        <button type="button" className="btn btn-quiet stage-play" aria-pressed={!playing} onClick={() => setPlaying(!playing)}>
          <Icon name={playing ? "pause" : "play"} size={16} />
          {playing ? t.pause : t.play}
        </button>
      </div>

      <div className="chord" role="group" aria-label={`${t.facts.notes}. ${t.tierHint}`}>
        {TIERS.map((k, i) => {
          const n = note(p.chord[k].lead);
          return (
            <button
              key={k}
              type="button"
              className="tier"
              aria-pressed={i === tier}
              style={{ "--tint": n.tint } as React.CSSProperties}
              onClick={() => {
                setTier(i);
                setPicked(true);
              }}
            >
              <span className="tier-label">{t.tiers[k]}</span>
              <span className="tier-name">{n.name[lang]}</span>
              <span className="tier-also">+ {p.chord[k].also[lang]}</span>
            </button>
          );
        })}
      </div>

      <div className="band">
        <p className="band-meta mono">
          No. {p.no} · {p.house}
        </p>
        <Name id={`f-${p.handle}`} className="band-name">
          {p.name}
        </Name>
        <p className="band-spec">
          {t.type[p.type]} · {p.ml} ml · {p.family[lang]}
        </p>
        <div className="band-price">
          <span className="price mono">{lempiras(p.price)}</span>
          <span className={p.stock === 0 ? "stock out" : "stock"}>{stockLine}</span>
        </div>
        <p className="band-small">{t.priceNote}</p>
        <AddToBag product={p} lang={lang} />
        <ul className="band-facts">
          <li>
            <Icon name="truck" size={18} />
            {t.deliveryLine(lempiras(DELIVERY_FROM))}
          </li>
          <li>
            <Icon name="cash" size={18} />
            {t.payLine}
          </li>
        </ul>
        {hook && (
          <Link className="band-link" href={`/${lang}/p/${p.handle}`}>
            {t.details} <Icon name="arrow" size={18} />
          </Link>
        )}
      </div>
    </section>
  );
}
