import { Router } from "express";
import { getEnums, getDashboardSnapshot } from "../controllers/metaController";

const router = Router();

router.get("/enums", getEnums);
router.get("/dashboard", getDashboardSnapshot);

export default router;
