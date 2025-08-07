import { Request, Response } from "express";
import {
  PrismaClient,
  ItemStatus,
  ItemType,
  ItemSubType,
  MetalType,
  GemShape,
  GemCutGrade,
  GemColorScale,
  GemClarityGrade,
  Availability,
  Source,
} from "@prisma/client";

const prisma = new PrismaClient();

export const getEnums = (req: Request, res: Response): void => {
  res.json({
    itemTypes: Object.values(ItemType),
    itemSubTypes: Object.values(ItemSubType),
    metals: Object.values(MetalType),
    gemShapes: Object.values(GemShape),
    gemCutGrades: Object.values(GemCutGrade),
    gemColorScales: Object.values(GemColorScale),
    gemClarityGrades: Object.values(GemClarityGrade),
    itemStatuses: Object.values(ItemStatus),
    availabilities: Object.values(Availability),
    sources: Object.values(Source),
  });
};

export const getDashboardSnapshot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [stockCount, totalValue, reservedCount, memoCount] = await Promise.all([
      prisma.item.count({ where: { status: ItemStatus.IN_STOCK } }),
      prisma.item.aggregate({ _sum: { priceCents: true } }),
      prisma.item.count({ where: { status: ItemStatus.RESERVED } }),
      prisma.item.count({ where: { availability: Availability.MEMO } }),
    ]);

    res.json({
      stockCount,
      totalValue: totalValue._sum.priceCents || 0,
      reservedCount,
      memoCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard snapshot" });
  }
};
