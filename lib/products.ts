// Product data shaped like the Shopify records that will replace it.
// Notes come from the published pyramid (Parfumo, Notino). Price and stock are placeholders.

/** Prefix for files in public/, so the static GitHub Pages copy finds them under /odorata. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type Lang = "es" | "en";
export type Text = Record<Lang, string>;

export type Product = {
  handle: string;
  name: string;
  house: string;
  type: Text;
  ml: number;
  year: number;
  price: number; // Lempiras, taxes included
  stock: number;
  gender: Gender;
  photo?: { src: string; w: number; h: number }; // cut-out, transparent PNG; originals we only name have none
  accord: { note: Text; image: string; also: Text; focus: { x: number; y: number; zoom: number } }; // the top note given the glyph treatment; focus frames it (0-1, zoom 1 = cover)
  /** [note id, prominence]: 3 = leads the scent, 2 = supporting, 1 = barely there. */
  pyramid: Record<"top" | "heart" | "base", [string, 1 | 2 | 3][]>;
  about: Text;
  facts: { label: Text; value: Text }[];
  /** An alternative points at the perfume it follows, how closely, and what it trades. */
  inspiredBy?: { handle: string; level: Level; tradeoff: Text };
};

export type Gender = "men" | "women" | "unisex";
export const GENDERS: Record<Gender, Text> = {
  men: { es: "Hombre", en: "Men" },
  women: { es: "Mujer", en: "Women" },
  unisex: { es: "Unisex", en: "Unisex" },
};

/** Scent families in plain words, the way big retailers group them. A perfume's families come from its leading notes. */
export type Family = "sweet" | "spicy" | "woody" | "amber" | "floral" | "fresh";
export const FAMILIES: Record<Family, { name: Text; hint: Text }> = {
  sweet: { name: { es: "Dulce", en: "Sweet" }, hint: { es: "Vainilla, praliné, tonka", en: "Vanilla, praline, tonka" } },
  spicy: { name: { es: "Especiado", en: "Spicy" }, hint: { es: "Canela, cardamomo", en: "Cinnamon, cardamom" } },
  woody: { name: { es: "Amaderado", en: "Woody" }, hint: { es: "Cedro, guayaco, maderas", en: "Cedar, guaiac, woods" } },
  amber: { name: { es: "Ámbar y almizcle", en: "Amber and musk" }, hint: { es: "Ámbar, almizcle, olíbano", en: "Amber, musk, frankincense" } },
  floral: { name: { es: "Floral", en: "Floral" }, hint: { es: "Rosa, azahar", en: "Rose, orange blossom" } },
  fresh: { name: { es: "Fresco y frutal", en: "Fresh and fruity" }, hint: { es: "Bergamota, mandarina, manzana", en: "Bergamot, mandarin, apple" } },
};

export type Level = "closest" | "dna" | "vibe";
export const LEVELS: Record<Level, { name: Text; meaning: Text }> = {
  closest: {
    name: { es: "Casi idéntico", en: "Closest match" },
    meaning: { es: "Busca reproducir el original lo más fiel posible.", en: "Tries to reproduce the original as faithfully as possible." },
  },
  dna: {
    name: { es: "Mismo ADN", en: "Same DNA" },
    meaning: { es: "Claramente emparentado, con un cambio que algunos prefieren.", en: "Clearly related, with a change some people prefer." },
  },
  vibe: {
    name: { es: "Mismo estilo", en: "Similar vibe" },
    meaning: { es: "Comparte la sensación, no la fórmula.", en: "Shares the feeling, not the formula." },
  },
};
const ORDER: Level[] = ["closest", "dna", "vibe"];

