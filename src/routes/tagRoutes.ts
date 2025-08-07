import { Router } from "express";
import { getTags, createOrRenameTag, deleteTag } from "../controllers/tagController";

const router = Router();

router.get("/", getTags);
router.post("/", createOrRenameTag);
router.delete("/:id", deleteTag);

export default router;
