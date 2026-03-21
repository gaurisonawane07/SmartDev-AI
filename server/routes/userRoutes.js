import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

/**
 * @route   /api/user/profile
 */
router.route("/profile")
    .get(protect, getProfile)
    .put(protect, updateProfile);

export default router;