import { Router } from "express";
import { getEnums, getDashboardSnapshot } from "../controllers/metaController";

const router = Router();

/**
 * @swagger
 * /meta/enums:
 *   get:
 *     summary: Retrieve available enum values
 *     responses:
 *       200:
 *         description: Lists of enum values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 * /meta/dashboard:
 *   get:
 *     summary: Get inventory dashboard snapshot
 *     responses:
 *       200:
 *         description: Snapshot of key metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stockCount:
 *                   type: integer
 *                 totalValue:
 *                   type: integer
 *                 reservedCount:
 *                   type: integer
 *                 memoCount:
 *                   type: integer
 */
router.get("/enums", getEnums);
router.get("/dashboard", getDashboardSnapshot);

export default router;
