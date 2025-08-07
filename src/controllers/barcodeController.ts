import { Request, Response } from "express";

export const getBarcode = async (req: Request, res: Response): Promise<void> => {
  try {
    const value = req.params.value;
    const type = (req.query.type as string) || "Code128";
    // Placeholder barcode generation
    const content = `BARCODE:${type}:${value}`;
    res.type("text/plain").send(content);
  } catch (err) {
    res.status(500).json({ message: "Error generating barcode" });
  }
};
