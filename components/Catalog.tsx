"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  FAMILIES,
  GENDERS,
  LEVELS,
  NOTES,
  PRODUCTS,
  alternativesTo,
  familiesOf,
  lempiras,
  notesOf,
  product,
  type Family,
  type Gender,
  type Lang,
  type Product,
} from "@/lib/products";
import { QuickAdd } from "@/components/BuyBox";

const T = {
  es: {
    search: "Busca perfume, marca, nota o el original",
    filters: "Filtrar",
    sort: "Ordenar",
    sorts: { rec: "Recomendados", asc: "Precio: menor a mayor", desc: "Precio: mayor a menor" },
    facets: { family: "Familia olfativa", notes: "Notas", kind: "Original o alternativa", gender: "Para", conc: "Concentración", price: "Precio", house: "Marca" },
    kind: { original: "Originales", alt: "Alternativas inspiradas" },
    prices: { low: "Hasta L 3,000", mid: "L 3,000 a L 6,000", high: "Más de L 6,000" },
    pick: "Elegir notas",
    pickMore: "Cambiar notas",
    notesLead: "Marca ✓ las notas que quieres y ✕ las que prefieres evitar.",
    noteSearch: "Busca una nota: vainilla, rosa, cedro…",
    noteNone: "Ninguna nota se llama así.",
    allFamilies: "Todas",
    clearNotes: "Borrar notas",
    with: (x: string) => `Con ${x.toLowerCase()}`,
    without: (x: string) => `Sin ${x.toLowerCase()}`,
    count: (n: number) => (n === 1 ? "1 perfume" : `${n} perfumes`),
    show: (n: number) => (n === 1 ? "Ver 1 perfume" : `Ver ${n} perfumes`),
    clear: "Borrar todo",
    remove: (x: string) => `Quitar filtro: ${x}`,
    close: "Cerrar",
    none: "Ningún perfume tiene todo eso.",
    noneHint: "Quita un filtro o busca otra palabra.",
    inspired: "Inspirado en",
    alts: (n: number, from: string) => `${n} alternativas desde ${from}`,
  },
  en: {
    search: "Search fragrance, house, note or the original",
    filters: "Filter",
    sort: "Sort",
    sorts: { rec: "Recommended", asc: "Price: low to high", desc: "Price: high to low" },
    facets: { family: "Scent family", notes: "Notes", kind: "Original or alternative", gender: "For", conc: "Concentration", price: "Price", house: "House" },
    kind: { original: "Originals", alt: "Inspired alternatives" },
    prices: { low: "Up to L 3,000", mid: "L 3,000 to L 6,000", high: "Over L 6,000" },
    pick: "Choose notes",
    pickMore: "Change notes",
    notesLead: "Mark ✓ the notes you want and ✕ the ones to avoid.",
    noteSearch: "Search a note: vanilla, rose, cedar…",
    noteNone: "No note goes by that name.",
    allFamilies: "All",
    clearNotes: "Clear notes",
    with: (x: string) => `With ${x.toLowerCase()}`,
    without: (x: string) => `Without ${x.toLowerCase()}`,
    count: (n: number) => (n === 1 ? "1 fragrance" : `${n} fragrances`),
    show: (n: number) => (n === 1 ? "Show 1 fragrance" : `Show ${n} fragrances`),
    clear: "Clear all",
    remove: (x: string) => `Remove filter: ${x}`,
    close: "Close",
    none: "No fragrance has all of that.",
    noneHint: "Remove a filter or try another word.",
    inspired: "Inspired by",
    alts: (n: number, from: string) => `${n} alternatives from ${from}`,
  },
};
type Dict = (typeof T)["es"];

/** Lowercase and strip accents, so "althair" finds "Althaïr". */
const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const priceBand = (n: number) => (n < 3000 ? "low" : n <= 6000 ? "mid" : "high");

type Option = { value: string; label: string; hint?: string };
type FacetId = Exclude<keyof Dict["facets"], "notes">;
type Facet = { id: FacetId; of: (p: Product) => string[]; options: (lang: Lang, t: Dict) => Option[] };

