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
    // ponytail: trade-off lines are placeholder opinions; the owner writes the real ones per product.
    inspiredBy: {
      handle: "althair",
      level: "closest",
      tradeoff: { es: "Muy cerca del original; un poco más dulce y dura algo menos.", en: "Very close to the original; a little sweeter, lasts a bit less." },
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
      es: "Canela y cardamomo sobre vainilla bourbon y praliné, con maderas secas al fondo. Cálido, refinado y muy cremoso.",
      en: "Cinnamon and cardamom over bourbon vanilla and praline, with dry woods underneath. Warm, refined and very creamy.",
    },
    facts: [
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, clima fresco", en: "Evenings, cool weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Dulce, especiado, cálido", en: "Sweet, spiced, warm" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
  },
  // Invented demo alternatives, one per remaining level.
  {
    handle: "bourbon-noir",
    name: "Bourbon Noir",
    house: "Casa Ilian",
    type: { es: "Eau de Parfum", en: "Eau de Parfum" },
    ml: 100,
    year: 2025,
    price: 1850,
    stock: 8,
    accord: {
      note: { es: "Cardamomo", en: "Cardamom" },
      image: "/products/cinnamon-plate.jpg",
      focus: { x: 0.6, y: 0.46, zoom: 1.22 },
      also: { es: "con un toque de canela", en: "with a touch of cinnamon" },
    },
    pyramid: {
      top: [["cardamomo", 3], ["canela", 2]],
      heart: [["vainilla", 3]],
      base: [["guayaco", 3], ["almizcle", 2]],
    },
    about: {
      es: "La misma vainilla especiada, pero más seca y amaderada. Menos postre, más whisky.",
      en: "The same spiced vanilla, drier and woodier. Less dessert, more whisky.",
    },
    facts: [
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, clima fresco", en: "Evenings, cool weather" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Amaderado, especiado", en: "Woody, spiced" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
    inspiredBy: {
      handle: "althair",
      level: "dna",
      tradeoff: { es: "Menos dulce y más amaderado; dura más en la piel.", en: "Less sweet and woodier; lasts longer on skin." },
    },
  },
  {
    handle: "canela-ambar",
    name: "Canela Ámbar",
    house: "Orvel",
    type: { es: "Eau de Toilette", en: "Eau de Toilette" },
    ml: 100,
    year: 2025,
    price: 1350,
    stock: 12,
    accord: {
      note: { es: "Canela", en: "Cinnamon" },
      image: "/products/cinnamon-plate.jpg",
      focus: { x: 0.6, y: 0.46, zoom: 1.22 },
      also: { es: "con bergamota", en: "with bergamot" },
    },
    pyramid: {
      top: [["canela", 3], ["bergamota", 2]],
      heart: [["azahar", 2]],
      base: [["ambroxan", 3]],
    },
    about: {
      es: "Canela luminosa sobre ámbar limpio. Ligero, para el día.",
      en: "Bright cinnamon over clean amber. Light, for daytime.",
    },
    facts: [
      { label: { es: "Para", en: "For" }, value: { es: "Hombre o mujer", en: "Anyone" } },
      { label: { es: "Cuándo", en: "When" }, value: { es: "Día, todo el año", en: "Daytime, all year" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Especiado, fresco", en: "Spiced, fresh" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Toilette: más ligero", en: "Eau de Toilette: lighter" } },
    ],
    inspiredBy: {
      handle: "althair",
      level: "vibe",
      tradeoff: { es: "La misma calidez especiada, más ligera y sin praliné.", en: "Same spiced warmth, lighter and without praline." },
    },
  },
];

// Every note with its picture. Molecules (ambroxan, musk) are drawn, since they are made in a lab.
export const NOTES: Record<string, { name: Text; img: string }> = {
  canela: { name: { es: "Canela", en: "Cinnamon" }, img: "/notes/ingredients/canela.jpg" },
  azahar: { name: { es: "Azahar", en: "Orange blossom" }, img: "/notes/ingredients/azahar.jpg" },
  cardamomo: { name: { es: "Cardamomo", en: "Cardamom" }, img: "/notes/ingredients/cardamomo.jpg" },
  bergamota: { name: { es: "Bergamota", en: "Bergamot" }, img: "/notes/ingredients/bergamota.jpg" },
  vainilla: { name: { es: "Vainilla bourbon", en: "Bourbon vanilla" }, img: "/notes/ingredients/vainilla.jpg" },
  elemi: { name: { es: "Elemí", en: "Elemi" }, img: "/notes/ingredients/elemi.jpg" },
  praline: { name: { es: "Praliné", en: "Praline" }, img: "/notes/ingredients/praline.jpg" },
  ambroxan: { name: { es: "Ámbar gris", en: "Ambroxan" }, img: "/notes/ingredients/ambroxan.jpg" },
  almizcle: { name: { es: "Almizcle", en: "Musk" }, img: "/notes/ingredients/almizcle.jpg" },
  guayaco: { name: { es: "Madera de guayaco", en: "Guaiac wood" }, img: "/notes/ingredients/guayaco.jpg" },
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
