import fs from "fs";
import path from "path";
import { getPool } from "../config/db.js";

function mapPagination(query) {
  const page = Math.max(Number(query.page || 0), 0);
  const size = Math.min(Math.max(Number(query.size || 10), 1), 100);
  return { page, size, offset: page * size };
}

function toDbType(resourceType = "") {
  if (resourceType === "article") return "PAPER";
  if (resourceType === "pdf") return "GUIDE";
  return "TEXTBOOK";
}

const latestActivityExpr = "COALESCE(r.updated_at, r.created_at)";

function fromDbType(type = "") {
  return type.toLowerCase();
}

function mapResource(row) {
  const fileUrl = row.file_url || "";
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    subject: row.author,
    author: row.author,
    type: fromDbType(row.type),
    resourceType: fromDbType(row.type),
    description: row.description || "",
    fileName: fileUrl ? path.basename(fileUrl) : "",
    fileUrl,
    hasDownload: Boolean(fileUrl),
    isExternalFile: /^https?:\/\//i.test(fileUrl),
    downloadCount: row.downloads_count || 0,
    viewCount: row.view_count || 0,
    featured: Boolean(row.approved),
    uploadedBy: row.uploaded_by,
    uploadedByName: row.uploader_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
    averageRating: Number(row.rating || 0),
    totalRatings: Number(row.total_ratings || 0),
  };
}

async function listResources(filters = {}) {
  const { page, size, offset } = mapPagination(filters);
  const search = filters.search ? `%${filters.search}%` : null;
  const category = filters.category || null;
  const type = filters.type && filters.type !== "all" ? toDbType(filters.type) : null;
  const sort = filters.sort || "recent";

  const orderBy =
    sort === "title" ? "r.title ASC" :
    sort === "popular" ? "r.downloads_count DESC" :
    `${latestActivityExpr} DESC`;

  const [rows] = await getPool().query(
    `
      SELECT r.*, u.username AS uploader_name,
        (SELECT COUNT(*) FROM feedback f WHERE f.resource_id = r.id) AS total_ratings,
        (SELECT COUNT(*) FROM resource_views rv WHERE rv.resource_id = r.id) AS view_count
      FROM resources r
      JOIN users u ON u.id = r.uploaded_by
      WHERE (? IS NULL OR r.category = ?)
        AND (? IS NULL OR r.type = ?)
        AND (? IS NULL OR r.title LIKE ? OR r.description LIKE ? OR r.author LIKE ?)
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `,
    [category, category, type, type, search, search, search, search, size, offset]
  );

  const [countRows] = await getPool().query(
    `
      SELECT COUNT(*) AS total
      FROM resources r
      WHERE (? IS NULL OR r.category = ?)
        AND (? IS NULL OR r.type = ?)
        AND (? IS NULL OR r.title LIKE ? OR r.description LIKE ? OR r.author LIKE ?)
    `,
    [category, category, type, type, search, search, search, search]
  );

  return {
    resources: rows.map(mapResource),
    totalPages: Math.ceil(countRows[0].total / size),
    totalElements: countRows[0].total,
    currentPage: page,
  };
}

export async function getAllResources(req, res) {
  res.json(await listResources(req.query));
}

export async function getResourceById(req, res) {
  const [rows] = await getPool().query(
    `
      SELECT r.*, u.username AS uploader_name,
        (SELECT COUNT(*) FROM feedback f WHERE f.resource_id = r.id) AS total_ratings,
        (SELECT COUNT(*) FROM resource_views rv WHERE rv.resource_id = r.id) AS view_count
      FROM resources r
      JOIN users u ON u.id = r.uploaded_by
      WHERE r.id = ?
      LIMIT 1
    `,
    [Number(req.params.resourceId)]
  );

  if (!rows[0]) {
    return res.status(404).json({ message: "Resource not found." });
  }

  res.json(mapResource(rows[0]));
}

export async function searchResources(req, res) {
  res.json(await listResources({ ...req.query, search: req.query.query || req.query.q || "" }));
}

