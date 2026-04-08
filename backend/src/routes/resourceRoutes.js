import { Router } from "express";
import {
  deleteResource,
  downloadResource,
  getAllResources,
  getCategories,
  getFeaturedResources,
  getResourceById,
  getResourceRatings,
  getResourceStats,
  getResourcesByCategory,
  rateResource,
  searchResources,
  trackResourceAccess,
  updateResource,
  uploadResource,
} from "../controllers/resourceController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getAllResources));
router.get("/search", asyncHandler(searchResources));
router.get("/category/:category", asyncHandler(getResourcesByCategory));
router.get("/categories", asyncHandler(getCategories));
router.get("/stats", requireAuth, requireRole("admin"), asyncHandler(getResourceStats));
router.get("/featured", asyncHandler(getFeaturedResources));
router.get("/:resourceId", asyncHandler(getResourceById));
router.get("/:resourceId/download", requireAuth, asyncHandler(downloadResource));
router.get("/:resourceId/ratings", asyncHandler(getResourceRatings));
router.post("/", requireAuth, requireRole("admin"), upload.single("file"), asyncHandler(uploadResource));
router.put("/:resourceId", requireAuth, requireRole("admin"), upload.single("file"), asyncHandler(updateResource));
router.delete("/:resourceId", requireAuth, requireRole("admin"), asyncHandler(deleteResource));
router.post("/:resourceId/track", requireAuth, asyncHandler(trackResourceAccess));
router.post("/:resourceId/rate", requireAuth, asyncHandler(rateResource));

export default router;
