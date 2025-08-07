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
 *     summary: Search and filter items
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number starting from 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, updated-desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *   post:
 *     summary: Create a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       201:
 *         description: Created item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *
 * /items/import/csv:
 *   post:
 *     summary: Import items from a CSV file
 *     responses:
 *       200:
 *         description: Import result
 *
 * /items/sku/{sku}:
 *   get:
 *     summary: Retrieve an item by SKU
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *
 * /items/{id}:
 *   get:
 *     summary: Retrieve an item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *   patch:
 *     summary: Update an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       200:
 *         description: Updated item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *   delete:
 *     summary: Delete an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion confirmation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *
 * /items/{id}/images:
 *   post:
 *     summary: Replace and reorder images for an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Image'
 *     responses:
 *       200:
 *         description: Updated images
 *
 * /items/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete an image from an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion confirmation
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
