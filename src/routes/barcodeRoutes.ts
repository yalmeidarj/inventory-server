import { Router } from "express";
import { getBarcode } from "../controllers/barcodeController";

const router = Router();

router.get("/:value", getBarcode);

export default router;
