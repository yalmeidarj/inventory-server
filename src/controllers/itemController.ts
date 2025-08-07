import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const buildItemWhere = (query: any): Prisma.ItemWhereInput => {
  const where: Prisma.ItemWhereInput = {};

  if (query.itemType) where.itemType = query.itemType as any;
  if (query.itemSubType) where.itemSubType = query.itemSubType as any;
  if (query.metal) where.metal = query.metal as any;
  if (query.status) where.status = query.status as any;
  if (query.availability) where.availability = query.availability as any;
  if (query.source) where.source = query.source as any;
  if (query.location) where.location = { contains: query.location, mode: "insensitive" };
  if (query.priceMin || query.priceMax)
    where.priceCents = {
      gte: query.priceMin ? Number(query.priceMin) : undefined,
      lte: query.priceMax ? Number(query.priceMax) : undefined,
    } as any;
  if (query.memoMaxDays)
    where.memoInDays = { lte: Number(query.memoMaxDays) } as any;
  if (query.qtyMin) where.qty = { gte: Number(query.qtyMin) } as any;
  if (query.text)
    where.title = { contains: query.text, mode: "insensitive" };

  // Gem filters
  if (
    query.gemType ||
    query.gemShape ||
    query.gemColor ||
    query.gemClarity ||
    query.gemCut ||
    query.weightMin ||
    query.weightMax
  ) {
    where.gems = {
      some: {
        type: query.gemType as any,
        shape: query.gemShape as any,
        color: query.gemColor as any,
        clarity: query.gemClarity as any,
        cut: query.gemCut as any,
        weightCt: {
          gte: query.weightMin ? Number(query.weightMin) : undefined,
          lte: query.weightMax ? Number(query.weightMax) : undefined,
        } as any,
      },
    };
  }

  return where;
};

export const searchItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const skip = (page - 1) * pageSize;

    const where = buildItemWhere(req.query);

    const orderBy: Prisma.ItemOrderByWithRelationInput = {};
    switch (req.query.sort) {
      case "price-asc":
        orderBy.priceCents = "asc";
        break;
      case "price-desc":
        orderBy.priceCents = "desc";
        break;
      case "updated-desc":
        orderBy.updatedAt = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: { images: true },
      }),
      prisma.item.count({ where }),
    ]);

    res.json({ items, total, page, pageSize });
  } catch (err) {
    res.status(500).json({ message: "Error searching items" });
  }
};

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        images: true,
        gems: true,
        tags: { include: { tag: true } },
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

export const getItemBySku = async (req: Request, res: Response): Promise<void> => {
  try {
    const sku = req.params.sku as string;
    const item = await prisma.item.findUnique({
      where: { sku },
      include: {
        images: true,
        gems: true,
        tags: { include: { tag: true } },
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

export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const item = await prisma.item.create({
      data: {
        ...data,
        images: data.images
          ? { create: data.images.map((img: any) => ({ ...img })) }
          : undefined,
        gems: data.gems
          ? { create: data.gems.map((g: any) => ({ ...g })) }
          : undefined,
      },
      include: { images: true, gems: true },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Error creating item" });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const item = await prisma.item.update({
      where: { id },
      data,
      include: { images: true, gems: true },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error updating item" });
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.item.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
};

export const addOrReorderImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const images: any[] = req.body.images || [];

    // Replace existing images with provided ones
    await prisma.image.deleteMany({ where: { itemId: id } });
    await prisma.image.createMany({
      data: images.map((img, idx) => ({
        itemId: id,
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary || false,
        sortOrder: img.sortOrder ?? idx,
        isPublic: img.isPublic ?? true,
      })),
    });
    const newImages = await prisma.image.findMany({
      where: { itemId: id },
      orderBy: { sortOrder: "asc" },
    });
    res.json(newImages);
  } catch (err) {
    res.status(500).json({ message: "Error updating images" });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const imageId = Number(req.params.imageId);
    await prisma.image.delete({ where: { id: imageId, itemId: id } as any });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
};

export const importItemsCsv = async (
  req: Request,
  res: Response
): Promise<void> => {
  // CSV import not yet implemented; return placeholder response
  res.json({ imported: 0, errors: [] });
};
