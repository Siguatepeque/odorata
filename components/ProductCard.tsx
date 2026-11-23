import Link from "next/link";
import { lempiras, note, type Lang, type Product } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import GlyphTile from "./GlyphTile";
import AddToBag from "./AddToBag";

export default function ProductCard({ product: p, lang }: { product: Product; lang: Lang }) {
  const t = dict(lang);
  const f = p.face;
  return (
    <article className="card">
      <Link href={`/${lang}/p/${p.handle}`} className="card-link">
        <div className="card-tile">
          <GlyphTile note={note(f.note)} x={f.x} y={f.y} z={f.z} />
          <span className="card-no mono">No. {p.no}</span>
        </div>
        <p className="card-house">{p.house}</p>
        <h3 className="card-name">{p.name}</h3>
        <p className="card-spec">
          {p.type} · {p.ml} ml
        </p>
        <p className="card-notes">
          {[p.chord.top.lead, p.chord.heart.lead, p.chord.base.lead].map((id) => note(id).name[lang]).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}
        </p>
      </Link>
      <div className="card-buy">
        <span className="price mono">{lempiras(p.price)}</span>
        {p.stock > 0 && p.stock <= 3 && <span className="stock">{t.fewLeft(p.stock)}</span>}
      </div>
      <AddToBag product={p} lang={lang} compact />
    </article>
  );
}
