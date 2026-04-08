import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { getPool } from "../config/db.js";
import { signToken, sanitizeUser } from "../utils/auth.js";

async function findUserByEmail(email) {
  const [rows] = await getPool().query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function createSmtpTransporter() {
  const hasSmtpConfig = env.otpSmtpHost && env.otpSmtpUser && env.otpSmtpPass && env.otpMailFrom;
  if (!hasSmtpConfig) {
    const error = new Error("SMTP email is not configured.");
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

async function sendSignupConfirmationEmail({ name, email }) {
  const transporter = createSmtpTransporter();
  await transporter.sendMail({
    from: env.otpMailFrom,
    to: email,
    subject: "Welcome to Zyndex",
    text: `Hello ${name}, your account has been created successfully in Zyndex. You can now log in with your registered email and password to access the educational resource library.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #172033;">
        <h2 style="color: #f0440c;">Welcome to Zyndex</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your account has been created successfully in Zyndex.</p>
        <p>You can now log in with your registered email and password to access the educational resource library.</p>
        <p style="margin-top: 24px;">Thank you,<br/>Zyndex Team</p>
      </div>
    `,
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await getPool().query(
    "INSERT INTO users (created_at, email, password, username, role) VALUES (NOW(), ?, ?, ?, ?)",
    [email, passwordHash, name, "STUDENT"]
  );

  const [rows] = await getPool().query("SELECT * FROM users WHERE id = ? LIMIT 1", [result.insertId]);
  const safeUser = sanitizeUser(rows[0]);
  let confirmationEmailSent = true;
  let confirmationEmailError = "";

  try {
    await sendSignupConfirmationEmail({ name, email });
  } catch (error) {
    confirmationEmailSent = false;
    confirmationEmailError = error.message || "Confirmation email could not be sent.";
    console.error("Signup confirmation email failed:", error);
  }

  res.status(201).json({
    message: confirmationEmailSent
      ? "Account created successfully. Confirmation email sent."
      : "Account created successfully, but confirmation email could not be sent.",
    user: safeUser,
    confirmationEmailSent,
    confirmationEmailError,
  });
}

export async function login(req, res) {
  const { email, password, role, preview = false } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (preview && !isValidEmail(email)) {
    return res.status(400).json({ message: "Entered wrong email." });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(preview ? 404 : 401).json({
      message: preview ? "Entered unregistered email." : "Invalid email or password.",
    });
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    return res.status(401).json({
      message: preview ? "Entered wrong password." : "Invalid email or password.",
    });
  }

  const safeUser = sanitizeUser(user);
  if (role && safeUser.role !== role) {
    return res.status(403).json({
      message:
        role === "admin"
          ? "Entered wrong email for admin access."
          : "Entered wrong email for user access.",
    });
  }

  if (preview) {
    return res.json({
      message: "Credentials verified.",
      user: safeUser,
    });
  }

  res.json({ token: signToken(safeUser), user: safeUser });
}

export async function validateLogin(req, res) {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Entered wrong email." });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "Entered unregistered email." });
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    return res.status(401).json({ message: "Entered wrong password." });
  }

  const safeUser = sanitizeUser(user);
  if (role && safeUser.role !== role) {
    return res.status(403).json({ message: `This account is not registered as ${role}.` });
  }

  res.json({
    message: "Credentials verified.",
    user: safeUser,
  });
}

export async function requestAdminAccess(req, res) {
  const { fullName, displayName, email, password } = req.body;

  if (!fullName || !displayName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await getPool().query(
    "INSERT INTO admin_requests (full_name, display_name, email, password_hash) VALUES (?, ?, ?, ?)",
    [fullName, displayName, email, passwordHash]
  );

  res.status(201).json({ message: "Admin access request submitted successfully.", requestId: result.insertId });
}

export async function verifyCode(req, res) {
  const { code } = req.body;
  res.json({ valid: typeof code === "string" && /^\d{6}$/.test(code) });
}

export async function logout(req, res) {
  res.json({ message: "Logged out successfully." });
}

export async function me(req, res) {
  res.json(req.user);
}

export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }

  const user = await findUserByEmail(req.user.email);
  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await getPool().query("UPDATE users SET password = ? WHERE id = ?", [newPasswordHash, req.user.id]);
  res.json({ message: "Password updated successfully." });
}

export async function requestPasswordReset(req, res) {
  const { email, fullName = "", role = "user", previousPassword = "", newPassword = "" } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const hashedNewPassword = newPassword ? await bcrypt.hash(newPassword, 10) : "";
  await getPool().query(
    "INSERT INTO password_reset_requests (full_name, email, role, previous_password, new_password_hash) VALUES (?, ?, ?, ?, ?)",
    [fullName || email.split("@")[0], email, role, previousPassword || null, hashedNewPassword || ""]
  );

  const existingUser = await findUserByEmail(email);
  if (existingUser && newPassword) {
    await getPool().query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, existingUser.id]);
  }

  res.json({ message: "Password reset request submitted successfully." });
}

export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await getPool().query("UPDATE users SET password = ? WHERE id = ?", [newPasswordHash, user.id]);
  res.json({ message: "Password reset successfully." });
}
