import { Router } from "express";
import { getPublicItem, getPublicCollection } from "../controllers/publicController";

const router = Router();

router.get("/items/:qrSlug", getPublicItem);
router.get("/collections/:publicSlug", getPublicCollection);

export default router;
