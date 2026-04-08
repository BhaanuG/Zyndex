import { Router } from "express";
import {
  deleteFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackStats,
  respondToFeedback,
  submitContact,
  submitFeedback,
  updateFeedbackStatus,
} from "../controllers/feedbackController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", requireAuth, asyncHandler(submitFeedback));
router.post("/contact", asyncHandler(submitContact));
router.get("/", requireAuth, requireRole("admin"), asyncHandler(getAllFeedback));
router.get("/stats", requireAuth, requireRole("admin"), asyncHandler(getFeedbackStats));
router.get("/:feedbackId", requireAuth, requireRole("admin"), asyncHandler(getFeedbackById));
router.put("/:feedbackId/status", requireAuth, requireRole("admin"), asyncHandler(updateFeedbackStatus));
router.post("/:feedbackId/respond", requireAuth, requireRole("admin"), asyncHandler(respondToFeedback));
router.delete("/:feedbackId", requireAuth, requireRole("admin"), asyncHandler(deleteFeedback));

export default router;
