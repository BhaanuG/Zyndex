import crypto from "crypto";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const OTP_TTL_MS = 2 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_OTP_REQUESTS = 3;
const MAX_OTP_ATTEMPTS = 5;
const CLEANUP_INTERVAL_MS = 60 * 1000;
const OTP_POOL_SIZE = 1000;
const TARGET_DIGIT_COUNT = (OTP_POOL_SIZE * 4) / 10;

const otpRecords = new Map();
const usedOtpHistory = new Set();
const requestHistory = new Map();

let cleanupTimerStarted = false;

function getOtpKey(email, role) {
  return `${String(role || "").toLowerCase()}:${String(email || "").toLowerCase()}`;
}

function isFancyOtp(code) {
  const digits = code.split("").map(Number);
  const diffs = digits.slice(1).map((digit, index) => digit - digits[index]);
  const isArithmetic = diffs.every((diff) => diff === diffs[0]);
  const isAscending = [...digits].sort((a, b) => a - b).join("") === code;
  const isDescending = [...digits].sort((a, b) => b - a).join("") === code;
  return isArithmetic || isAscending || isDescending;
}

function hashOtp(otp) {
  return crypto.createHmac("sha256", env.jwtSecret).update(String(otp)).digest("hex");
}

function buildBalancedOtpPool() {
  const candidates = [];

  for (let first = 1; first <= 9; first += 1) {
    for (let second = 0; second <= 9; second += 1) {
      for (let third = 0; third <= 9; third += 1) {
        for (let fourth = 1; fourth <= 9; fourth += 1) {
          const otp = `${first}${second}${third}${fourth}`;
          if (new Set(otp).size !== 4) continue;
          if (isFancyOtp(otp)) continue;
          candidates.push(otp);
        }
      }
    }
  }

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const digitCounts = Array(10).fill(0);
    const selected = [];
    const remaining = new Set(candidates);

    for (let step = 0; step < OTP_POOL_SIZE; step += 1) {
      let bestOtp = "";
      let bestScore = Number.NEGATIVE_INFINITY;

      for (const otp of remaining) {
        const digits = otp.split("").map(Number);
        if (digits.some((digit) => digitCounts[digit] >= TARGET_DIGIT_COUNT)) continue;

        const deficitScore = digits.reduce((score, digit) => score + (TARGET_DIGIT_COUNT - digitCounts[digit]), 0);
        const secureTieBreaker = crypto.randomInt(0, 10000) / 10000;
        const score = deficitScore + secureTieBreaker;

        if (score > bestScore) {
          bestScore = score;
          bestOtp = otp;
        }
      }

      if (!bestOtp) break;

      selected.push(bestOtp);
      remaining.delete(bestOtp);
      bestOtp.split("").forEach((digit) => {
        digitCounts[Number(digit)] += 1;
      });
    }

    const isBalanced = digitCounts.every((count) => count === TARGET_DIGIT_COUNT);
    if (selected.length === OTP_POOL_SIZE && isBalanced) {
      return selected;
    }
  }

  throw new Error("Unable to build a balanced secure OTP pool.");
}

const balancedOtpPool = buildBalancedOtpPool();

export function generateSecureOtp() {
  const availableOtps = balancedOtpPool.filter((otp) => !usedOtpHistory.has(hashOtp(otp)));
  if (availableOtps.length === 0) {
    throw new Error("OTP history is exhausted. Please restart the OTP store or switch to persistent storage.");
  }

  return availableOtps[crypto.randomInt(0, availableOtps.length)];
}

function cleanupExpiredOtps() {
  const now = Date.now();

  for (const [key, record] of otpRecords.entries()) {
    if (record.expiresAt <= now || record.used) {
      otpRecords.delete(key);
    }
  }

  for (const [email, timestamps] of requestHistory.entries()) {
    const activeTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (activeTimestamps.length === 0) {
      requestHistory.delete(email);
    } else {
      requestHistory.set(email, activeTimestamps);
    }
  }
}

function ensureCleanupTimer() {
  if (cleanupTimerStarted) return;
  cleanupTimerStarted = true;
  setInterval(cleanupExpiredOtps, CLEANUP_INTERVAL_MS).unref?.();
}

function checkRateLimit(email) {
  const normalizedEmail = String(email || "").toLowerCase();
  const now = Date.now();
  const timestamps = (requestHistory.get(normalizedEmail) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= MAX_OTP_REQUESTS) {
    const retryAfterSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - timestamps[0])) / 1000);
    const error = new Error(`Too many OTP requests. Please try again after ${retryAfterSeconds} seconds.`);
    error.statusCode = 429;
    throw error;
  }

  timestamps.push(now);
  requestHistory.set(normalizedEmail, timestamps);
}

