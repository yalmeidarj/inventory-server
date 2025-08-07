import { Router } from "express";
import {
  searchItems,
  getItemById,
  getItemBySku,
  createItem,
  updateItem,
  deleteItem,
  addOrReorderImages,
  deleteImage,
  importItemsCsv,
} from "../controllers/itemController";

const router = Router();

router.get("/", searchItems);
router.get("/sku/:sku", getItemBySku);
router.post("/import/csv", importItemsCsv);
router.get("/:id", getItemById);
router.post("/", createItem);
router.patch("/:id", updateItem);
router.delete("/:id", deleteItem);
router.post("/:id/images", addOrReorderImages);
router.delete("/:id/images/:imageId", deleteImage);

export default router;