export const PRODUCTS: Product[] = [
  {
    handle: "liquid-brun",
    name: "Liquid Brun",
    house: "French Avenue",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2024,
    price: 2450,
    stock: 6,
    gender: "unisex",
    photo: { src: `${BASE}/products/liquid-brun.webp`, w: 356, h: 981 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: `${BASE}/products/cinnamon-plate.jpg`,
      focus: { x: 0.6, y: 0.46, zoom: 1.22 },
      also: { es: "con cardamomo, azahar y bergamota", en: "with cardamom, orange blossom and bergamot" },
    },
    pyramid: {
      top: [["canela", 3], ["azahar", 2], ["cardamomo", 2], ["bergamota", 1]],
      heart: [["vainilla", 3], ["elemi", 1]],
      base: [["praline", 3], ["ambroxan", 2], ["almizcle", 2], ["guayaco", 2]],
    },
    about: {
      es: "Abre caliente: canela y cardamomo, iluminados por un poco de azahar y bergamota. Después llega la vainilla bourbon, suave y cremosa, y al final queda un fondo de praliné y maderas que se pega a la piel. Dulce, pero nunca infantil.",
      en: "It opens warm: cinnamon and cardamom, lifted by a little orange blossom and bergamot. Then comes bourbon vanilla, soft and creamy, and it settles into praline and woods that stay close to the skin. Sweet, but never childish.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, clima fresco", en: "Evenings, cool weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Dulce, especiado, cálido", en: "Sweet, spiced, warm" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
    // Levels and trade-offs summarise what reviewers repeat most often (Fragrantica, Parfumo, Reddit, YouTube), not our own opinion.
    inspiredBy: {
      handle: "althair",
      level: "closest",
      tradeoff: { es: "De las copias más fieles: la mayoría lo encuentra casi igual al original.", en: "One of the most faithful copies: most people find it nearly the same as the original." },
    },
  },
  {
    handle: "althair",
    name: "Althaïr",
    house: "Parfums de Marly",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 125,
    year: 2023,
    price: 9950,
    stock: 2,
    gender: "unisex",
    photo: { src: `${BASE}/products/althair.webp`, w: 476, h: 986 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: `${BASE}/products/cinnamon-plate.jpg`,
      focus: { x: 0.6, y: 0.46, zoom: 1.22 },
      also: { es: "con cardamomo, azahar y bergamota", en: "with cardamom, orange blossom and bergamot" },
    },
    pyramid: {
      top: [["canela", 3], ["azahar", 2], ["cardamomo", 2], ["bergamota", 1]],
      heart: [["vainilla", 3], ["elemi", 1]],
      base: [["praline", 3], ["almizcle", 2], ["ambroxan", 2], ["guayaco", 2]],
    },
    about: {
      es: "Abre con canela y cardamomo tibios, con un brillo de azahar y bergamota. En el corazón, vainilla bourbon cremosa y un toque resinoso de elemí. Termina en praliné, almizcle y maderas secas: cálido, pulido y con mucha presencia, sin volverse empalagoso.",
      en: "It opens with warm cinnamon and cardamom, brightened by orange blossom and bergamot. At the heart, creamy bourbon vanilla and a resinous touch of elemi. It settles into praline, musk and dry woods: warm, polished and full of presence without turning cloying.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, clima fresco", en: "Evenings, cool weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Dulce, especiado, cálido", en: "Sweet, spiced, warm" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
  },
  // Real alternatives. Notes as published (Notino, Fragrantica); every note is listed at the same weight
  // because no source ranks them. Year and concentration from retailer listings.
  {
    handle: "monarque",
    name: "The Lion's Club Monarque",
    house: "Armaf",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2024,
    price: 2250,
    stock: 4,
    gender: "unisex",
    photo: { src: `${BASE}/products/monarque.webp`, w: 239, h: 471 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: `${BASE}/products/cinnamon-plate.jpg`,
      focus: { x: 0.6, y: 0.46, zoom: 1.22 },
      also: { es: "con azahar, cardamomo y bergamota", en: "with orange blossom, cardamom and bergamot" },
    },
    pyramid: {
      top: [["canela", 2], ["azahar", 2], ["cardamomo", 2], ["bergamota", 2]],
      heart: [["elemi", 2], ["vainilla", 2]],
      base: [["almendra", 2], ["praline", 2], ["almizcle", 2], ["guayaco", 2], ["ambroxan", 2], ["tonka", 2]],
    },
    about: {
      es: "Abre con canela, cardamomo y azahar, con un toque de bergamota. En el corazón, vainilla y el aire resinoso del elemí. Termina en almendra confitada, praliné, haba tonka y maderas: dulce, especiado y envolvente.",
      en: "It opens with cinnamon, cardamom and orange blossom, with a touch of bergamot. At the heart, vanilla and the resinous air of elemi. It settles into candied almond, praline, tonka and woods: sweet, spiced and enveloping.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, clima fresco", en: "Evenings, cool weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Dulce, especiado, cálido", en: "Sweet, spiced, warm" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
    inspiredBy: {
      handle: "althair",
      level: "closest",
      tradeoff: { es: "Para la mayoría, de los más cercanos al original; algunos lo sienten un poco más dulce.", en: "For most people, one of the closest to the original; some find it a little sweeter." },
    },
  },
  {
    handle: "island-vanilla-dunes",
    name: "Island Vanilla Dunes",
    house: "Khadlaj",
    type: { es: "Extrait de Parfum", en: "Extrait de Parfum" },
    ml: 100,
    year: 2025,
    price: 1450,
    stock: 7,
    gender: "men",
    photo: { src: `${BASE}/products/island-vanilla-dunes.webp`, w: 272, h: 600 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: `${BASE}/products/cinnamon-plate.jpg`,
      focus: { x: 0.6, y: 0.46, zoom: 1.22 },
      also: { es: "con cardamomo y bergamota", en: "with cardamom and bergamot" },
    },
    // Notino lists vanilla in the opening and "bourbon" in the heart; shown once, in the heart.
    pyramid: {
      top: [["canela", 2], ["cardamomo", 2], ["bergamota", 2]],
      heart: [["azahar", 2], ["guayaco", 2], ["vainilla", 2]],
      base: [["ambar", 2], ["praline", 2], ["almizcle", 2]],
    },
    about: {
      es: "Abre especiado: canela y cardamomo con un brillo de bergamota. El corazón junta azahar, vainilla bourbon y madera de guayaco. Al final, ámbar, praliné y almizcle lo dejan cremoso y cálido. Hecho para noches y días frescos.",
      en: "It opens spiced: cinnamon and cardamom with a flash of bergamot. The heart brings orange blossom, bourbon vanilla and guaiac wood. Amber, praline and musk leave it creamy and warm. Made for evenings and cool days.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, clima fresco", en: "Evenings, cool weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Especiado, cremoso, dulce", en: "Spiced, creamy, sweet" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Extrait de Parfum: la más intensa", en: "Extrait de Parfum: the most concentrated" } },
    ],
    inspiredBy: {
      handle: "althair",
      level: "dna",
      tradeoff: { es: "Muy parecido, no idéntico: más fresco y cremoso; el original es más denso.", en: "Very close, not identical: fresher and creamier; the original is denser." },
    },
  },
  {
    handle: "historic-sahara",
    name: "Historic Sahara",
    house: "Afnan",
    type: { es: "Extrait de Parfum", en: "Extrait de Parfum" },
    ml: 100,
    year: 2025,
    price: 1650,
    stock: 5,
    gender: "unisex",
    photo: { src: `${BASE}/products/historic-sahara.webp`, w: 266, h: 600 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: `${BASE}/products/cinnamon-plate.jpg`,
      focus: { x: 0.6, y: 0.46, zoom: 1.22 },
      also: { es: "con cardamomo y bergamota", en: "with cardamom and bergamot" },
    },
    pyramid: {
      top: [["bergamota", 2], ["canela", 2], ["cardamomo", 2]],
      heart: [["elemi", 2], ["vainilla", 2], ["azucar", 2]],
      base: [["almendra", 2], ["almizcle", 2], ["praline", 2], ["tonka", 2], ["madera", 2], ["ambroxan", 2]],
    },
    about: {
      es: "Abre con bergamota, canela y cardamomo. Luego el elemí resinoso se envuelve en vainilla y un poco de azúcar. Termina en almendra, haba tonka, praliné y maderas, con almizcle y ámbar gris: cálido, seguro y elegante.",
      en: "It opens with bergamot, cinnamon and cardamom. Then resinous elemi wraps into vanilla and a little sugar. It settles into almond, tonka, praline and woods, with musk and ambroxan: warm, confident and elegant.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, otoño e invierno", en: "Evenings, autumn and winter" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Dulce, especiado, almendrado", en: "Sweet, spiced, almondy" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Extrait de Parfum: la más intensa", en: "Extrait de Parfum: the most concentrated" } },
    ],
    inspiredBy: {
      handle: "althair",
      level: "dna",
      tradeoff: { es: "Una variación, no una copia: menos dulce, más especiado y con más almendra.", en: "A variation, not a copy: less sweet, spicier, with more almond." },
    },
  },
  {
    handle: "art-of-nature-ii",
    name: "Art of Nature II",
    house: "Lattafa",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2024,
    price: 1250,
    stock: 9,
    gender: "unisex",
    photo: { src: `${BASE}/products/art-of-nature-ii.webp`, w: 320, h: 600 },
    accord: {
      note: { es: "Manzana", en: "Apple" },
      image: `${BASE}/products/apple-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con mandarina, bergamota y olíbano", en: "with mandarin, bergamot and frankincense" },
    },
    pyramid: {
      top: [["manzana", 2], ["mandarina", 2], ["bergamota", 2], ["olibano", 2]],
      heart: [["azahar", 2], ["rosa", 2], ["cardamomo", 2]],
      base: [["vainilla", 2], ["ambroxan", 2], ["guayaco", 2], ["cedro", 2], ["almizcle", 2]],
    },
    about: {
      es: "Abre fresco y frutal: manzana, mandarina y bergamota, con un hilo ahumado de olíbano. Se suaviza con azahar, rosa y cardamomo, y termina en vainilla, maderas de cedro y guayaco, ámbar gris y almizcle. Cálido, pero luminoso.",
      en: "It opens fresh and fruity: apple, mandarin and bergamot, with a smoky thread of frankincense. It softens into orange blossom, rose and cardamom, then settles into vanilla, cedar and guaiac woods, ambroxan and musk. Warm, but bright.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Diario y ocasiones especiales", en: "Everyday and special occasions" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Frutal, amaderado, cálido", en: "Fruity, woody, warm" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
    inspiredBy: {
      handle: "althair",
      level: "dna",
      tradeoff: { es: "Cercano, con un giro: más brillante y frutal, con menos praliné.", en: "Close, with a twist: brighter and fruitier, with less praline." },
    },
  },
  // Imagination cluster, read 2026-11-23. Notes and years from Fragrantica; Imaginary from Montagne's own page.
  // Imagination's price and key notes from louisvuitton.com (US$360 / 100 ml). Prices and margins in
  // research/decisions.md. Leading notes are marked only where the house names them (LV's "key notes").
  {
    handle: "imagination",
    name: "Imagination",
    house: "Louis Vuitton",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2021,
    price: 15900,
    stock: 0, // sold to order only, paid up front: needs the "por encargo" state (handoff.md)
    gender: "men",
    photo: { src: `${BASE}/products/imagination.webp`, w: 251, h: 600 },
    accord: {
      note: { es: "Bergamota", en: "Bergamot" },
      image: `${BASE}/products/citrus-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con té negro y ámbar gris", en: "with black tea and ambroxan" },
    },
    pyramid: {
      top: [["cidra", 2], ["bergamota", 3], ["naranja", 2]],
      heart: [["jengibre", 2], ["neroli", 2], ["canela", 2]],
      base: [["te-negro", 3], ["ambroxan", 3], ["guayaco", 2], ["olibano", 2]],
    },
    about: {
      es: "Abre luminoso: cidra, bergamota y naranja. En el corazón, jengibre y canela con un toque floral de neroli. Termina en té negro seco sobre una dosis generosa de ámbar gris, con guayaco y olíbano: limpio, elegante y duradero para ser cítrico.",
      en: "It opens bright: citron, bergamot and orange. At the heart, ginger and cinnamon with a floral touch of neroli. It settles into dry black tea over a generous dose of ambroxan, with guaiac and frankincense: clean, elegant and long-lasting for a citrus.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Día, todo el año", en: "Daytime, year-round" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Cítrico, té, ámbar", en: "Citrus, tea, amber" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
  },
  {
    handle: "hectic",
    name: "Hectic",
    house: "Bujairami",
    type: { es: "Extrait de Parfum", en: "Extrait de Parfum" },
    ml: 100,
    year: 2024,
    price: 2345,
    stock: 3,
    gender: "unisex",
    photo: { src: `${BASE}/products/hectic.webp`, w: 204, h: 600 },
    accord: {
      note: { es: "Bergamota", en: "Bergamot" },
      image: `${BASE}/products/citrus-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con té negro y ámbar gris", en: "with black tea and ambroxan" },
    },
    pyramid: {
      top: [["bergamota", 2], ["naranja", 2], ["cidra", 2]],
      heart: [["canela", 2], ["jengibre", 2], ["neroli", 2]],
      base: [["te-negro", 2], ["ambroxan", 2], ["guayaco", 2], ["olibano", 2]],
    },
    about: {
      es: "La misma estructura que Imagination: cítricos brillantes, jengibre y canela, y un fondo de té negro y ámbar gris. El té se siente especialmente real. Proyecta menos que el original, así que va bien en la oficina.",
      en: "The same structure as Imagination: bright citrus, ginger and cinnamon, and a base of black tea and ambroxan. The tea feels especially real. It projects less than the original, so it suits the office.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Día, oficina", en: "Daytime, office" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Cítrico, té, limpio", en: "Citrus, tea, clean" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Extrait de Parfum: la más intensa", en: "Extrait de Parfum: the most concentrated" } },
    ],
    inspiredBy: {
      handle: "imagination",
      level: "closest",
      tradeoff: { es: "Muy fiel al acorde de té y ámbar; se queda más cerca de la piel que el original.", en: "Very faithful to the tea-and-amber accord; stays closer to the skin than the original." },
    },
  },
  {
    handle: "imaginary",
    name: "Imaginary",
    house: "Montagne Parfums",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 50,
    year: 2023, // unverified
    price: 2395,
    stock: 3,
    gender: "unisex",
    photo: { src: `${BASE}/products/imaginary.webp`, w: 241, h: 600 },
    accord: {
      note: { es: "Bergamota", en: "Bergamot" },
      image: `${BASE}/products/citrus-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con jengibre, té negro y ámbar gris", en: "with ginger, black tea and ambroxan" },
    },
    pyramid: {
      top: [["cidra", 2], ["bergamota", 2], ["naranja", 2]],
      heart: [["jengibre", 2], ["neroli", 2], ["canela", 2]],
      base: [["te-negro", 2], ["ambroxan", 2], ["olibano", 2], ["guayaco", 2]],
    },
    about: {
      es: "Una reconstrucción nota por nota de Imagination: cidra, bergamota y naranja; jengibre, neroli y canela; té negro, ámbar gris, olíbano y guayaco. Hecho por encargo en Estados Unidos, en frasco de 50 ml.",
      en: "A note-for-note reconstruction of Imagination: citron, bergamot and orange; ginger, neroli and cinnamon; black tea, ambroxan, frankincense and guaiac. Compounded to order in the United States, in a 50 ml bottle.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Día, todo el año", en: "Daytime, year-round" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Cítrico, té, ámbar", en: "Citrus, tea, amber" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
    inspiredBy: {
      handle: "imagination",
      level: "closest",
      tradeoff: { es: "Copia la pirámide completa; frasco más pequeño (50 ml).", en: "Copies the full pyramid; smaller bottle (50 ml)." },
    },
  },
  {
    handle: "marwa",
    name: "Marwa",
    house: "Arabiyat Prestige",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2025,
    price: 1795,
    stock: 4,
    gender: "men",
    photo: { src: `${BASE}/products/marwa.webp`, w: 269, h: 600 },
    accord: {
      note: { es: "Bergamota", en: "Bergamot" },
      image: `${BASE}/products/citrus-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con jengibre, canela y té negro", en: "with ginger, cinnamon and black tea" },
    },
    pyramid: {
      top: [["bergamota", 2], ["limon", 2], ["naranja", 2]],
      heart: [["jengibre", 2], ["canela", 2], ["neroli", 2]],
      base: [["ambroxan", 2], ["guayaco", 2], ["olibano", 2], ["te-negro", 2]],
    },
    about: {
      es: "Bergamota, limón y naranja, y luego un corazón cálido de jengibre, canela y neroli. Termina en ámbar gris, guayaco, olíbano y té negro. Más especiado y amaderado que Imagination; se parece más en el fondo que en la salida.",
      en: "Bergamot, lemon and orange, then a warm heart of ginger, cinnamon and neroli. It settles into ambroxan, guaiac, frankincense and black tea. Spicier and woodier than Imagination; closest in the drydown rather than the opening.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Día, oficina", en: "Daytime, office" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Cítrico, especiado, amaderado", en: "Citrus, spiced, woody" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
    inspiredBy: {
      handle: "imagination",
      level: "dna",
      tradeoff: { es: "Mismo estilo de cítrico, té y ámbar, más especiado; proyecta menos.", en: "Same citrus-tea-amber style, spicier; projects less." },
    },
  },
  {
    handle: "hawas-kobra",
    name: "Hawas Kobra",
    house: "Rasasi",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2025,
    price: 1735,
    stock: 4,
    gender: "men",
    photo: { src: `${BASE}/products/hawas-kobra.webp`, w: 350, h: 600 },
    accord: {
      note: { es: "Bergamota", en: "Bergamot" },
      image: `${BASE}/products/citrus-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con jengibre, mandarina y té verde", en: "with ginger, mandarin and green tea" },
    },
    pyramid: {
      top: [["jengibre", 2], ["bergamota", 2], ["mandarina", 2]],
      heart: [["te-verde", 2], ["neroli", 2], ["canela", 2]],
      base: [["almizcle", 2], ["madera", 2], ["ambar", 2]],
    },
    about: {
      es: "Abre con jengibre, bergamota y mandarina, más frutal y filoso que Imagination. En lugar de té negro usa té verde, con neroli y canela, y termina en almizcle, maderas y ámbar. Proyecta fuerte.",
      en: "It opens with ginger, bergamot and mandarin, fruitier and sharper than Imagination. Green tea takes the place of black tea, with neroli and cinnamon, and it settles into musk, woods and amber. Strong projection.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Día, calor", en: "Daytime, hot weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Cítrico, fresco, intenso", en: "Citrus, fresh, bold" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
    inspiredBy: {
      handle: "imagination",
      level: "vibe",
      tradeoff: { es: "Una reinterpretación: té verde en vez de negro, más frutal y con más proyección.", en: "A reinterpretation: green tea instead of black, fruitier and louder." },
    },
  },
  {
    handle: "amber-oud-aqua-dubai",
    name: "Amber Oud Aqua Dubai",
    house: "Al Haramain",
    type: { es: "Extrait de Parfum", en: "Extrait de Parfum" },
    ml: 100,
    year: 2024,
    price: 2185,
    stock: 3,
    gender: "unisex",
    photo: { src: `${BASE}/products/amber-oud-aqua-dubai.webp`, w: 295, h: 600 },
    accord: {
      note: { es: "Bergamota", en: "Bergamot" },
      image: `${BASE}/products/citrus-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con mandarina, melón y piña", en: "with mandarin, melon and pineapple" },
    },
    pyramid: {
      top: [["notas-verdes", 2], ["bergamota", 2], ["mandarina", 2]],
      heart: [["melon", 2], ["ambar", 2], ["grosella-negra", 2], ["pina", 2]],
      base: [["almizcle", 2], ["petitgrain", 2], ["galbano", 2], ["vainilla", 2]],
    },
    about: {
      es: "Abre verde y cítrico: bergamota y mandarina. El corazón es jugoso, con melón, piña y grosella negra sobre ámbar, y termina en almizcle, petitgrain, gálbano y un poco de vainilla. Más frutal y acuático que Imagination.",
      en: "It opens green and citrusy: bergamot and mandarin. The heart is juicy, with melon, pineapple and blackcurrant over amber, and it settles into musk, petitgrain, galbanum and a little vanilla. Fruitier and more aquatic than Imagination.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Día, calor", en: "Daytime, hot weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Frutal, fresco, verde", en: "Fruity, fresh, green" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Extrait de Parfum: la más intensa", en: "Extrait de Parfum: the most concentrated" } },
    ],
    inspiredBy: {
      handle: "imagination",
      level: "vibe",
      tradeoff: { es: "El más votado en Fragrantica como parecido, aunque es más frutal y acuático; divide opiniones.", en: "The most-voted look-alike on Fragrantica, though fruitier and more aquatic; opinions split." },
    },
  },
  // Standalone for now: Fragrantica voters compare it to Hawas for Him and Invictus Aqua, neither in the catalog.
  {
    handle: "hawas-ice",
    name: "Hawas Ice",
    house: "Rasasi",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2023,
    price: 1595,
    stock: 4,
    gender: "men",
    photo: { src: `${BASE}/products/hawas-ice.webp`, w: 374, h: 600 },
    accord: {
      note: { es: "Manzana", en: "Apple" },
      image: `${BASE}/products/apple-plate.jpg`,
      focus: { x: 0.38, y: 0.5, zoom: 1.15 },
      also: { es: "con limón, bergamota y anís estrellado", en: "with lemon, bergamot and star anise" },
    },
    pyramid: {
      top: [["manzana", 2], ["limon", 2], ["bergamota", 2], ["anis", 2]],
      heart: [["ciruela", 2], ["azahar", 2], ["cardamomo", 2]],
      base: [["almizcle", 2], ["ambar", 2], ["madera", 2], ["musgo", 2]],
    },
    about: {
      es: "Abre con manzana, limón y bergamota, con un toque de anís estrellado. El corazón es dulce y jugoso: ciruela, azahar y cardamomo. Termina en almizcle, ámbar, maderas y musgo. Fresco, frutal y con mucha proyección.",
      en: "It opens with apple, lemon and bergamot, with a touch of star anise. The heart is sweet and juicy: plum, orange blossom and cardamom. It settles into musk, amber, woods and moss. Fresh, fruity and loud.",
    },
    facts: [
      { label: { es: "Cuándo", en: "When" }, value: { es: "Primavera y verano", en: "Spring and summer" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Frutal, fresco, dulce", en: "Fruity, fresh, sweet" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
  },
];

// Every note with its picture. Molecules (ambroxan, musk) are drawn, since they are made in a lab.
export const NOTES: Record<string, { name: Text; img: string; family: Family }> = {
  canela: { name: { es: "Canela", en: "Cinnamon" }, img: `${BASE}/notes/ingredients/canela.jpg`, family: "spicy" },
  azahar: { name: { es: "Azahar", en: "Orange blossom" }, img: `${BASE}/notes/ingredients/azahar.jpg`, family: "floral" },
  cardamomo: { name: { es: "Cardamomo", en: "Cardamom" }, img: `${BASE}/notes/ingredients/cardamomo.jpg`, family: "spicy" },
  bergamota: { name: { es: "Bergamota", en: "Bergamot" }, img: `${BASE}/notes/ingredients/bergamota.jpg`, family: "fresh" },
  vainilla: { name: { es: "Vainilla", en: "Vanilla" }, img: `${BASE}/notes/ingredients/vainilla.jpg`, family: "sweet" },
  elemi: { name: { es: "Elemí", en: "Elemi" }, img: `${BASE}/notes/ingredients/elemi.jpg`, family: "amber" },
  praline: { name: { es: "Praliné", en: "Praline" }, img: `${BASE}/notes/ingredients/praline.jpg`, family: "sweet" },
  ambroxan: { name: { es: "Ámbar gris", en: "Ambroxan" }, img: `${BASE}/notes/ingredients/ambroxan.jpg`, family: "amber" },
  almizcle: { name: { es: "Almizcle", en: "Musk" }, img: `${BASE}/notes/ingredients/almizcle.jpg`, family: "amber" },
  guayaco: { name: { es: "Madera de guayaco", en: "Guaiac wood" }, img: `${BASE}/notes/ingredients/guayaco.jpg`, family: "woody" },
  almendra: { name: { es: "Almendra", en: "Almond" }, img: `${BASE}/notes/ingredients/almendra.jpg`, family: "sweet" },
  tonka: { name: { es: "Haba tonka", en: "Tonka bean" }, img: `${BASE}/notes/ingredients/tonka.jpg`, family: "sweet" },
  ambar: { name: { es: "Ámbar", en: "Amber" }, img: `${BASE}/notes/ingredients/ambar.jpg`, family: "amber" },
  azucar: { name: { es: "Azúcar", en: "Sugar" }, img: `${BASE}/notes/ingredients/azucar.jpg`, family: "sweet" },
  madera: { name: { es: "Maderas", en: "Woods" }, img: `${BASE}/notes/ingredients/madera.jpg`, family: "woody" },
  manzana: { name: { es: "Manzana", en: "Apple" }, img: `${BASE}/notes/ingredients/manzana.jpg`, family: "fresh" },
  mandarina: { name: { es: "Mandarina", en: "Mandarin" }, img: `${BASE}/notes/ingredients/mandarina.jpg`, family: "fresh" },
  olibano: { name: { es: "Olíbano", en: "Frankincense" }, img: `${BASE}/notes/ingredients/olibano.jpg`, family: "amber" },
  rosa: { name: { es: "Rosa", en: "Rose" }, img: `${BASE}/notes/ingredients/rosa.jpg`, family: "floral" },
  cedro: { name: { es: "Cedro", en: "Cedar" }, img: `${BASE}/notes/ingredients/cedro.jpg`, family: "woody" },
  cidra: { name: { es: "Cidra", en: "Citron" }, img: `${BASE}/notes/ingredients/cidra.jpg`, family: "fresh" },
  naranja: { name: { es: "Naranja", en: "Orange" }, img: `${BASE}/notes/ingredients/naranja.jpg`, family: "fresh" },
  jengibre: { name: { es: "Jengibre", en: "Ginger" }, img: `${BASE}/notes/ingredients/jengibre.jpg`, family: "spicy" },
  neroli: { name: { es: "Neroli", en: "Neroli" }, img: `${BASE}/notes/ingredients/neroli.jpg`, family: "floral" },
  "te-negro": { name: { es: "Té negro", en: "Black tea" }, img: `${BASE}/notes/ingredients/te-negro.jpg`, family: "woody" },
  "te-verde": { name: { es: "Té verde", en: "Green tea" }, img: `${BASE}/notes/ingredients/te-verde.jpg`, family: "fresh" },
  petitgrain: { name: { es: "Petitgrain", en: "Petitgrain" }, img: `${BASE}/notes/ingredients/petitgrain.jpg`, family: "fresh" },
  limon: { name: { es: "Limón", en: "Lemon" }, img: `${BASE}/notes/ingredients/limon.jpg`, family: "fresh" },
  "notas-verdes": { name: { es: "Notas verdes", en: "Green notes" }, img: `${BASE}/notes/ingredients/notas-verdes.jpg`, family: "fresh" },
  melon: { name: { es: "Melón", en: "Melon" }, img: `${BASE}/notes/ingredients/melon.jpg`, family: "fresh" },
  "grosella-negra": { name: { es: "Grosella negra", en: "Blackcurrant" }, img: `${BASE}/notes/ingredients/grosella-negra.jpg`, family: "fresh" },
  pina: { name: { es: "Piña", en: "Pineapple" }, img: `${BASE}/notes/ingredients/pina.jpg`, family: "fresh" },
  galbano: { name: { es: "Gálbano", en: "Galbanum" }, img: `${BASE}/notes/ingredients/galbano.jpg`, family: "fresh" },
  anis: { name: { es: "Anís estrellado", en: "Star anise" }, img: `${BASE}/notes/ingredients/anis.jpg`, family: "spicy" },
  ciruela: { name: { es: "Ciruela", en: "Plum" }, img: `${BASE}/notes/ingredients/ciruela.jpg`, family: "sweet" },
  musgo: { name: { es: "Musgo", en: "Moss" }, img: `${BASE}/notes/ingredients/musgo.jpg`, family: "woody" },
};

export const notesOf = (p: Product) => [...new Set((["top", "heart", "base"] as const).flatMap((t) => p.pyramid[t].map(([id]) => id)))];
/**
 * Families of the notes that lead the scent (prominence 3). When a house publishes no leading notes,
 * the family (or tied families) with the most notes stands in.
 */
export const familiesOf = (p: Product): Family[] => {
  const all = (["top", "heart", "base"] as const).flatMap((t) => p.pyramid[t]).filter(([id]) => NOTES[id]);
  const leads = all.filter(([, lvl]) => lvl === 3);
  if (leads.length) return [...new Set(leads.map(([id]) => NOTES[id].family))];
  const tally = all.reduce<Partial<Record<Family, number>>>((acc, [id]) => ((acc[NOTES[id].family] = (acc[NOTES[id].family] ?? 0) + 1), acc), {});
  const top = Math.max(...Object.values(tally));
  return (Object.keys(tally) as Family[]).filter((f) => tally[f] === top);
};

/** Facts as shown, with who it's for first. */
export const factsOf = (p: Product) => [{ label: { es: "Para", en: "For" }, value: GENDERS[p.gender] }, ...p.facts];

export const product = (handle: string) => PRODUCTS.find((p) => p.handle === handle);

/** Alternatives that follow a given perfume, closest first. */
export const alternativesTo = (handle: string) =>
  PRODUCTS.filter((p) => p.inspiredBy?.handle === handle).sort((a, b) => ORDER.indexOf(a.inspiredBy!.level) - ORDER.indexOf(b.inspiredBy!.level));
export const byLevel = (list: Product[]) => ORDER.map((level) => ({ level, items: list.filter((p) => p.inspiredBy?.level === level) })).filter((g) => g.items.length);

export const DELIVERY = {
  city: { fee: 100, where: { es: "Tegucigalpa y San Pedro Sula", en: "Tegucigalpa and San Pedro Sula" }, days: { es: "1 a 2 días hábiles", en: "1 to 2 business days" } },
  rest: { fee: 180, where: { es: "Resto de Honduras", en: "Rest of Honduras" }, days: { es: "2 a 4 días hábiles", en: "2 to 4 business days" } },
};

export const lempiras = (n: number) => `L ${n.toLocaleString("en-US")}`;
