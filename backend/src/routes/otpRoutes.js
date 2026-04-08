import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/send-otp", asyncHandler(sendOtp));
router.post("/verify-otp", asyncHandler(verifyOtp));

export default router;
