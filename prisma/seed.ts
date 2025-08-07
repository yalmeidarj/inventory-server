import {
  PrismaClient,
  ItemType,
  ItemSubType,
  MetalType,
  Availability,
  Source,
  ItemStatus,
  BarcodeSymbology,
  GemRole,
  GemShape,
  GemColorScale,
  GemClarityGrade,
  GemCutGrade,
} from "@prisma/client";

const prisma = new PrismaClient();

/* ----------------------------------------------------
 *  DATASETS (mini)
 * -------------------------------------------------- */
const tags = [
  { name: "diamond", slug: "diamond" },
  { name: "engagement", slug: "engagement" },
  { name: "bracelet", slug: "bracelet" },
];

type SeedGem = {
  role?: GemRole;
  type: string;
  shape?: GemShape | null;
  weightCt?: number | null;
  color?: GemColorScale | null;
  clarity?: GemClarityGrade | null;
  cut?: GemCutGrade | null;
};

type SeedImage = { url: string; alt?: string; isPrimary?: boolean };

type SeedItem = {
  sku: string;
  title: string;
  itemType: ItemType;
  itemSubType?: ItemSubType | null;
  metal?: MetalType | null;
  availability?: Availability | null;
  source?: Source | null;
  priceCents: number;
  currency: string;
  status?: ItemStatus;
  qty?: number;
  qrSlug?: string | null;
  barcodeType?: BarcodeSymbology | null;
  barcodeData?: string | null;
  tagSlugs?: string[];
  images?: SeedImage[];
  gems?: SeedGem[];
};

const items: SeedItem[] = [
  {
    sku: "R-001-18K",
    title: "18K Yellow-Gold Diamond Engagement Ring",
    itemType: ItemType.RING,
    itemSubType: ItemSubType.ENGAGEMENT,
    metal: MetalType.YG,
    availability: Availability.OWN_STOCK,
    source: Source.MFG,
    priceCents: 516_606,
    currency: "BRL",
    status: ItemStatus.IN_STOCK,
    tagSlugs: ["diamond", "engagement"],
    images: [{ url: "https://picsum.photos/seed/ring/600" }],
    gems: [
      {
        role: GemRole.MAIN,
        type: "Diamond",
        shape: GemShape.ROUND,
        weightCt: 1.2,
        color: GemColorScale.G,
        clarity: GemClarityGrade.SI1,
        cut: GemCutGrade.EXCELLENT,
      },
    ],
  },
  {
    sku: "B-005-AU",
    title: "Rose-Gold Diamond Tennis Bracelet",
    itemType: ItemType.BRACELET,
    metal: MetalType.RG,
    availability: Availability.OWN_STOCK,
    source: Source.FINISHED,
    priceCents: 1_299_000,
    currency: "BRL",
    status: ItemStatus.IN_STOCK,
    tagSlugs: ["bracelet", "diamond"],
    qrSlug: "rose-gold-tennis",
    barcodeType: BarcodeSymbology.EAN13,
    barcodeData: "7891234567890",
    images: [{ url: "https://picsum.photos/seed/bracelet/600" }],
    gems: [
      {
        role: GemRole.MAIN,
        type: "Diamond",
        shape: GemShape.ROUND,
        weightCt: 2.5,
        color: GemColorScale.F,
        clarity: GemClarityGrade.VS2,
        cut: GemCutGrade.VERY_GOOD,
      },
    ],
  },
];

const dynamicCollections = [
  {
    name: "Diamond Rings Under R$10k",
    slug: "rings-under-10k",
    description: "All diamond engagement rings below ten thousand reais",
    public: true,
    publicSlug: "rings-under-10k",
    filters: { itemType: "RING", priceCents_lt: 1_000_000 },
  },
];

const staticCollections = [
  {
    name: "Featured",
    slug: "featured",
    description: "Homepage carousel",
    public: true,
    publicSlug: "featured",
    itemSkus: ["R-001-18K", "B-005-AU"],
  },
];

/* ----------------------------------------------------
 *  HELPERS
 * -------------------------------------------------- */
const lc = (s: string) => s.normalize("NFKD").toLowerCase();

async function clearAll() {
  await prisma.collectionItem.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.itemTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.image.deleteMany();
  await prisma.gem.deleteMany();
  await prisma.item.deleteMany();
}

async function seedTags() {
  const recs = [];
  for (const t of tags) {
    const rec = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: { name: t.name, slug: t.slug },
    });
    recs.push(rec);
  }
  return new Map(recs.map((r) => [r.slug, r]));
}

async function seedItems(tagMap: Map<string, any>) {
  const recs = [];
  for (const src of items) {
    const item = await prisma.item.create({
      data: {
        sku: src.sku,
        title: src.title,
        titleLc: lc(src.title),
        itemType: src.itemType,
        itemSubType: src.itemSubType ?? null,
        metal: src.metal ?? null,
        availability: src.availability ?? Availability.ANY,
        source: src.source ?? null,
        status: src.status ?? ItemStatus.IN_STOCK,
        qty: src.qty ?? 1,
        priceCents: src.priceCents,
        currency: src.currency,
        qrSlug: src.qrSlug ?? null,
        barcodeType: src.barcodeType ?? null,
        barcodeData: src.barcodeData ?? null,
        images: {
          create: (src.images ?? []).map((im, idx) => ({
            url: im.url,
            alt: im.alt ?? null,
            isPrimary: im.isPrimary ?? idx === 0,
            sortOrder: idx,
          })),
        },
        gems: {
          create: (src.gems ?? []).map((g) => ({
            role: g.role ?? GemRole.ACCENT,
            type: g.type,
            shape: g.shape ?? null,
            weightCt: g.weightCt ?? null,
            color: g.color ?? null,
            clarity: g.clarity ?? null,
            cut: g.cut ?? null,
          })),
        },
      },
    });

    for (const slug of src.tagSlugs ?? []) {
      const tag = tagMap.get(slug);
      if (tag) {
        await prisma.itemTag.create({
          data: { itemId: item.id, tagId: tag.id },
        });
      }
    }
    recs.push(item);
  }

  return new Map(recs.map((i) => [i.sku, i]));
}

async function seedCollections(itemMap: Map<string, any>) {
  // dynamic
  for (const dc of dynamicCollections) {
    await prisma.collection.create({
      data: {
        name: dc.name,
        slug: dc.slug,
        description: dc.description,
        public: dc.public,
        publicSlug: dc.publicSlug,
        isDynamic: true,
        filters: dc.filters as any,
      },
    });
  }

  // static
  for (const sc of staticCollections) {
    const coll = await prisma.collection.create({
      data: {
        name: sc.name,
        slug: sc.slug,
        description: sc.description,
        public: sc.public,
        publicSlug: sc.publicSlug,
        isDynamic: false,
      },
    });

    sc.itemSkus.forEach(async (sku, idx) => {
      const item = itemMap.get(sku);
      if (!item) return;
      await prisma.collectionItem.create({
        data: { collectionId: coll.id, itemId: item.id, sortOrder: idx },
      });
    });
  }
}

/* ----------------------------------------------------
 *  MAIN
 * -------------------------------------------------- */
async function main() {
  console.log("🧹 Clearing…");
  await clearAll();

  console.log("🏷️  Tags…");
  const tagMap = await seedTags();

  console.log("💍 Items…");
  const itemMap = await seedItems(tagMap);

  console.log("📚 Collections…");
  await seedCollections(itemMap);

  console.log("✅ Seed done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
