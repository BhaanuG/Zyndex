import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getPool } from "../config/db.js";
import { sanitizeUser } from "../utils/auth.js";

async function loadUser(userId) {
  const [rows] = await getPool().query(
    "SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  return rows[0] ? sanitizeUser(rows[0]) : null;
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await loadUser(payload.sub);

    if (!user || !user.active) {
      return res.status(401).json({ message: "Invalid or inactive account." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid authentication token." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource." });
    }

    next();
  };
}
