import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildItemWhere } from "./itemController";

const prisma = new PrismaClient();

export const getPublicItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const qrSlug = req.params.qrSlug as string;
    const item = await prisma.item.findUnique({
      where: { qrSlug } as any,
      select: {
        id: true,
        sku: true,
        title: true,
        itemType: true,
        itemSubType: true,
        metal: true,
        priceCents: true,
        images: true,
        gems: true,
        publicNotes: true,
      },
    });
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

export const getPublicCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publicSlug = req.params.publicSlug as string;
    const collection = await prisma.collection.findUnique({
      where: { publicSlug } as any,
    });
    if (!collection || !collection.public) {
      res.status(404).json({ message: "Collection not found" });
      return;
    }
    let items;
    if (collection.isDynamic) {
      const filters = (collection.filters as any) || {};
      const where = buildItemWhere(filters);
      items = await prisma.item.findMany({ where, include: { images: true } });
    } else {
      items = await prisma.item.findMany({
        where: { collections: { some: { collectionId: collection.id } } },
        include: { images: true },
      });
    }
    res.json({ ...collection, items });
  } catch (err) {
    res.status(500).json({ message: "Error fetching collection" });
  }
};
