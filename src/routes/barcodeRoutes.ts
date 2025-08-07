import { Router } from "express";
import { getBarcode } from "../controllers/barcodeController";

const router = Router();

/**
 * @swagger
 * /barcode/{value}:
 *   get:
 *     summary: Generate a barcode or QR code
 *     parameters:
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Symbology type (e.g., Code128, EAN13, QR)
 *     responses:
 *       200:
 *         description: Generated barcode text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/:value", getBarcode);

export default router;
