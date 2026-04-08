import { Router } from "express";
import {
  addToFavorites,
  createUser,
  deleteUser,
  getAllUsers,
  getDownloadHistory,
  getFavorites,
  getRecentViews,
  getProfile,
  getUserStats,
  removeFromFavorites,
  updateProfile,
  updateUser,
  updateUserRole,
  updateUserStatus,
  uploadAvatar,
} from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);
router.get("/:userId/profile", asyncHandler(getProfile));
router.put("/profile", asyncHandler(updateProfile));
router.post("/avatar", upload.single("avatar"), asyncHandler(uploadAvatar));
router.get("/downloads", asyncHandler(getDownloadHistory));
router.get("/recent-views", asyncHandler(getRecentViews));
router.get("/favorites", asyncHandler(getFavorites));
router.post("/favorites/:resourceId", asyncHandler(addToFavorites));
router.delete("/favorites/:resourceId", asyncHandler(removeFromFavorites));
router.get("/stats", asyncHandler(getUserStats));
router.get("/", requireRole("admin"), asyncHandler(getAllUsers));
router.post("/", requireRole("admin"), asyncHandler(createUser));
router.put("/:userId", requireRole("admin"), asyncHandler(updateUser));
router.put("/:userId/role", requireRole("admin"), asyncHandler(updateUserRole));
router.put("/:userId/status", requireRole("admin"), asyncHandler(updateUserStatus));
router.delete("/:userId", requireRole("admin"), asyncHandler(deleteUser));

export default router;
