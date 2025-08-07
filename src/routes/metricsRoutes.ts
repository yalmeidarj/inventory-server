import { Router } from "express";
import {
  getPopularProducts,
  getStockSummary,
  getSalesByMonth,
} from "../controllers/metricsController";

const router = Router();

/**
 * @swagger
 * /metrics/popular-products:
 *   get:
 *     summary: Retrieve top priced items
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Max number of items to return
 *     responses:
 *       200:
 *         description: List of popular items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *
 * /metrics/stock-summary:
 *   get:
 *     summary: Get counts of items by status
 *     responses:
 *       200:
 *         description: Stock counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inStock:
 *                   type: integer
 *                 reserved:
 *                   type: integer
 *                 memo:
 *                   type: integer
 *
 * /metrics/sales/by-month:
 *   get:
 *     summary: Get sales totals for the past 12 months
 *     responses:
 *       200:
 *         description: Monthly sales data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   revenue:
 *                     type: integer
 *                   units:
 *                     type: integer
 */
router.get("/popular-products", getPopularProducts);
router.get("/stock-summary", getStockSummary);
router.get("/sales/by-month", getSalesByMonth);

export default router;
