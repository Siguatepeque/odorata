// Mock catalog shaped like the Shopify data that will replace it.
// Every house, product, price and delivery fee here is an illustrative placeholder.

export type Lang = "es" | "en";
export type Text = Record<Lang, string>;

/** Notes with footage drive the glyph fields. `keyBlack`: the clip's backdrop is black. */
export type FootageNote = {
  id: string;
  at: number; // still frame (seconds) when motion is off
  no: string; // index number, as on a perfumer's organ
  name: Text;
  smell: Text; // one plain line
  video: string;
  poster: string;
  keyBlack: boolean;
  fit: "cover" | "contain";
  tint: string; // the note's own colour, for active states
};

export const NOTES: FootageNote[] = [
  { id: "fresa", at: 4, no: "012", name: { es: "Fresa", en: "Strawberry" }, smell: { es: "Dulce, jugosa, un poco ácida.", en: "Sweet, juicy, a little tart." }, video: "/notes/fresa.mp4", poster: "/notes/fresa.jpg", keyBlack: false, fit: "cover", tint: "#C8102E" },
  { id: "peonia", at: 6, no: "047", name: { es: "Peonía", en: "Peony" }, smell: { es: "Flor fresca y rosada, limpia.", en: "Fresh, rosy, clean flower." }, video: "/notes/peonia.mp4", poster: "/notes/peonia.jpg", keyBlack: true, fit: "cover", tint: "#B0123F" },
  { id: "azafran", at: 6, no: "063", name: { es: "Azafrán", en: "Saffron" }, smell: { es: "Cálido, especiado, casi cuero.", en: "Warm, spiced, almost leather." }, video: "/notes/azafran.mp4", poster: "/notes/azafran.jpg", keyBlack: true, fit: "cover", tint: "#7A4FB5" },
  { id: "violeta", at: 6, no: "081", name: { es: "Violeta", en: "Violet" }, smell: { es: "Polvosa, suave, como talco.", en: "Powdery, soft, like talc." }, video: "/notes/violeta.mp4", poster: "/notes/violeta.jpg", keyBlack: true, fit: "cover", tint: "#B0179A" },
  { id: "almizcle", at: 3, no: "103", name: { es: "Almizcle blanco", en: "White musk" }, smell: { es: "Piel limpia, cálida y suave.", en: "Clean, warm, soft skin." }, video: "/notes/almizcle.mp4", poster: "/notes/almizcle.jpg", keyBlack: false, fit: "contain", tint: "#6E655A" },
];

export const note = (id: string) => NOTES.find((n) => n.id === id)!;

export type Tier = "top" | "heart" | "base";
export type Product = {
  handle: string;
  no: string;
  name: string;
  house: string;
  type: "EDP" | "EDT" | "Parfum";
  ml: number;
  price: number; // Lempiras, tax included, before delivery
  stock: number;
  family: Text;
  /** Each tier leads with a footage note; the rest are named only. */
  /** The card face: one note, cropped (x, y: focus 0-1; z: zoom). */
  face: { note: string; x: number; y: number; z: number };
  chord: Record<Tier, { lead: string; also: Text }>;
  wear: Text;
  lasts: Text;
  about: Text;
};

