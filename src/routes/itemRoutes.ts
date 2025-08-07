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

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Search items
 *     responses:
 *       200:
 *         description: A list of items
 *   post:
 *     summary: Create a new item
 *     responses:
 *       201:
 *         description: Created item
 *   patch:
 *     summary: Update an item
 *     responses:
 *       200:
 *         description: Updated item
 *  
 */
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
