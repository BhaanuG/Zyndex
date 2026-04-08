import { Router } from "express";
import {
  login,
  logout,
  me,
  register,
  requestAdminAccess,
  requestPasswordReset,
  resetPassword,
  updatePassword,
  validateLogin,
  verifyCode,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/login", asyncHandler(login));
router.post("/check-login", asyncHandler(validateLogin));
router.post("/register", asyncHandler(register));
router.post("/admin-request", asyncHandler(requestAdminAccess));
router.post("/verify-code", asyncHandler(verifyCode));
router.post("/logout", asyncHandler(logout));
router.get("/me", requireAuth, asyncHandler(me));
router.put("/password", requireAuth, asyncHandler(updatePassword));
router.post("/forgot-password", asyncHandler(requestPasswordReset));
router.post("/reset-password", asyncHandler(resetPassword));

export default router;