// Within one facet any ticked option matches; across facets every facet must match.
const FACETS: Facet[] = [
  {
    id: "family",
    of: familiesOf,
    options: (lang) => (Object.keys(FAMILIES) as Family[]).map((f) => ({ value: f, label: FAMILIES[f].name[lang], hint: FAMILIES[f].hint[lang] })),
  },
  {
    id: "kind",
    of: (p) => [p.inspiredBy ? "alt" : "original"],
    options: (_, t) => [
      { value: "original", label: t.kind.original },
      { value: "alt", label: t.kind.alt },
    ],
  },
  {
    id: "gender",
    of: (p) => [p.gender],
    options: (lang) => (Object.keys(GENDERS) as Gender[]).map((g) => ({ value: g, label: GENDERS[g][lang] })),
  },
  {
    id: "conc",
    of: (p) => [p.type.en],
    options: (lang) => [...new Map(PRODUCTS.map((p) => [p.type.en, p.type[lang]]))].map(([value, label]) => ({ value, label })),
  },
  {
    id: "price",
    of: (p) => [priceBand(p.price)],
    options: (_, t) => (["low", "mid", "high"] as const).map((b) => ({ value: b, label: t.prices[b] })),
  },
  {
    id: "house",
    of: (p) => [p.house],
    options: () => [...new Set(PRODUCTS.map((p) => p.house))].sort().map((h) => ({ value: h, label: h })),
  },
];

/** Notes in use, most common first; the picker groups them by family tab. */
const NOTE_TALLY = PRODUCTS.flatMap(notesOf).reduce<Record<string, number>>((acc, id) => ((acc[id] = (acc[id] ?? 0) + 1), acc), {});
const NOTE_IDS = Object.keys(NOTE_TALLY)
  .filter((id) => NOTES[id])
  .sort((a, b) => NOTE_TALLY[b] - NOTE_TALLY[a]); // most common first

/** Everything the shopper has chosen. Notes work like a fragrance database: every "with" note must be there, no "without" note may be. */
type State = { query: string; sel: Partial<Record<FacetId, string[]>>; inc: string[]; exc: string[] };
type Sort = keyof Dict["sorts"];

function searchText(p: Product) {
  const original = p.inspiredBy && product(p.inspiredBy.handle);
  const notes = notesOf(p).flatMap((id) => (NOTES[id] ? [NOTES[id].name.es, NOTES[id].name.en] : []));
  return [p.name, p.house, original?.name, original?.house, ...notes].join(" ");
}

const matches = (p: Product, s: State, skip?: FacetId) => {
  const notes = notesOf(p);
  return (
    (!s.query || fold(searchText(p)).includes(s.query)) &&
    s.inc.every((n) => notes.includes(n)) &&
    !s.exc.some((n) => notes.includes(n)) &&
    FACETS.every((f) => f.id === skip || !s.sel[f.id]?.length || f.of(p).some((v) => s.sel[f.id]!.includes(v)))
  );
};

const Cross = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M1 1l8 8M9 1 1 9" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg>
);

const Chevron = () => (
  <svg className="facet-chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2 4.5 6 8.5l4-4" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg>
);

type Actions = { toggle: (f: FacetId, v: string) => void; note: (id: string, mode: "inc" | "exc") => void; openNotes: () => void };

