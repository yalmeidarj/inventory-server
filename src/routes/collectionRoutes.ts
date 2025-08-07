import { Router } from "express";
import {
  listCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addItemsToCollection,
  removeItemFromCollection,
} from "../controllers/collectionController";

const router = Router();

/**
 * @swagger
 * /collections:
 *   get:
 *     summary: List all collections
 *     responses:
 *       200:
 *         description: Array of collections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collection'
 *   post:
 *     summary: Create a collection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionInput'
 *     responses:
 *       201:
 *         description: Created collection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *
 * /collections/{slug}:
 *   get:
 *     summary: Retrieve a collection by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested collection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         description: Collection not found
 *
 * /collections/{id}:
 *   patch:
 *     summary: Update a collection
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
 *             $ref: '#/components/schemas/CollectionInput'
 *     responses:
 *       200:
 *         description: Updated collection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *   delete:
 *     summary: Delete a collection
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
 * /collections/{id}/items:
 *   post:
 *     summary: Add items to a collection
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
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Updated collection items
 *
 * /collections/{id}/items/{itemId}:
 *   delete:
 *     summary: Remove an item from a collection
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion confirmation
 */
router.get("/", listCollections);
router.get("/:slug", getCollection);
router.post("/", createCollection);
router.patch("/:id", updateCollection);
router.delete("/:id", deleteCollection);
router.post("/:id/items", addItemsToCollection);
router.delete("/:id/items/:itemId", removeItemFromCollection);

export default router;
