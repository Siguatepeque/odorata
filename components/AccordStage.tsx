"use client";

import { useState, useSyncExternalStore } from "react";
import GlyphField, { noteLook } from "./GlyphField";
import { dict } from "@/lib/i18n";
import type { Lang, Product } from "@/lib/products";
import { motionQuery, subscribeMotion } from "@/lib/motion";


// The product standing in front of its top note, a photograph run through the glyph field.
export default function AccordStage({ product: p, lang, priority = false, top, notesHref = "#notas" }: { product: Product; lang: Lang; priority?: boolean; top?: React.ReactNode; notesHref?: string }) {
  const t = dict(lang);
  const reduced = useSyncExternalStore(subscribeMotion, () => motionQuery().matches, () => false);
  const [picked, setPicked] = useState<boolean | null>(null);
  const playing = picked ?? !reduced;

  return (
    <figure className="stage">
      <GlyphField image={p.accord.image} focus={p.accord.focus} playing={playing} look={noteLook(p.accord.note)} />
      {p.photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- transparent cut-out at its natural size
        <img
          className="stage-bottle"
          src={p.photo.src}
          width={p.photo.w}
          height={p.photo.h}
          alt={`${p.name}, ${p.house}, ${p.type[lang]} ${p.ml} ml`}
          fetchPriority={priority ? "high" : undefined}
        />
      ) : (
        <p className="stage-nophoto">{lang === "es" ? "Foto del producto pendiente" : "Product photo pending"}</p>
      )}
      <a className="stage-notes" href={notesHref}>
        <span>
          <span className="stage-tier">{t.stage.top}</span>
          <strong>{p.accord.note[lang]}</strong>
          <span>
            {lang === "es" ? "Ver las" : "See all"} {Object.values(p.pyramid).flat().length} {lang === "es" ? "notas" : "notes"}
          </span>
        </span>
        <span className="notes-arrow" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 2v9M3 7.5 7 11.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
      </a>
      {top}
      <button type="button" className="stage-toggle" aria-label={playing ? t.stage.pause : t.stage.play} title={playing ? t.stage.pause : t.stage.play} onClick={() => setPicked(!playing)}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          {playing ? <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" /> : <path d="M4.5 2.2 13.5 8l-9 5.8z" />}
        </svg>
      </button>
    </figure>
  );
}