function OptionFacet({ f, lang, s, act, idPrefix }: { f: Facet; lang: Lang; s: State; act: Actions; idPrefix: string }) {
  const t = T[lang];
  // Counts answer "how many would I see if I ticked this", given every other filter.
  const pool = PRODUCTS.filter((p) => matches(p, s, f.id));
  const picked = s.sel[f.id]?.length ?? 0;
  return (
    <details className="facet" open>
      <summary>
        <span>{t.facets[f.id]}</span>
        {picked > 0 && <span className="facet-picked">{picked}</span>}
        <Chevron />
      </summary>
      <ul className="opts">
        {f.options(lang, t).map((o) => {
          const n = pool.filter((p) => f.of(p).includes(o.value)).length;
          const on = s.sel[f.id]?.includes(o.value) ?? false;
          const id = `${idPrefix}-${f.id}-${o.value}`;
          return (
            <li key={o.value}>
              <input type="checkbox" id={id} checked={on} disabled={!n && !on} onChange={() => act.toggle(f.id, o.value)} />
              <label htmlFor={id}>
                <span className="box" aria-hidden="true" />
                <span className="opt-label">
                  {o.label}
                  {o.hint && <small>{o.hint}</small>}
                </span>
                <span className="opt-n">{n}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const X = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 3l8 8M11 3 3 11" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

/** A chosen note as a removable chip: green for "with", red for "without". */
function NoteChip({ id, mode, lang, act }: { id: string; mode: "inc" | "exc"; lang: Lang; act: Actions }) {
  const t = T[lang];
  const name = NOTES[id].name[lang];
  return (
    <button type="button" className={`note-chip is-${mode}`} onClick={() => act.note(id, mode)} aria-label={t.remove(mode === "inc" ? t.with(name) : t.without(name))}>
      {mode === "inc" ? <Check /> : <X />}
      {name}
      <Cross />
    </button>
  );
}

/** In the panel the notes stay short: what is chosen, and a button to the picker. */
function NotesFacet({ lang, s, act }: { lang: Lang; s: State; act: Actions }) {
  const t = T[lang];
  const picked = s.inc.length + s.exc.length;
  return (
    <details className="facet" open>
      <summary>
        <span>{t.facets.notes}</span>
        {picked > 0 && <span className="facet-picked">{picked}</span>}
        <Chevron />
      </summary>
      <div className="notes-facet">
        {picked > 0 && (
          <div className="note-chips">
            {s.inc.map((id) => (
              <NoteChip key={id} id={id} mode="inc" lang={lang} act={act} />
            ))}
            {s.exc.map((id) => (
              <NoteChip key={id} id={id} mode="exc" lang={lang} act={act} />
            ))}
          </div>
        )}
        <button type="button" className="btn btn-line notes-open" onClick={act.openNotes} aria-haspopup="dialog">
          {picked ? t.pickMore : t.pick}
        </button>
      </div>
    </details>
  );
}

/** The note picker: search, family tabs, and a grid of ingredient tiles, each with ✓ and ✕. */
function NotePicker({
  lang,
  s,
  act,
  shown,
  dialog,
  clearNotes,
}: {
  lang: Lang;
  s: State;
  act: Actions;
  shown: number;
  dialog: React.RefObject<HTMLDialogElement | null>;
  clearNotes: () => void;
}) {
  const t = T[lang];
  const [find, setFind] = useState("");
  const [fam, setFam] = useState<Family | "">("");
  const q = fold(find.trim());
  const pool = PRODUCTS.filter((p) => matches(p, s));
  const ids = NOTE_IDS.filter((id) => (!fam || NOTES[id].family === fam) && (!q || fold(NOTES[id].name[lang]).includes(q) || fold(NOTES[id].name.es).includes(q)));
  const families = (Object.keys(FAMILIES) as Family[]).filter((f) => NOTE_IDS.some((id) => NOTES[id].family === f));
  const close = () => dialog.current?.close();

  return (
    <dialog ref={dialog} className="picker" aria-labelledby="picker-title" onClick={(e) => e.target === dialog.current && close()}>
      <div className="picker-inner">
        <header className="picker-head">
          <div>
            <h2 id="picker-title">{t.facets.notes}</h2>
            <p>{t.notesLead}</p>
          </div>
          <button type="button" className="picker-close" onClick={close} aria-label={t.close}>
            <X />
          </button>
        </header>

        <div className="picker-tools">
          <div className="search search-sm">
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="m13 13 5 5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input type="search" value={find} onChange={(e) => setFind(e.target.value)} placeholder={t.noteSearch} aria-label={t.noteSearch} />
          </div>
          <div className="picker-tabs" role="group" aria-label={t.facets.family}>
            <button type="button" aria-pressed={!fam} onClick={() => setFam("")}>
              {t.allFamilies}
            </button>
            {families.map((f) => (
              <button key={f} type="button" aria-pressed={fam === f} onClick={() => setFam(fam === f ? "" : f)}>
                {FAMILIES[f].name[lang]}
              </button>
            ))}
          </div>
        </div>

        <div className="picker-body">
          {ids.length ? (
            <ul className="picker-grid">
              {ids.map((id) => {
                const name = NOTES[id].name[lang];
                const inc = s.inc.includes(id);
                const exc = s.exc.includes(id);
                const n = pool.filter((p) => notesOf(p).includes(id)).length;
                return (
                  <li key={id} className={inc ? "tile is-inc" : exc ? "tile is-exc" : "tile"}>
                    <span className="tile-img">
                      {/* eslint-disable-next-line @next/next/no-img-element -- ingredient photo */}
                      <img src={NOTES[id].img} alt="" width={160} height={120} loading="lazy" />
                    </span>
                    <span className="tile-name">{name}</span>
                    <span className="tile-n">{exc ? " " : t.count(n)}</span>
                    <span className="tile-actions">
                      <button type="button" className="tile-yes" aria-pressed={inc} aria-label={t.with(name)} disabled={!n && !inc} onClick={() => act.note(id, "inc")}>
                        <Check />
                      </button>
                      <button type="button" className="tile-no" aria-pressed={exc} aria-label={t.without(name)} onClick={() => act.note(id, "exc")}>
                        <X />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="picker-none">{t.noteNone}</p>
          )}
        </div>

        <footer className="picker-foot">
          <button type="button" className="link" onClick={clearNotes} disabled={!s.inc.length && !s.exc.length}>
            {t.clearNotes}
          </button>
          <button type="button" className="btn btn-solid" onClick={close}>
            {t.show(shown)}
          </button>
        </footer>
      </div>
    </dialog>
  );
}

/** The facet list, inside the filter sheet: a side panel on desktop, a bottom sheet on phones. */
function Panel({ lang, s, act, idPrefix }: { lang: Lang; s: State; act: Actions; idPrefix: string }) {
  const [family, ...rest] = FACETS;
  return (
    <div className="facets">
      <OptionFacet f={family} lang={lang} s={s} act={act} idPrefix={idPrefix} />
      <NotesFacet lang={lang} s={s} act={act} />
      {rest.map((f) => (
        <OptionFacet key={f.id} f={f} lang={lang} s={s} act={act} idPrefix={idPrefix} />
      ))}
    </div>
  );
}

function Card({ p, lang }: { p: Product; lang: Lang }) {
  const t = T[lang];
  const original = p.inspiredBy && product(p.inspiredBy.handle);
  const alts = alternativesTo(p.handle);
  return (
    <li className="card">
      <Link href={`/${lang}/p/${p.handle}`} className="card-link">
        <span className="card-bottle">
          {/* eslint-disable-next-line @next/next/no-img-element -- transparent cut-out */}
          {p.photo && <img src={p.photo.src} alt="" width={p.photo.w} height={p.photo.h} loading="lazy" />}
        </span>
        <span className="card-house">{p.house}</span>
        <strong className="card-name">{p.name}</strong>
        <span className="card-meta">
          {p.type[lang]} · {p.ml} ml
        </span>
        {original ? (
          <span className="card-rel">
            {t.inspired} <b>{original.name}</b> · {LEVELS[p.inspiredBy!.level].name[lang]}
          </span>
        ) : alts.length ? (
          <span className="card-rel">{t.alts(alts.length, lempiras(Math.min(...alts.map((a) => a.price))))}</span>
        ) : null}
        <span className="card-price">{lempiras(p.price)}</span>
      </Link>
      <QuickAdd product={p} lang={lang} />
    </li>
  );
}

const EMPTY = { sel: {}, inc: [], exc: [] };

export default function Catalog({ lang }: { lang: Lang }) {
  const t = T[lang];
  const sheet = useRef<HTMLDialogElement>(null);
  const picker = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [f, setF] = useState<Omit<State, "query">>(EMPTY);
  const [sort, setSort] = useState<Sort>("rec");

  const s: State = { ...f, query: fold(q.trim()) };
  const shown = PRODUCTS.filter((p) => matches(p, s));
  if (sort !== "rec") shown.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));

  const act: Actions = {
    toggle: (id, v) =>
      setF((x) => {
        const cur = x.sel[id] ?? [];
        return { ...x, sel: { ...x.sel, [id]: cur.includes(v) ? cur.filter((y) => y !== v) : [...cur, v] } };
      }),
    // A note is with, without, or neither; picking one side clears the other.
    note: (id, mode) =>
      setF((x) => {
        const other = mode === "inc" ? "exc" : "inc";
        const on = x[mode].includes(id);
        return { ...x, [mode]: on ? x[mode].filter((y) => y !== id) : [...x[mode], id], [other]: x[other].filter((y) => y !== id) };
      }),
    openNotes: () => picker.current?.showModal(),
  };
  const clear = () => {
    setF(EMPTY);
    setQ("");
  };

  // Every active filter as a removable pill, labelled the way the panel labels it.
  const pills = [
    ...FACETS.flatMap((fc) => {
      const opts = fc.options(lang, t);
      return (f.sel[fc.id] ?? []).map((v) => ({ key: fc.id + v, label: opts.find((o) => o.value === v)?.label ?? v, off: () => act.toggle(fc.id, v) }));
    }),
  ];
  const notePicked = f.inc.length + f.exc.length;
  const active = pills.length + notePicked + (s.query ? 1 : 0);

  return (
    <div className="shop">
      <div className="shop-main">
        <div className="search">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="m13 13 5 5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        </div>

        <div className="toolbar">
          <button type="button" className="filter-open" onClick={() => sheet.current?.showModal()} aria-haspopup="dialog">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M1 4h16M1 9h16M1 14h16" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="6" cy="4" r="2" fill="var(--paper)" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="9" r="2" fill="var(--paper)" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="5" cy="14" r="2" fill="var(--paper)" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {t.filters}
            {pills.length + notePicked > 0 && <span className="filter-n">{pills.length + notePicked}</span>}
          </button>
          <p className="result-count" role="status">
            {t.count(shown.length)}
          </p>
          <label className="sort">
            <span className="sr-only">{t.sort}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {(Object.keys(t.sorts) as Sort[]).map((k) => (
                <option key={k} value={k}>
                  {t.sorts[k]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {active > 0 && (
          <ul className="pills">
            {f.inc.map((id) => (
              <li key={`+${id}`}>
                <NoteChip id={id} mode="inc" lang={lang} act={act} />
              </li>
            ))}
            {f.exc.map((id) => (
              <li key={`-${id}`}>
                <NoteChip id={id} mode="exc" lang={lang} act={act} />
              </li>
            ))}
            {pills.map((pl) => (
              <li key={pl.key}>
                <button type="button" onClick={pl.off} aria-label={t.remove(pl.label)}>
                  {pl.label}
                  <Cross />
                </button>
              </li>
            ))}
            {s.query && (
              <li>
                <button type="button" onClick={() => setQ("")} aria-label={t.remove(q)}>
                  “{q.trim()}”
                  <Cross />
                </button>
              </li>
            )}
            <li>
              <button type="button" className="link" onClick={clear}>
                {t.clear}
              </button>
            </li>
          </ul>
        )}

        {shown.length ? (
          <ul className="catalog-grid">
            {shown.map((p) => (
              <Card key={p.handle} p={p} lang={lang} />
            ))}
          </ul>
        ) : (
          <div className="catalog-empty">
            <p>{t.none}</p>
            <p>{t.noneHint}</p>
            <button type="button" className="btn btn-line" onClick={clear}>
              {t.clear}
            </button>
          </div>
        )}
      </div>

      <NotePicker lang={lang} s={s} act={act} shown={shown.length} dialog={picker} clearNotes={() => setF((x) => ({ ...x, inc: [], exc: [] }))} />

      <dialog ref={sheet} className="sheet filter-sheet" aria-labelledby="filter-title" onClick={(e) => e.target === sheet.current && sheet.current.close()}>
        <div className="filter-sheet-inner">
          <header className="sheet-head">
            <h2 id="filter-title">{t.filters}</h2>
            <button type="button" className="link" onClick={() => sheet.current?.close()}>
              {t.close}
            </button>
          </header>
          <Panel lang={lang} s={s} act={act} idPrefix="sheet" />
          <footer className="filter-sheet-foot">
            <button type="button" className="link" onClick={clear} disabled={!active}>
              {t.clear}
            </button>
            <button type="button" className="btn btn-solid" onClick={() => sheet.current?.close()}>
              {t.show(shown.length)}
            </button>
          </footer>
        </div>
      </dialog>
    </div>
  );
}
