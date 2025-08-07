import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { items: true } } },
    });
    const formatted = tags.map((t) => ({
      id: t.id,
      name: t.name,
      count: t._count.items,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tags" });
  }
};

export const createOrRenameTag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    let tag;
    if (id) {
      tag = await prisma.tag.update({ where: { id }, data: { name, slug } });
    } else {
      tag = await prisma.tag.create({ data: { name, slug } });
    }
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: "Error saving tag" });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.tag.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tag" });
  }
};
