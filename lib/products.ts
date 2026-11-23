// Product data shaped like the Shopify records that will replace it.
// Notes come from the published pyramid (Parfumo, Notino). Price and stock are placeholders.

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
  photo?: { src: string; w: number; h: number }; // cut-out, transparent PNG; originals we only name have none
  accord: { note: Text; image: string; also: Text; focus: { x: number; y: number; zoom: number } }; // the top note given the glyph treatment; focus frames it (0-1, zoom 1 = cover)
  /** [note id, prominence]: 3 = leads the scent, 2 = supporting, 1 = barely there. */
  pyramid: Record<"top" | "heart" | "base", [string, 1 | 2 | 3][]>;
  about: Text;
  facts: { label: Text; value: Text }[];
  /** An alternative points at the perfume it follows, how closely, and what it trades. */
  inspiredBy?: { handle: string; level: Level; tradeoff: Text };
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
    photo: { src: "/products/liquid-brun.png", w: 356, h: 981 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: "/products/cinnamon-plate.jpg",
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
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
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
    photo: { src: "/products/althair.png", w: 476, h: 986 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: "/products/cinnamon-plate.jpg",
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
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
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
    photo: { src: "/products/monarque.png", w: 239, h: 471 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: "/products/cinnamon-plate.jpg",
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
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
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
    photo: { src: "/products/island-vanilla-dunes.png", w: 272, h: 600 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: "/products/cinnamon-plate.jpg",
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
      { label: { es: "Para", en: "For" }, value: { es: "Hombre", en: "Men" } },
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
    photo: { src: "/products/historic-sahara.png", w: 266, h: 600 },
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: "/products/cinnamon-plate.jpg",
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
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
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
    photo: { src: "/products/art-of-nature-ii.png", w: 320, h: 600 },
    accord: {
      note: { es: "Manzana", en: "Apple" },
      image: "/products/apple-plate.jpg",
      focus: { x: 0.6, y: 0.5, zoom: 1.15 },
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
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
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
];

// Every note with its picture. Molecules (ambroxan, musk) are drawn, since they are made in a lab.
export const NOTES: Record<string, { name: Text; img: string }> = {
  canela: { name: { es: "Canela", en: "Cinnamon" }, img: "/notes/ingredients/canela.jpg" },
  azahar: { name: { es: "Azahar", en: "Orange blossom" }, img: "/notes/ingredients/azahar.jpg" },
  cardamomo: { name: { es: "Cardamomo", en: "Cardamom" }, img: "/notes/ingredients/cardamomo.jpg" },
  bergamota: { name: { es: "Bergamota", en: "Bergamot" }, img: "/notes/ingredients/bergamota.jpg" },
  vainilla: { name: { es: "Vainilla", en: "Vanilla" }, img: "/notes/ingredients/vainilla.jpg" },
  elemi: { name: { es: "Elemí", en: "Elemi" }, img: "/notes/ingredients/elemi.jpg" },
  praline: { name: { es: "Praliné", en: "Praline" }, img: "/notes/ingredients/praline.jpg" },
  ambroxan: { name: { es: "Ámbar gris", en: "Ambroxan" }, img: "/notes/ingredients/ambroxan.jpg" },
  almizcle: { name: { es: "Almizcle", en: "Musk" }, img: "/notes/ingredients/almizcle.jpg" },
  guayaco: { name: { es: "Madera de guayaco", en: "Guaiac wood" }, img: "/notes/ingredients/guayaco.jpg" },
  almendra: { name: { es: "Almendra", en: "Almond" }, img: "/notes/ingredients/almendra.jpg" },
  tonka: { name: { es: "Haba tonka", en: "Tonka bean" }, img: "/notes/ingredients/tonka.jpg" },
  ambar: { name: { es: "Ámbar", en: "Amber" }, img: "/notes/ingredients/ambar.jpg" },
  azucar: { name: { es: "Azúcar", en: "Sugar" }, img: "/notes/ingredients/azucar.jpg" },
  madera: { name: { es: "Maderas", en: "Woods" }, img: "/notes/ingredients/madera.jpg" },
  manzana: { name: { es: "Manzana", en: "Apple" }, img: "/notes/ingredients/manzana.jpg" },
  mandarina: { name: { es: "Mandarina", en: "Mandarin" }, img: "/notes/ingredients/mandarina.jpg" },
  olibano: { name: { es: "Olíbano", en: "Frankincense" }, img: "/notes/ingredients/olibano.jpg" },
  rosa: { name: { es: "Rosa", en: "Rose" }, img: "/notes/ingredients/rosa.jpg" },
  cedro: { name: { es: "Cedro", en: "Cedar" }, img: "/notes/ingredients/cedro.jpg" },
};

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