function createOtpTransporter() {
  const hasSmtpConfig = env.otpSmtpHost && env.otpSmtpUser && env.otpSmtpPass && env.otpMailFrom;

  if (!hasSmtpConfig) {
    const error = new Error("OTP SMTP email is not configured. Add OTP_SMTP_USER and OTP_SMTP_PASS in backend/.env.");
    error.statusCode = 503;
    throw error;
  }

  return nodemailer.createTransport({
    host: env.otpSmtpHost,
    port: env.otpSmtpPort,
    secure: env.otpSmtpSecure,
    auth: {
      user: env.otpSmtpUser,
      pass: env.otpSmtpPass,
    },
  });
}

async function sendOtpEmail({ email, otp, role }) {
  const transporter = createOtpTransporter();
  const accountType = String(role || "user").toUpperCase();

  await transporter.sendMail({
    from: env.otpMailFrom,
    to: email,
    subject: "Your Zyndex login OTP",
    text: `Your Zyndex login OTP is ${otp}. This code expires in 2 minutes and can be used only once. Account type: ${accountType}.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #172033;">
        <h2 style="color: #f0440c;">Zyndex Login OTP</h2>
        <p>Your ${accountType} login OTP is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
        <p>This code expires in <strong>2 minutes</strong> and can be used only once.</p>
        <p>If you did not request this login, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendOtp(req, res) {
  ensureCleanupTimer();

  const email = String(req.body.email || "").trim().toLowerCase();
  const role = String(req.body.role || "").trim().toLowerCase();
  const force = req.body.force === true;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required." });
  }

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Role must be user or admin." });
  }

  cleanupExpiredOtps();
  const key = getOtpKey(email, role);
  const existingRecord = otpRecords.get(key);

  if (!force && existingRecord && !existingRecord.used && existingRecord.expiresAt > Date.now()) {
    return res.json({
      message: "OTP already sent.",
      expiresInSeconds: Math.max(1, Math.ceil((existingRecord.expiresAt - Date.now()) / 1000)),
      emailSent: true,
      reused: true,
    });
  }

  checkRateLimit(email);

  const otp = generateSecureOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = Date.now() + OTP_TTL_MS;
  usedOtpHistory.add(otpHash);

  otpRecords.set(key, {
    email,
    otpHash,
    role,
    expiresAt,
    used: false,
    attempts: 0,
  });

  try {
    await sendOtpEmail({ email, otp, role });
  } catch (error) {
    otpRecords.delete(key);
    usedOtpHistory.delete(otpHash);
    return res.status(error.statusCode || 502).json({
      message: error.message || "Could not send OTP email. Please try again.",
    });
  }

  res.json({
    message: "OTP sent successfully.",
    expiresInSeconds: OTP_TTL_MS / 1000,
    emailSent: true,
    ...(env.exposeOtpInDevelopment ? { devOtp: otp } : {}),
  });
}

export async function verifyOtp(req, res) {
  ensureCleanupTimer();
  cleanupExpiredOtps();

  const email = String(req.body.email || "").trim().toLowerCase();
  const otp = String(req.body.otp || "").trim();
  const role = String(req.body.role || "").trim().toLowerCase();

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  if (!/^\d{4}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be a 4-digit code." });
  }

  const rolesToCheck = role ? [role] : ["user", "admin"];
  const recordKey = rolesToCheck.map((currentRole) => getOtpKey(email, currentRole)).find((key) => otpRecords.has(key));
  const record = recordKey ? otpRecords.get(recordKey) : null;

  if (!record) {
    return res.status(404).json({ message: "OTP not found. Please request a new OTP." });
  }

  if (record.used) {
    otpRecords.delete(recordKey);
    return res.status(400).json({ message: "OTP has already been used. Please request a new OTP." });
  }

  if (Date.now() > record.expiresAt) {
    otpRecords.delete(recordKey);
    return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
  }

  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    otpRecords.delete(recordKey);
    return res.status(429).json({ message: "Maximum OTP attempts exceeded. Please request a new OTP." });
  }

  if (record.otpHash !== hashOtp(otp)) {
    record.attempts += 1;
    otpRecords.set(recordKey, record);
    const remainingAttempts = Math.max(0, MAX_OTP_ATTEMPTS - record.attempts);
    return res.status(400).json({ message: `Invalid OTP. ${remainingAttempts} attempts remaining.` });
  }

  record.used = true;
  otpRecords.delete(recordKey);

  res.json({ message: "OTP verified successfully." });
}
