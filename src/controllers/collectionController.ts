import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildItemWhere } from "./itemController";

const prisma = new PrismaClient();

export const listCollections = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const whereClause = req.query.public
      ? { public: req.query.public === "true" }
      : undefined;
    const collections = await prisma.collection.findMany({
      ...(whereClause ? { where: whereClause as any } : {}),
      select: {
        id: true,
        name: true,
        slug: true,
        public: true,
        isDynamic: true,
      },
    });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: "Error fetching collections" });
  }
};

export const getCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const collection = await prisma.collection.findUnique({
      where: { slug } as any,
      include: { items: true },
    });
    if (!collection) {
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
        where: {
          collections: { some: { collectionId: collection.id } },
        },
        include: { images: true },
      });
    }

    res.json({ ...collection, items });
  } catch (err) {
    res.status(500).json({ message: "Error fetching collection" });
  }
};

export const createCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, isDynamic, filters, itemIds, description, public: isPublic } =
      req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description,
        public: isPublic || false,
        isDynamic,
        filters: filters || null,
        items: itemIds
          ? {
              create: itemIds.map((id: number, idx: number) => ({
                itemId: id,
                sortOrder: idx,
              })),
            }
          : undefined,
      } as any,
    });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Error creating collection" });
  }
};

export const updateCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    if (data.name) data.slug = data.name.toLowerCase().replace(/\s+/g, "-");
    const collection = await prisma.collection.update({
      where: { id },
      data: data as any,
    });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: "Error updating collection" });
  }
};

export const deleteCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.collection.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting collection" });
  }
};

export const addItemsToCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { itemIds } = req.body;
    await prisma.collectionItem.createMany({
      data: (itemIds || []).map((itemId: number, idx: number) => ({
        collectionId: id,
        itemId,
        sortOrder: idx,
      })),
      skipDuplicates: true,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error adding items" });
  }
};

export const removeItemFromCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const collectionId = Number(req.params.id);
    const itemId = Number(req.params.itemId);
    await prisma.collectionItem.delete({
      where: { collectionId_itemId: { collectionId, itemId } },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
};
