import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

export function sanitizeUser(row) {
  const email = row.email;
  return {
    id: row.id,
    name: row.name || row.username,
    email,
    role: row.role === 'ADMIN' ? 'admin' : 'user',
    isPrimaryAdmin: String(email || "").toLowerCase() === String(env.mainAdminEmail || "").toLowerCase(),
    bio: row.bio || "",
    registrationNo: row.registration_no || "",
    active: row.active === undefined ? true : Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
