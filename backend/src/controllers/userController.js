import bcrypt from "bcryptjs";
import { getPool } from "../config/db.js";
import { sanitizeUser, signToken } from "../utils/auth.js";

function mapPagination(query) {
  const page = Math.max(Number(query.page || 0), 0);
  const size = Math.min(Math.max(Number(query.size || 10), 1), 100);
  return { page, size, offset: page * size };
}

export async function getProfile(req, res) {
  const target = req.params.userId === "me" ? req.user.id : Number(req.params.userId);
  if (target !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "You can only view your own profile." });
  }

  const [rows] = await getPool().query("SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1", [target]);
  if (!rows[0]) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json(sanitizeUser(rows[0]));
}

export async function updateProfile(req, res) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  await getPool().query("UPDATE users SET username = ?, email = ? WHERE id = ?", [name, email, req.user.id]);
  const [rows] = await getPool().query("SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1", [req.user.id]);
  const user = sanitizeUser(rows[0]);

  res.json({ ...user, token: signToken(user) });
}

export async function uploadAvatar(req, res) {
  res.json({ avatarUrl: "" });
}

export async function getDownloadHistory(req, res) {
  const { page, size, offset } = mapPagination(req.query);
  const [rows] = await getPool().query(
    `
      SELECT d.downloaded_at, r.id AS resource_id, r.title, r.category, r.author, r.type
      FROM downloads d
      JOIN resources r ON r.id = d.resource_id
      WHERE d.user_id = ?
      ORDER BY d.downloaded_at DESC
      LIMIT ? OFFSET ?
    `,
    [req.user.id, size, offset]
  );
  const [countRows] = await getPool().query("SELECT COUNT(*) AS total FROM downloads WHERE user_id = ?", [req.user.id]);

  res.json({
    resources: rows.map((row) => ({
      id: row.resource_id,
      title: row.title,
      category: row.category,
      subject: row.author,
      type: row.type.toLowerCase(),
      downloadedAt: row.downloaded_at,
    })),
    totalPages: Math.ceil(countRows[0].total / size),
    totalElements: countRows[0].total,
    currentPage: page,
  });
}

export async function getFavorites(req, res) {
  const { page, size, offset } = mapPagination(req.query);
  const [rows] = await getPool().query(
    `
      SELECT sr.saved_at, r.id, r.title, r.category, r.author, r.type
      FROM saved_resources sr
      JOIN resources r ON r.id = sr.resource_id
      WHERE sr.user_id = ?
      ORDER BY sr.saved_at DESC
      LIMIT ? OFFSET ?
    `,
    [req.user.id, size, offset]
  );
  const [countRows] = await getPool().query("SELECT COUNT(*) AS total FROM saved_resources WHERE user_id = ?", [req.user.id]);

  res.json({
    resources: rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      subject: row.author,
      type: row.type.toLowerCase(),
      addedAt: row.saved_at,
    })),
    totalPages: Math.ceil(countRows[0].total / size),
    totalElements: countRows[0].total,
    currentPage: page,
  });
}

export async function getRecentViews(req, res) {
  const { page, size, offset } = mapPagination(req.query);
  const [rows] = await getPool().query(
    `
      SELECT
        MAX(rv.viewed_at) AS viewed_at,
        r.id,
        r.title,
        r.category,
        r.author,
        r.type,
        r.description,
        r.file_url
      FROM resource_views rv
      JOIN resources r ON r.id = rv.resource_id
      WHERE rv.user_id = ?
      GROUP BY r.id, r.title, r.category, r.author, r.type, r.description, r.file_url
      ORDER BY viewed_at DESC
      LIMIT ? OFFSET ?
    `,
    [req.user.id, size, offset]
  );
  const [countRows] = await getPool().query(
    "SELECT COUNT(DISTINCT resource_id) AS total FROM resource_views WHERE user_id = ?",
    [req.user.id]
  );

  res.json({
    resources: rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      subject: row.author,
      author: row.author,
      type: row.type.toLowerCase(),
      description: row.description || "",
      fileUrl: row.file_url || "",
      viewedAt: row.viewed_at,
    })),
    totalPages: Math.ceil(countRows[0].total / size),
    totalElements: countRows[0].total,
    currentPage: page,
  });
}

