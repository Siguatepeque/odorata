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
  photo: { src: string; w: number; h: number }; // cut-out, transparent PNG
  accord: { note: Text; image: string; also: Text; focus: { x: number; y: number; zoom: number } }; // the top note given the glyph treatment; focus frames it (0-1, zoom 1 = cover)
  /** [note id, prominence]: 3 = leads the scent, 2 = supporting, 1 = barely there. */
  pyramid: Record<"top" | "heart" | "base", [string, 1 | 2 | 3][]>;
  about: Text;
  facts: { label: Text; value: Text }[];
};

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
      { label: { es: "Cuándo", en: "When" }, value: { es: "Noche, clima fresco, salidas", en: "Evenings, cool weather, going out" } },
      { label: { es: "Carácter", en: "Character" }, value: { es: "Dulce, especiado, cálido", en: "Sweet, spiced, warm" } },
      { label: { es: "Concentración", en: "Concentration" }, value: { es: "Eau de Parfum: dura varias horas", en: "Eau de Parfum: lasts several hours" } },
    ],
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

export const DELIVERY = {
  city: { fee: 100, where: { es: "Tegucigalpa y San Pedro Sula", en: "Tegucigalpa and San Pedro Sula" }, days: { es: "1 a 2 días hábiles", en: "1 to 2 business days" } },
  rest: { fee: 180, where: { es: "Resto de Honduras", en: "Rest of Honduras" }, days: { es: "2 a 4 días hábiles", en: "2 to 4 business days" } },
};

export const lempiras = (n: number) => `L ${n.toLocaleString("en-US")}`;