export async function getResourcesByCategory(req, res) {
  res.json(await listResources({ ...req.query, category: req.params.category }));
}

export async function uploadResource(req, res) {
  const { title, category, subject, resourceType, description } = req.body;
  if (!title || !category || !subject || !resourceType || !description || !req.file) {
    return res.status(400).json({ message: "All resource fields and a file are required." });
  }

  const fileUrl = `uploads/${req.file.filename}`;
  const [result] = await getPool().query(
    `
      INSERT INTO resources
      (approved, downloads_count, rating, created_at, updated_at, uploaded_by, description, author, category, file_url, image_url, title, type)
      VALUES (?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [1, 0, 0, req.user.id, description, subject, category, fileUrl, null, title, toDbType(resourceType)]
  );

  res.status(201).json({ message: "Resource uploaded successfully.", resourceId: result.insertId });
}

export async function updateResource(req, res) {
  const resourceId = Number(req.params.resourceId);
  const { title, category, subject, resourceType, description } = req.body;
  const [rows] = await getPool().query("SELECT * FROM resources WHERE id = ? LIMIT 1", [resourceId]);
  const existing = rows[0];
  if (!existing) {
    return res.status(404).json({ message: "Resource not found." });
  }

  let fileUrl = existing.file_url;
  if (req.file) {
    if (existing.file_url && !/^https?:\/\//i.test(existing.file_url)) {
      const [usageRows] = await getPool().query(
        "SELECT COUNT(*) AS total FROM resources WHERE file_url = ? AND id <> ?",
        [existing.file_url, resourceId]
      );
      const existingAbsolutePath = path.resolve(process.cwd(), existing.file_url);
      if (Number(usageRows[0]?.total || 0) === 0 && fs.existsSync(existingAbsolutePath)) {
        fs.unlinkSync(existingAbsolutePath);
      }
    }
    fileUrl = `uploads/${req.file.filename}`;
  }

  await getPool().query(
    "UPDATE resources SET description = ?, author = ?, category = ?, file_url = ?, title = ?, type = ?, updated_at = NOW() WHERE id = ?",
    [description, subject, category, fileUrl, title, toDbType(resourceType), resourceId]
  );

  res.json({ message: "Resource updated successfully." });
}

export async function deleteResource(req, res) {
  const resourceId = Number(req.params.resourceId);
  const [rows] = await getPool().query("SELECT file_url FROM resources WHERE id = ? LIMIT 1", [resourceId]);
  if (!rows[0]) {
    return res.status(404).json({ message: "Resource not found." });
  }

  if (rows[0].file_url && !/^https?:\/\//i.test(rows[0].file_url)) {
    const [usageRows] = await getPool().query(
      "SELECT COUNT(*) AS total FROM resources WHERE file_url = ? AND id <> ?",
      [rows[0].file_url, resourceId]
    );
    const absolutePath = path.resolve(process.cwd(), rows[0].file_url);
    if (Number(usageRows[0]?.total || 0) === 0 && fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }
  await getPool().query("DELETE FROM resources WHERE id = ?", [resourceId]);
  res.json({ message: "Resource deleted successfully." });
}

export async function downloadResource(req, res) {
  const resourceId = Number(req.params.resourceId);
  const [rows] = await getPool().query("SELECT * FROM resources WHERE id = ? LIMIT 1", [resourceId]);
  if (!rows[0]) {
    return res.status(404).json({ message: "Resource not found." });
  }

  if (/^https?:\/\//i.test(rows[0].file_url || "")) {
    await getPool().query("UPDATE resources SET downloads_count = downloads_count + 1 WHERE id = ?", [resourceId]);
    await getPool().query("INSERT INTO downloads (downloaded_at, resource_id, user_id) VALUES (NOW(), ?, ?)", [resourceId, req.user.id]);
    return res.json({
      downloadUrl: rows[0].file_url,
      external: true,
    });
  }

  const filePath = path.resolve(process.cwd(), rows[0].file_url);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Resource file is missing from the server." });
  }

  await getPool().query("UPDATE resources SET downloads_count = downloads_count + 1 WHERE id = ?", [resourceId]);
  await getPool().query("INSERT INTO downloads (downloaded_at, resource_id, user_id) VALUES (NOW(), ?, ?)", [resourceId, req.user.id]);
  res.download(filePath);
}

export async function getCategories(req, res) {
  const [rows] = await getPool().query("SELECT category, COUNT(*) AS count FROM resources GROUP BY category ORDER BY category ASC");
  res.json(rows.map((row) => ({ name: row.category, count: Number(row.count) })));
}

export async function getResourceStats(req, res) {
  const [totalRows] = await getPool().query("SELECT COUNT(*) AS total FROM resources");
  const [byCategoryRows] = await getPool().query("SELECT category, COUNT(*) AS total FROM resources GROUP BY category ORDER BY category ASC");
  const [recentRows] = await getPool().query(
    "SELECT id, title, category, author, created_at, updated_at FROM resources ORDER BY COALESCE(updated_at, created_at) DESC LIMIT 5"
  );
  res.json({
    totalResources: totalRows[0].total,
    byCategory: byCategoryRows.map((row) => ({ category: row.category, total: Number(row.total) })),
    recentUploads: recentRows,
  });
}

export async function getFeaturedResources(req, res) {
  const limit = Math.min(Math.max(Number(req.query.limit || 6), 1), 20);
  const [rows] = await getPool().query(
    `
      SELECT r.*, u.username AS uploader_name,
        (SELECT COUNT(*) FROM feedback f WHERE f.resource_id = r.id) AS total_ratings,
        (SELECT COUNT(*) FROM resource_views rv WHERE rv.resource_id = r.id) AS view_count
      FROM resources r
      JOIN users u ON u.id = r.uploaded_by
      ORDER BY COALESCE(r.updated_at, r.created_at) DESC
      LIMIT ?
    `,
    [limit]
  );
  res.json(rows.map(mapResource));
}

export async function trackResourceAccess(req, res) {
  await getPool().query("INSERT INTO resource_views (resource_id, user_id, viewed_at) VALUES (?, ?, NOW())", [
    Number(req.params.resourceId),
    req.user.id,
  ]);
  res.json({ message: "Resource access tracked successfully." });
}

export async function rateResource(req, res) {
  const { rating, comment = "" } = req.body;
  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  await getPool().query("INSERT INTO feedback (rating, created_at, resource_id, user_id, comment) VALUES (?, NOW(), ?, ?, ?)", [
    Number(rating),
    Number(req.params.resourceId),
    req.user.id,
    comment,
  ]);
  await getPool().query(
    "UPDATE resources SET rating = (SELECT COALESCE(AVG(rating), 0) FROM feedback WHERE resource_id = ?) WHERE id = ?",
    [Number(req.params.resourceId), Number(req.params.resourceId)]
  );
  res.json({ message: "Rating submitted successfully." });
}

export async function getResourceRatings(req, res) {
  const resourceId = Number(req.params.resourceId);
  const { page, size, offset } = mapPagination(req.query);
  const [rows] = await getPool().query(
    `
      SELECT f.id, f.rating, f.comment, f.created_at, u.username AS name, u.email
      FROM feedback f
      JOIN users u ON u.id = f.user_id
      WHERE f.resource_id = ?
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `,
    [resourceId, size, offset]
  );
  const [summaryRows] = await getPool().query("SELECT COUNT(*) AS totalRatings, AVG(rating) AS averageRating FROM feedback WHERE resource_id = ?", [resourceId]);

  res.json({
    ratings: rows.map((row) => ({
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      userName: row.name,
      userEmail: row.email,
    })),
    averageRating: Number(summaryRows[0].averageRating || 0),
    totalRatings: Number(summaryRows[0].totalRatings || 0),
    currentPage: page,
  });
}
