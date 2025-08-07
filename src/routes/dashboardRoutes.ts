import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";

const router = Router();

/**
 * @swagger
 * /popular-products:
 *   get:
 *     summary: Retrieve popular products
 *     responses:
 *       200:
 *         description: List of popular products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 popularProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 */
router.get("/", getDashboardMetrics);

export default router;