export async function addToFavorites(req, res) {
  await getPool().query("INSERT IGNORE INTO saved_resources (resource_id, saved_at, user_id) VALUES (?, NOW(), ?)", [
    Number(req.params.resourceId),
    req.user.id,
  ]);
  res.status(201).json({ message: "Resource added to favorites." });
}

export async function removeFromFavorites(req, res) {
  await getPool().query("DELETE FROM saved_resources WHERE user_id = ? AND resource_id = ?", [req.user.id, Number(req.params.resourceId)]);
  res.json({ message: "Resource removed from favorites." });
}

export async function getAllUsers(req, res) {
  const { page, size, offset } = mapPagination(req.query);
  const search = req.query.search ? `%${req.query.search}%` : "%";
  const [rows] = await getPool().query(
    "SELECT id, username, email, role, created_at FROM users WHERE username LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [search, search, size, offset]
  );
  const [countRows] = await getPool().query("SELECT COUNT(*) AS total FROM users WHERE username LIKE ? OR email LIKE ?", [search, search]);

  res.json({
    users: rows.map((row) => ({
      id: row.id,
      name: row.username,
      email: row.email,
      role: row.role === "ADMIN" ? "admin" : "user",
      registrationNo: "",
      active: true,
      dateJoined: row.created_at,
    })),
    totalPages: Math.ceil(countRows[0].total / size),
    totalElements: countRows[0].total,
    currentPage: page,
  });
}

export async function createUser(req, res) {
  const { name, email, password, role = "user" } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await getPool().query(
    "INSERT INTO users (created_at, email, password, username, role) VALUES (NOW(), ?, ?, ?, ?)",
    [email, passwordHash, name, role === "admin" ? "ADMIN" : "STUDENT"]
  );

  res.status(201).json({ message: "User created successfully.", userId: result.insertId });
}

export async function updateUser(req, res) {
  const userId = Number(req.params.userId);
  const { name, email, role, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    await getPool().query(
      "UPDATE users SET username = ?, email = ?, role = ?, password = ? WHERE id = ?",
      [name, email, role === "admin" ? "ADMIN" : "STUDENT", passwordHash, userId]
    );
  } else {
    await getPool().query(
      "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role === "admin" ? "ADMIN" : "STUDENT", userId]
    );
  }

  res.json({ message: "User updated successfully." });
}

export async function updateUserRole(req, res) {
  await getPool().query("UPDATE users SET role = ? WHERE id = ?", [req.body.role === "admin" ? "ADMIN" : "STUDENT", Number(req.params.userId)]);
  res.json({ message: "User role updated successfully." });
}

export async function updateUserStatus(req, res) {
  res.json({ message: "Status changes are not supported by the current schema." });
}

export async function deleteUser(req, res) {
  const userId = Number(req.params.userId);

  if (userId === req.user.id) {
    return res.status(400).json({ message: "You cannot delete the account you are currently logged in with." });
  }

  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();

    await connection.query("UPDATE resources SET uploaded_by = ? WHERE uploaded_by = ?", [req.user.id, userId]);
    await connection.query("DELETE FROM downloads WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM saved_resources WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM feedback WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM resource_views WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM users WHERE id = ?", [userId]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  res.json({ message: "User deleted successfully." });
}

export async function getUserStats(req, res) {
  const [downloadsRows] = await getPool().query("SELECT COUNT(*) AS total FROM downloads WHERE user_id = ?", [req.user.id]);
  const [favoritesRows] = await getPool().query("SELECT COUNT(*) AS total FROM saved_resources WHERE user_id = ?", [req.user.id]);
  const [uploadsRows] = await getPool().query("SELECT COUNT(*) AS total FROM resources WHERE uploaded_by = ?", [req.user.id]);

  res.json({
    downloads: downloadsRows[0].total,
    favorites: favoritesRows[0].total,
    uploads: uploadsRows[0].total,
  });
}
