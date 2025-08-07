import { Router } from "express";
import { getPublicItem, getPublicCollection } from "../controllers/publicController";

const router = Router();

/**
 * @swagger
 * /public/items/{qrSlug}:
 *   get:
 *     summary: Get public item by QR slug
 *     parameters:
 *       - in: path
 *         name: qrSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *
 * /public/collections/{publicSlug}:
 *   get:
 *     summary: Get public collection by slug
 *     parameters:
 *       - in: path
 *         name: publicSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public collection with items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         description: Collection not found
 */
router.get("/items/:qrSlug", getPublicItem);
router.get("/collections/:publicSlug", getPublicCollection);

export default router;
