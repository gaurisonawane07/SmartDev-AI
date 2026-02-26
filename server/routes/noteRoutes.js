import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createNote, getMyNotes, updateNote, deleteNote } from "../controllers/noteController.js";

const router = express.Router();

router.post('/', protect, createNote);
router.get('/', protect, getMyNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

export default router;