import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";
import {
    chatWithAI,
    getHistory,
    getConversation,
    saveResponseToNote
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", protect, aiLimiter, chatWithAI);

router.get("/history", protect, getHistory);

router.get("/conversation/:id", protect, getConversation);

router.post("/save-note", protect, saveResponseToNote);

export default router;