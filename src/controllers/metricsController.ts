import { Request, Response } from "express";
import { PrismaClient, ItemStatus, Availability } from "@prisma/client";

const prisma = new PrismaClient();

export const getPopularProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const items = await prisma.item.findMany({
      orderBy: { priceCents: "desc" },
      take: limit,
      include: { images: true },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching popular products" });
  }
};

export const getStockSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [inStock, reserved, memo] = await Promise.all([
      prisma.item.count({ where: { status: ItemStatus.IN_STOCK } }),
      prisma.item.count({ where: { status: ItemStatus.RESERVED } }),
      prisma.item.count({ where: { availability: Availability.MEMO } }),
    ]);
    res.json({ inStock, reserved, memo });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stock summary" });
  }
};

export const getSalesByMonth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const now = new Date();
    const results = [] as any[];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toISOString().slice(0, 7);
      results.unshift({ month, revenue: 0, units: 0 });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sales" });
  }
};
