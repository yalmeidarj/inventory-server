-- CreateEnum
CREATE TYPE "public"."ItemStatus" AS ENUM ('DRAFT', 'IN_STOCK', 'RESERVED', 'SOLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."BarcodeSymbology" AS ENUM ('CODE128', 'EAN13', 'QR');

-- CreateTable
CREATE TABLE "public"."Item" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleLc" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "status" "public"."ItemStatus" NOT NULL DEFAULT 'IN_STOCK',
    "priceCents" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "qrSlug" TEXT,
    "barcodeType" "public"."BarcodeSymbology",
    "barcodeData" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publicAt" TIMESTAMP(3),
    "publicNotes" TEXT,
    "privateNotes" TEXT,
    "supplierName" TEXT,
    "supplierRef" TEXT,
    "costCents" INTEGER,
    "acquiredAt" TIMESTAMP(3),
    "weightGrams" DOUBLE PRECISION,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gem" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "carat" DOUBLE PRECISION,
    "clarity" TEXT,
    "color" TEXT,
    "cut" TEXT,
    "sizeMm" DOUBLE PRECISION,
    "shape" TEXT,
    "labCertificate" TEXT,
    "notes" TEXT,

    CONSTRAINT "Gem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemTag" (
    "itemId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ItemTag_pkey" PRIMARY KEY ("itemId","tagId")
);

-- CreateTable
CREATE TABLE "public"."Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "publicSlug" TEXT,
    "isDynamic" BOOLEAN NOT NULL DEFAULT true,
    "filters" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CollectionItem" (
    "collectionId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("collectionId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_sku_key" ON "public"."Item"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Item_qrSlug_key" ON "public"."Item"("qrSlug");

-- CreateIndex
CREATE INDEX "Item_titleLc_idx" ON "public"."Item"("titleLc");

-- CreateIndex
CREATE INDEX "Item_status_category_idx" ON "public"."Item"("status", "category");

-- CreateIndex
CREATE INDEX "Item_priceCents_idx" ON "public"."Item"("priceCents");

-- CreateIndex
CREATE INDEX "Image_itemId_sortOrder_idx" ON "public"."Image"("itemId", "sortOrder");

-- CreateIndex
CREATE INDEX "Gem_itemId_type_idx" ON "public"."Gem"("itemId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "public"."Tag"("slug");

-- CreateIndex
CREATE INDEX "ItemTag_tagId_idx" ON "public"."ItemTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "public"."Collection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_publicSlug_key" ON "public"."Collection"("publicSlug");

-- CreateIndex
CREATE INDEX "CollectionItem_itemId_idx" ON "public"."CollectionItem"("itemId");

-- CreateIndex
CREATE INDEX "CollectionItem_collectionId_sortOrder_idx" ON "public"."CollectionItem"("collectionId", "sortOrder");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gem" ADD CONSTRAINT "Gem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemTag" ADD CONSTRAINT "ItemTag_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemTag" ADD CONSTRAINT "ItemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionItem" ADD CONSTRAINT "CollectionItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
