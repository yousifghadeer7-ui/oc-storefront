import { db } from "./index";
import { products } from "./schema";
import type { ProductColor } from "./schema";

const px = (id: number, w = 900, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

const APPAREL = ["XS", "S", "M", "L", "XL"];
const ONE = ["One Size"];

interface SeedRow {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  compareAtCents?: number;
  description: string;
  details: string[];
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  stock: number;
}

const rows: SeedRow[] = [
  {
    slug: "sculpted-wool-coat",
    name: "Sculpted Wool Coat",
    category: "Outerwear",
    priceCents: 89000,
    description:
      "A double-faced Italian wool coat cut with a clean, architectural shoulder. Unlined for drape, finished with hand-stitched seams and hidden horn closures.",
    details: [
      "Double-face Italian virgin wool",
      "Hand-finished seams, hidden placket",
      "True to size — take your regular size",
      "Dry clean only",
    ],
    colors: [
      { name: "Camel", hex: "#A9804F" },
      { name: "Noir", hex: "#161513" },
    ],
    sizes: APPAREL,
    images: [px(19169191), px(19099692)],
    featured: true,
    isNew: true,
    stock: 14,
  },
  {
    slug: "midnight-oversized-trench",
    name: "Midnight Oversized Trench",
    category: "Outerwear",
    priceCents: 72000,
    description:
      "A storm-ready trench in bonded midnight cotton. Oversized through the body with a detachable belt and matte blackened hardware.",
    details: [
      "Bonded water-resistant cotton",
      "Detachable self belt, storm flap",
      "Relaxed oversized fit",
      "Specialist clean",
    ],
    colors: [{ name: "Midnight", hex: "#14161C" }],
    sizes: APPAREL,
    images: [px(19169360), px(20578718)],
    stock: 11,
  },
  {
    slug: "ivory-boucle-coat",
    name: "Ivory Bouclé Coat",
    category: "Outerwear",
    priceCents: 115000,
    description:
      "Woven from a soft ivory bouclé of wool and alpaca, this collarless coat falls in a quiet, rounded line. A piece for ceremonies and slow mornings alike.",
    details: [
      "Wool–alpaca bouclé, silk lining",
      "Collarless round neck",
      "Straight, floor-skimming length",
      "Dry clean only",
    ],
    colors: [{ name: "Ivory", hex: "#EDE6DA" }],
    sizes: APPAREL,
    images: [px(20717784), px(20578709)],
    isNew: true,
    stock: 7,
  },
  {
    slug: "heritage-trench-sand",
    name: "Heritage Trench",
    category: "Outerwear",
    priceCents: 68000,
    description:
      "Our unisex trench in dense sand gabardine. Raglan sleeves, a deep back yoke and a silhouette that only improves with wear.",
    details: [
      "Dense cotton gabardine",
      "Raglan sleeve, unisex block",
      "Classic fit",
      "Cool iron, specialist clean",
    ],
    colors: [{ name: "Sand", hex: "#C3A87E" }],
    sizes: APPAREL,
    images: [px(5119919), px(15169683)],
    stock: 16,
  },
  {
    slug: "double-breasted-blazer",
    name: "Double-Breasted Blazer",
    category: "Tailoring",
    priceCents: 54000,
    description:
      "A sharp six-button blazer in dry charcoal wool. Nipped at the waist with a high gorge and a clean, unbroken lapel line.",
    details: [
      "Super 120s worsted wool",
      "Half-canvas construction",
      "Six-button double-breasted front",
      "Dry clean only",
    ],
    colors: [
      { name: "Charcoal", hex: "#3A3A38" },
      { name: "Noir", hex: "#161513" },
    ],
    sizes: APPAREL,
    images: [px(33401683), px(19985714)],
    featured: true,
    stock: 18,
  },
  {
    slug: "column-suit-trouser-ecru",
    name: "Column Suit Trouser",
    category: "Tailoring",
    priceCents: 38000,
    description:
      "A high-rise, straight-column trouser in ecru suiting wool. Pressed crease, side-tab waist and a clean hem that pools just so.",
    details: [
      "Ecru suiting wool, viscose lining",
      "High rise, straight leg",
      "Side-tab waist adjustment",
      "Dry clean only",
    ],
    colors: [{ name: "Ecru", hex: "#D9CFBC" }],
    sizes: APPAREL,
    images: [px(12311948), px(4646878)],
    stock: 20,
  },
  {
    slug: "the-midnight-suit",
    name: "The Midnight Suit",
    category: "Tailoring",
    priceCents: 98000,
    description:
      "A two-piece suit in near-black wool with a soft sheen. Cut close through the jacket, easy through the trouser. Worn together or apart, always considered.",
    details: [
      "Wool–mohair blend, natural sheen",
      "Single-breasted two-button jacket",
      "Matching pleated trouser",
      "Dry clean only",
    ],
    colors: [{ name: "Midnight", hex: "#14161C" }],
    sizes: APPAREL,
    images: [px(26903326), px(4651394)],
    stock: 9,
  },
  {
    slug: "oversized-suiting-set",
    name: "Oversized Suiting Set",
    category: "Tailoring",
    priceCents: 86000,
    description:
      "An oversized jacket and wide trouser cut from the same bolt of grey wool. Worn as a set it is a statement; separated, a wardrobe.",
    details: [
      "Grey flannel wool",
      "Oversized jacket, wide trouser",
      "Sold as a two-piece set",
      "Dry clean only",
    ],
    colors: [{ name: "Cloud Grey", hex: "#9A978F" }],
    sizes: APPAREL,
    images: [px(4646873), px(4646878)],
    isNew: true,
    stock: 8,
  },
  {
    slug: "ribbed-cashmere-rollneck",
    name: "Ribbed Cashmere Rollneck",
    category: "Knitwear",
    priceCents: 32000,
    description:
      "A fine-gauge ribbed rollneck in Mongolian cashmere. Close to the body, high at the neck, endlessly layerable.",
    details: [
      "100% Mongolian cashmere, 12-gauge",
      "Fully fashioned, ribbed throughout",
      "Slim fit",
      "Hand wash cold, dry flat",
    ],
    colors: [
      { name: "Ash", hex: "#B9B4AC" },
      { name: "Noir", hex: "#161513" },
    ],
    sizes: APPAREL,
    images: [px(6995884), px(6995898)],
    featured: true,
    stock: 24,
  },
  {
    slug: "boxy-merino-crew",
    name: "Boxy Merino Crew",
    category: "Knitwear",
    priceCents: 24000,
    description:
      "A boxy, cropped crewneck in extra-fine merino. Dropped shoulder and a rolled hem that sits exactly at the waistband.",
    details: [
      "Extra-fine Australian merino",
      "Boxy cropped fit, dropped shoulder",
      "Rolled collar and hem",
      "Hand wash cold, dry flat",
    ],
    colors: [
      { name: "Oat", hex: "#D8CBB4" },
      { name: "Chalk", hex: "#EFECE4" },
    ],
    sizes: APPAREL,
    images: [px(6995886), px(6996080)],
    stock: 22,
  },
  {
    slug: "collared-mohair-sweater",
    name: "Collared Mohair Sweater",
    category: "Knitwear",
    priceCents: 41000,
    description:
      "A haloed mohair-blend sweater with a deep, soft collar. Light as air, warm as rumour.",
    details: [
      "Kid mohair–wool–nylon blend",
      "Deep shawl collar",
      "Relaxed fit",
      "Hand wash cold, dry flat",
    ],
    colors: [{ name: "Cream", hex: "#E9E1D2" }],
    sizes: APPAREL,
    images: [px(6995902), px(6996083)],
    isNew: true,
    stock: 12,
  },
  {
    slug: "heritage-knit-cardigan",
    name: "Heritage Knit Cardigan",
    category: "Knitwear",
    priceCents: 46000,
    description:
      "A chunky shetland cardigan with horn buttons and saddle shoulders. The kind of piece that outlives trends by decades.",
    details: [
      "Brushed Shetland wool",
      "Saddle shoulder, horn buttons",
      "Relaxed fit",
      "Hand wash cold, dry flat",
    ],
    colors: [{ name: "Camel", hex: "#A9804F" }],
    sizes: APPAREL,
    images: [px(30698043), px(28116407)],
    stock: 15,
  },
  {
    slug: "poplin-oversized-shirt",
    name: "Poplin Oversized Shirt",
    category: "Shirts",
    priceCents: 19000,
    description:
      "A crisp, oversized shirt in dense cotton poplin. Deep cuffs, a long tail and a collar that stands on its own.",
    details: [
      "Dense two-ply cotton poplin",
      "Oversized fit, long tail",
      "Mother-of-pearl buttons",
      "Machine wash cool, warm iron",
    ],
    colors: [
      { name: "Optic White", hex: "#F4F2EC" },
      { name: "Chalk Stripe", hex: "#DCD8CE" },
    ],
    sizes: APPAREL,
    images: [px(28710323), px(28938770)],
    featured: true,
    stock: 26,
  },
  {
    slug: "silk-charmeuse-blouse",
    name: "Silk Charmeuse Blouse",
    category: "Shirts",
    priceCents: 28000,
    description:
      "A fluid charmeuse blouse with a concealed placket and a soft, undone bow. Catches the light quietly.",
    details: [
      "100% silk charmeuse, 19 momme",
      "Concealed placket, soft bow tie",
      "Relaxed fit",
      "Dry clean only",
    ],
    colors: [
      { name: "Noir", hex: "#161513" },
      { name: "Champagne", hex: "#D9C6A5" },
    ],
    sizes: APPAREL,
    images: [px(32279880), px(37512798)],
    isNew: true,
    stock: 13,
  },
  {
    slug: "pleated-wide-trouser",
    name: "Pleated Wide Trouser",
    category: "Trousers",
    priceCents: 34000,
    description:
      "A double-pleated wide trouser in noir wool twill. High rise, full through the leg, finished with a clean turn-up.",
    details: [
      "Wool twill, viscose lining",
      "Double pleat, turn-up hem",
      "High rise, wide leg",
      "Dry clean only",
    ],
    colors: [{ name: "Noir", hex: "#161513" }],
    sizes: APPAREL,
    images: [px(28938770), px(37512798)],
    stock: 19,
  },
  {
    slug: "relaxed-cotton-trouser",
    name: "Relaxed Cotton Trouser",
    category: "Trousers",
    priceCents: 26000,
    description:
      "A relaxed, easy trouser in washed stone cotton. Drawstring waist hidden inside a tailored facing — comfort with a straight face.",
    details: [
      "Washed organic cotton twill",
      "Internal drawstring, tailored facing",
      "Relaxed tapered leg",
      "Machine wash cool",
    ],
    colors: [{ name: "Stone", hex: "#B8AE9C" }],
    sizes: APPAREL,
    images: [px(7643772), px(28710323)],
    stock: 21,
  },
  {
    slug: "bias-cut-slip-dress",
    name: "Bias-Cut Slip Dress",
    category: "Dresses",
    priceCents: 42000,
    description:
      "A bias-cut slip in heavy sandwashed silk. It moves like liquid and sits like a second skin. The quiet centre of an evening.",
    details: [
      "Sandwashed silk, 22 momme",
      "Bias cut, adjustable straps",
      "Midi length",
      "Dry clean only",
    ],
    colors: [
      { name: "Noir", hex: "#161513" },
      { name: "Champagne", hex: "#D9C6A5" },
    ],
    sizes: APPAREL,
    images: [px(17871655), px(37291294)],
    featured: true,
    isNew: true,
    stock: 10,
  },
  {
    slug: "satin-column-dress",
    name: "Satin Column Dress",
    category: "Dresses",
    priceCents: 46000,
    description:
      "A floor-length column in blush duchess satin. One shoulder, one seam line, no excess.",
    details: [
      "Duchess satin with stretch silk lining",
      "One-shoulder neckline",
      "Floor-length column",
      "Dry clean only",
    ],
    colors: [{ name: "Blush", hex: "#D9B8AE" }],
    sizes: APPAREL,
    images: [px(34896846), px(20117711)],
    stock: 6,
  },
  {
    slug: "sculpted-evening-dress",
    name: "Sculpted Evening Dress",
    category: "Dresses",
    priceCents: 52000,
    description:
      "A sculpted bodice and open back in matte noir crepe. Architectural, restrained, unforgettable.",
    details: [
      "Matte stretch crepe",
      "Sculpted bodice, open back",
      "Midi length",
      "Dry clean only",
    ],
    colors: [
      { name: "Noir", hex: "#161513" },
      { name: "Ivory", hex: "#EDE6DA" },
    ],
    sizes: APPAREL,
    images: [px(19397651), px(28442112)],
    stock: 8,
  },
  {
    slug: "structured-leather-tote",
    name: "Structured Leather Tote",
    category: "Accessories",
    priceCents: 52000,
    description:
      "A rigid, unlined tote in vegetable-tanned tan leather. Carries a laptop, a loaf of bread and a decade of patina.",
    details: [
      "Vegetable-tanned full-grain leather",
      "Unlined, burnished edges",
      "Interior slip pocket",
      "Wipe clean, condition seasonally",
    ],
    colors: [{ name: "Tan", hex: "#9C6B3F" }],
    sizes: ONE,
    images: [px(26316185), px(20380733)],
    featured: true,
    stock: 12,
  },
  {
    slug: "mini-top-handle-bag",
    name: "Mini Top-Handle Bag",
    category: "Accessories",
    priceCents: 42000,
    description:
      "A compact top-handle in chestnut box calf with a polished turn-lock. Small on purpose.",
    details: [
      "Box calf leather, suede lining",
      "Polished turn-lock closure",
      "Detachable shoulder strap",
      "Wipe clean",
    ],
    colors: [{ name: "Chestnut", hex: "#6E4326" }],
    sizes: ONE,
    images: [px(20380732), px(9595079)],
    isNew: true,
    stock: 9,
  },
  {
    slug: "geometric-shoulder-bag",
    name: "Geometric Shoulder Bag",
    category: "Accessories",
    priceCents: 38000,
    description:
      "A sharp-edged shoulder bag in noir leather with a sculptural clasp. Geometry you can carry.",
    details: [
      "Smooth noir calf leather",
      "Sculptural metal clasp",
      "Single gusseted compartment",
      "Wipe clean",
    ],
    colors: [{ name: "Noir", hex: "#161513" }],
    sizes: ONE,
    images: [px(7953286), px(21897309)],
    stock: 14,
  },
];

async function main() {
  await db.delete(products);
  const now = Date.now();
  const day = 86400000;
  const inserts = rows.map((r, i) => ({
    ...r,
    compareAtCents: r.compareAtCents ?? null,
    featured: r.featured ?? false,
    isNew: r.isNew ?? false,
    createdAt: new Date(now - (r.isNew ? i * 0.2 : 30 + i) * day),
  }));
  await db.insert(products).values(inserts);
  const count = await db.select().from(products);
  console.log(`Seeded ${count.length} products`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
