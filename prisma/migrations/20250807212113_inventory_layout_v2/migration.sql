/*
  Warnings:

  - You are about to drop the column `carat` on the `Gem` table. All the data in the column will be lost.
  - The `clarity` column on the `Gem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `color` column on the `Gem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cut` column on the `Gem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `shape` column on the `Gem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `category` on the `Item` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('RING', 'BRACELET', 'NECKLACE', 'EARRING', 'PENDANT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ItemSubType" AS ENUM ('COCKTAIL', 'DINNER', 'ENGAGEMENT', 'HALO', 'BAND', 'BAND_MENS', 'MENS');

-- CreateEnum
CREATE TYPE "public"."Availability" AS ENUM ('ANY', 'MEMO', 'PARTNER', 'OWN_STOCK');

-- CreateEnum
CREATE TYPE "public"."Source" AS ENUM ('MFG', 'FINISHED', 'PARTNER', 'PURCHASE_AGREEMENT');

-- CreateEnum
CREATE TYPE "public"."MetalType" AS ENUM ('PT', 'GOLD10K', 'GOLD14K', 'GOLD18K', 'RG', 'YG', 'WG', 'SS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."GemRole" AS ENUM ('MAIN', 'ACCENT', 'SIDE');

-- CreateEnum
CREATE TYPE "public"."GemShape" AS ENUM ('ROUND', 'PRINCESS', 'CUSHION', 'ASSCHER', 'OVAL', 'PEAR', 'MARQUISE', 'EMERALDCUT', 'HEART');

-- CreateEnum
CREATE TYPE "public"."GemCutGrade" AS ENUM ('IDEAL', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "public"."GemColorScale" AS ENUM ('D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'OP', 'QR', 'S', 'T', 'U', 'VWX', 'YZ');

-- CreateEnum
CREATE TYPE "public"."GemClarityGrade" AS ENUM ('FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3');

-- DropIndex
DROP INDEX "public"."Gem_itemId_type_idx";

-- DropIndex
DROP INDEX "public"."Item_status_category_idx";

-- AlterTable
ALTER TABLE "public"."Gem" DROP COLUMN "carat",
ADD COLUMN     "diaQty" INTEGER,
ADD COLUMN     "diaWeightCt" DOUBLE PRECISION,
ADD COLUMN     "gemQty" INTEGER,
ADD COLUMN     "gemWeightCt" DOUBLE PRECISION,
ADD COLUMN     "role" "public"."GemRole" NOT NULL DEFAULT 'ACCENT',
ADD COLUMN     "weightCt" DOUBLE PRECISION,
DROP COLUMN "clarity",
ADD COLUMN     "clarity" "public"."GemClarityGrade",
DROP COLUMN "color",
ADD COLUMN     "color" "public"."GemColorScale",
DROP COLUMN "cut",
ADD COLUMN     "cut" "public"."GemCutGrade",
DROP COLUMN "shape",
ADD COLUMN     "shape" "public"."GemShape";

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "category",
ADD COLUMN     "availability" "public"."Availability" NOT NULL DEFAULT 'ANY',
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "heldStatus" TEXT,
ADD COLUMN     "itemSubType" "public"."ItemSubType",
ADD COLUMN     "itemType" "public"."ItemType",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "memoInDays" INTEGER,
ADD COLUMN     "metal" "public"."MetalType",
ADD COLUMN     "qty" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "source" "public"."Source",
ADD COLUMN     "style" TEXT;

-- CreateIndex
CREATE INDEX "Gem_itemId_role_type_idx" ON "public"."Gem"("itemId", "role", "type");

-- CreateIndex
CREATE INDEX "Gem_shape_color_clarity_cut_idx" ON "public"."Gem"("shape", "color", "clarity", "cut");

-- CreateIndex
CREATE INDEX "Item_status_itemType_itemSubType_idx" ON "public"."Item"("status", "itemType", "itemSubType");

-- CreateIndex
CREATE INDEX "Item_availability_memoInDays_idx" ON "public"."Item"("availability", "memoInDays");
