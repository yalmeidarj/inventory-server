"use strict";
// prisma/seed.ts
// Seeds the database for the jewelry inventory schema (QR/Barcode-ready, not required).
// Uses Prisma v5 enum typing via Prisma.$Enums.*
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const tags_1 = require("./seedData/tags");
const items_1 = require("./seedData/items");
const collections_1 = require("./seedData/collections");
const prisma = new client_1.PrismaClient();
async function clearAll() {
    // Delete in dependency order
    await prisma.collectionItem.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.itemTag.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.image.deleteMany();
    await prisma.gem.deleteMany();
    await prisma.item.deleteMany();
}
function lc(s) {
    return s.normalize("NFKD").toLowerCase();
}
async function seedTags() {
    // Upsert canonical tags
    const tagRecords = [];
    for (const t of tags_1.tags) {
        const rec = await prisma.tag.upsert({
            where: { slug: t.slug },
            update: { name: t.name },
            create: { name: t.name, slug: t.slug },
        });
        tagRecords.push(rec);
    }
    const bySlug = new Map(tagRecords.map((t) => [t.slug, t]));
    return { tagRecords, bySlug };
}
async function seedItems(bySlug) {
    const itemRecords = [];
    for (const src of items_1.items) {
        // Create item with nested images & gems
        const created = await prisma.item.create({
            data: {
                sku: src.sku,
                title: src.title,
                titleLc: lc(src.title),
                category: src.category ?? null,
                status: src.status,
                priceCents: src.priceCents,
                currency: src.currency,
                qrSlug: src.qrSlug ?? null,
                barcodeType: (src.barcodeType ??
                    null),
                barcodeData: src.barcodeData ?? null,
                isPublic: src.isPublic ?? false,
                publicAt: src.publicAt ?? null,
                publicNotes: src.publicNotes ?? null,
                privateNotes: src.privateNotes ?? null,
                supplierName: src.supplierName ?? null,
                supplierRef: src.supplierRef ?? null,
                costCents: src.costCents ?? null,
                acquiredAt: src.acquiredAt ?? null,
                weightGrams: src.weightGrams ?? null,
                size: src.size ?? null,
                images: {
                    create: (src.images ?? []).map((im, idx) => ({
                        url: im.url,
                        alt: im.alt ?? null,
                        isPrimary: im.isPrimary ?? idx === 0,
                        sortOrder: im.sortOrder ?? idx,
                        isPublic: im.isPublic ?? true,
                    })),
                },
                gems: {
                    create: (src.gems ?? []).map((g) => ({
                        type: g.type,
                        carat: g.carat ?? null,
                        clarity: g.clarity ?? null,
                        color: g.color ?? null,
                        cut: g.cut ?? null,
                        sizeMm: g.sizeMm ?? null,
                        shape: g.shape ?? null,
                        labCertificate: g.labCertificate ?? null,
                        notes: g.notes ?? null,
                    })),
                },
            },
        });
        // Create item-tag rows
        const tagSlugs = src.tagSlugs ?? [];
        for (const slug of tagSlugs) {
            const tag = bySlug.get(slug);
            if (tag) {
                await prisma.itemTag.create({
                    data: {
                        itemId: created.id,
                        tagId: tag.id,
                    },
                });
            }
        }
        itemRecords.push(created);
    }
    const bySku = new Map(itemRecords.map((it) => [it.sku, it]));
    return { itemRecords, bySku };
}
async function seedCollections(bySku) {
    // Dynamic collections
    for (const dc of collections_1.dynamicCollections) {
        await prisma.collection.create({
            data: {
                name: dc.name,
                slug: dc.slug,
                description: dc.description ?? null,
                public: dc.public ?? false,
                publicSlug: dc.publicSlug ?? null,
                isDynamic: true,
                filters: dc.filters,
            },
        });
    }
    // Static collections with explicit item order
    for (const sc of collections_1.staticCollections) {
        const created = await prisma.collection.create({
            data: {
                name: sc.name,
                slug: sc.slug,
                description: sc.description ?? null,
                public: sc.public ?? false,
                publicSlug: sc.publicSlug ?? null,
                isDynamic: false,
            },
        });
        for (let i = 0; i < sc.itemSkus.length; i++) {
            const sku = sc.itemSkus[i];
            if (!sku)
                continue;
            const item = bySku.get(sku);
            if (!item)
                continue;
            await prisma.collectionItem.create({
                data: {
                    collectionId: created.id,
                    itemId: item.id,
                    sortOrder: i,
                },
            });
        }
    }
}
async function main() {
    console.log("Clearing database...");
    await clearAll();
    console.log("Seeding tags...");
    const { bySlug } = await seedTags();
    console.log("Seeding items...");
    const { bySku } = await seedItems(bySlug);
    console.log("Seeding collections...");
    await seedCollections(bySku);
    console.log("✅ Seed completed.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map