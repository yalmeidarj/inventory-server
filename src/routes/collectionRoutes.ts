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

router.get("/", listCollections);
router.get("/:slug", getCollection);
router.post("/", createCollection);
router.patch("/:id", updateCollection);
router.delete("/:id", deleteCollection);
router.post("/:id/items", addItemsToCollection);
router.delete("/:id/items/:itemId", removeItemFromCollection);

export default router;