export const PRODUCTS: Product[] = [
  {
    handle: "peonia-nocturna", no: "041", name: "Peonía Nocturna", house: "Atelier Vey", type: "EDP", ml: 100, price: 3450, stock: 6,
    face: { note: "peonia", x: 0.5, y: 0.45, z: 1.4 },
    family: { es: "Floral frutal", en: "Fruity floral" },
    chord: { top: { lead: "fresa", also: { es: "pimienta rosa", en: "pink pepper" } }, heart: { lead: "peonia", also: { es: "rosa", en: "rose" } }, base: { lead: "almizcle", also: { es: "cedro", en: "cedar" } } },
    wear: { es: "Noche, salidas, clima fresco", en: "Evenings, going out, cool weather" },
    lasts: { es: "6 a 8 horas", en: "6 to 8 hours" },
    about: { es: "Abre con fresa y un toque picante, se vuelve una peonía jugosa y termina en piel limpia. Femenina sin ser dulce de más.", en: "Opens on strawberry with a spicy edge, turns into a juicy peony and settles on clean skin. Feminine without being too sweet." },
  },
  {
    handle: "azafran-y-cuero", no: "058", name: "Azafrán y Cuero", house: "Orvel", type: "EDP", ml: 75, price: 4200, stock: 3,
    face: { note: "azafran", x: 0.6, y: 0.4, z: 1.8 },
    family: { es: "Ámbar especiado", en: "Spiced amber" },
    chord: { top: { lead: "azafran", also: { es: "cardamomo", en: "cardamom" } }, heart: { lead: "violeta", also: { es: "iris", en: "iris" } }, base: { lead: "almizcle", also: { es: "cuero, ámbar", en: "leather, amber" } } },
    wear: { es: "Noche, ocasiones especiales", en: "Evenings, special occasions" },
    lasts: { es: "8 a 10 horas", en: "8 to 10 hours" },
    about: { es: "Cálido y especiado desde el primer momento. El azafrán y el cuero se sienten elegantes; la violeta lo suaviza. Para hombre o mujer.", en: "Warm and spiced from the first spray. Saffron and leather feel elegant; violet softens it. For anyone." },
  },
  {
    handle: "violeta-fria", no: "066", name: "Violeta Fría", house: "Nadal Studio", type: "EDT", ml: 100, price: 2150, stock: 12,
    face: { note: "violeta", x: 0.72, y: 0.4, z: 1.5 },
    family: { es: "Floral polvoso", en: "Powdery floral" },
    chord: { top: { lead: "violeta", also: { es: "bergamota", en: "bergamot" } }, heart: { lead: "peonia", also: { es: "iris", en: "iris" } }, base: { lead: "almizcle", also: { es: "sándalo", en: "sandalwood" } } },
    wear: { es: "Día, oficina, todo el año", en: "Daytime, office, all year" },
    lasts: { es: "4 a 6 horas", en: "4 to 6 hours" },
    about: { es: "Suave y polvosa, como ropa recién lavada con un ramo de violetas cerca. Fácil de usar todos los días.", en: "Soft and powdery, like fresh laundry with violets nearby. Easy to wear every day." },
  },
  {
    handle: "fresa-salvaje", no: "019", name: "Fresa Salvaje", house: "Casa Ilian", type: "EDT", ml: 50, price: 1450, stock: 20,
    face: { note: "fresa", x: 0.3, y: 0.65, z: 1.6 },
    family: { es: "Frutal", en: "Fruity" },
    chord: { top: { lead: "fresa", also: { es: "limón", en: "lemon" } }, heart: { lead: "peonia", also: { es: "jazmín", en: "jasmine" } }, base: { lead: "almizcle", also: { es: "vainilla", en: "vanilla" } } },
    wear: { es: "Día, calor, fines de semana", en: "Daytime, hot days, weekends" },
    lasts: { es: "3 a 5 horas", en: "3 to 5 hours" },
    about: { es: "Fresa recién cortada con limón. Alegre, ligera y fácil de regalar.", en: "Just-picked strawberry with lemon. Bright, light and easy to gift." },
  },
  {
    handle: "almizcle-001", no: "103", name: "Almizcle 001", house: "Lumen & Sal", type: "Parfum", ml: 50, price: 5600, stock: 2,
    face: { note: "almizcle", x: 0.55, y: 0.55, z: 1.3 },
    family: { es: "Almizclado", en: "Musky" },
    chord: { top: { lead: "violeta", also: { es: "aldehídos", en: "aldehydes" } }, heart: { lead: "almizcle", also: { es: "iris", en: "iris" } }, base: { lead: "almizcle", also: { es: "ambreta", en: "ambrette" } } },
    wear: { es: "Todo el día, muy cerca de la piel", en: "All day, close to the skin" },
    lasts: { es: "10 horas o más", en: "10 hours or more" },
    about: { es: "Huele a tu piel, pero mejor. Discreto y muy duradero; lo notan quienes están cerca.", en: "Smells like your skin, only better. Discreet and very long-lasting; noticed up close." },
  },
  {
    handle: "crocus-de-oro", no: "072", name: "Crocus de Oro", house: "Montvale", type: "EDP", ml: 100, price: 3900, stock: 0,
    face: { note: "azafran", x: 0.35, y: 0.5, z: 1.2 },
    family: { es: "Ámbar floral", en: "Floral amber" },
    chord: { top: { lead: "azafran", also: { es: "mandarina", en: "mandarin" } }, heart: { lead: "peonia", also: { es: "rosa", en: "rose" } }, base: { lead: "almizcle", also: { es: "ámbar, vainilla", en: "amber, vanilla" } } },
    wear: { es: "Noche, bodas, temporada fría", en: "Evenings, weddings, cool season" },
    lasts: { es: "8 a 10 horas", en: "8 to 10 hours" },
    about: { es: "Rosa y azafrán sobre ámbar dorado. Lujoso y envolvente, para cuando quieres que se note.", en: "Rose and saffron over golden amber. Rich and enveloping, for when you want to be noticed." },
  },
  {
    handle: "jardin-de-talco", no: "088", name: "Jardín de Talco", house: "Atelier Vey", type: "EDP", ml: 50, price: 2650, stock: 8,
    face: { note: "violeta", x: 0.65, y: 0.3, z: 2.4 },
    family: { es: "Floral polvoso", en: "Powdery floral" },
    chord: { top: { lead: "fresa", also: { es: "pera", en: "pear" } }, heart: { lead: "violeta", also: { es: "heliotropo", en: "heliotrope" } }, base: { lead: "almizcle", also: { es: "vainilla", en: "vanilla" } } },
    wear: { es: "Día, citas, todo el año", en: "Daytime, dates, all year" },
    lasts: { es: "5 a 7 horas", en: "5 to 7 hours" },
    about: { es: "Dulce y polvoso, como un cosmético antiguo. Tierno, nunca empalagoso.", en: "Sweet and powdery, like a vintage cosmetic. Tender, never cloying." },
  },
  {
    handle: "especia-blanca", no: "095", name: "Especia Blanca", house: "Orvel", type: "EDT", ml: 100, price: 2400, stock: 9,
    face: { note: "fresa", x: 0.68, y: 0.6, z: 1.2 },
    family: { es: "Especiado fresco", en: "Fresh spicy" },
    chord: { top: { lead: "azafran", also: { es: "pomelo", en: "grapefruit" } }, heart: { lead: "violeta", also: { es: "lavanda", en: "lavender" } }, base: { lead: "almizcle", also: { es: "vetiver", en: "vetiver" } } },
    wear: { es: "Día, oficina, calor", en: "Daytime, office, warm weather" },
    lasts: { es: "5 a 7 horas", en: "5 to 7 hours" },
    about: { es: "Fresco al abrir, especiado después. Limpio y con carácter, ideal para el trabajo.", en: "Fresh at first, spiced after. Clean with character, good for work." },
  },
];

export const product = (handle: string) => PRODUCTS.find((p) => p.handle === handle);
export const leadNotes = (p: Product) => [p.chord.top.lead, p.chord.heart.lead, p.chord.base.lead];
export const hasNote = (p: Product, id: string) => leadNotes(p).includes(id);

/** Honduras' 18 departments with an illustrative delivery fee and time. */
const CITY = { fee: 100, days: { es: "1 a 2 días hábiles", en: "1 to 2 business days" } };
const REST = { fee: 180, days: { es: "2 a 4 días hábiles", en: "2 to 4 business days" } };
export const DEPARTMENTS = [
  "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Francisco Morazán", "Gracias a Dios",
  "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro",
];
export const delivery = (dept: string) => (dept === "Francisco Morazán" || dept === "Cortés" ? CITY : REST);
export const DELIVERY_FROM = CITY.fee;

export const lempiras = (n: number) => `L ${n.toLocaleString("en-US")}`;
