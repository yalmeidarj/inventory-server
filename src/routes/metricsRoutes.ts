import { Router } from "express";
import {
  getPopularProducts,
  getStockSummary,
  getSalesByMonth,
} from "../controllers/metricsController";

const router = Router();

router.get("/popular-products", getPopularProducts);
router.get("/stock-summary", getStockSummary);
router.get("/sales/by-month", getSalesByMonth);

export default router;
