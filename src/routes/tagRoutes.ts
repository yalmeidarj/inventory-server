import { Router } from "express";
import { getTags, createOrRenameTag, deleteTag } from "../controllers/tagController";

const router = Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: List all tags
 *     responses:
 *       200:
 *         description: Array of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *   post:
 *     summary: Create or rename a tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *     responses:
 *       200:
 *         description: Created tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *
 * /tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion confirmation
 */
router.get("/", getTags);
router.post("/", createOrRenameTag);
router.delete("/:id", deleteTag);

export default router;
