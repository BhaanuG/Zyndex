import { getPool } from "../config/db.js";

function mapPagination(query) {
  const page = Math.max(Number(query.page || 0), 0);
  const size = Math.min(Math.max(Number(query.size || 10), 1), 100);
  return { page, size, offset: page * size };
}

export async function submitFeedback(req, res) {
  const { resourceId, rating = 0, message = "" } = req.body;
  if (!req.user?.id || !resourceId) {
    return res.status(400).json({ message: "A logged-in user and resource are required." });
  }

  const [result] = await getPool().query(
    "INSERT INTO feedback (rating, created_at, resource_id, user_id, comment) VALUES (?, NOW(), ?, ?, ?)",
    [Number(rating || 0), Number(resourceId), req.user.id, message]
  );

  res.status(201).json({ message: "Feedback submitted successfully.", feedbackId: result.insertId });
}

export async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All contact fields are required." });
  }

  await getPool().query("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)", [name, email, subject, message]);
  res.status(201).json({ message: "Message sent successfully." });
}

export async function getAllFeedback(req, res) {
  const { page, size, offset } = mapPagination(req.query);
  const [rows] = await getPool().query(
    `
      SELECT f.id, f.rating, f.created_at, f.comment, u.username AS user_name, u.email, r.title, r.category
      FROM feedback f
      JOIN users u ON u.id = f.user_id
      JOIN resources r ON r.id = f.resource_id
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `,
    [size, offset]
  );
  const [countRows] = await getPool().query("SELECT COUNT(*) AS total FROM feedback");

  res.json({
    feedback: rows.map((row) => ({
      id: row.id,
      userName: row.user_name,
      email: row.email,
      category: row.category,
      comment: row.comment,
      message: row.comment,
      rating: row.rating,
      status: 'reviewed',
      date: row.created_at,
      resourceTitle: row.title,
    })),
    totalPages: Math.ceil(countRows[0].total / size),
    totalElements: countRows[0].total,
    currentPage: page,
  });
}

export async function getFeedbackById(req, res) {
  const [rows] = await getPool().query("SELECT * FROM feedback WHERE id = ? LIMIT 1", [Number(req.params.feedbackId)]);
  if (!rows[0]) {
    return res.status(404).json({ message: "Feedback not found." });
  }
  res.json(rows[0]);
}

export async function updateFeedbackStatus(req, res) {
  res.json({ message: "Status updates are not supported by the current schema." });
}

export async function respondToFeedback(req, res) {
  res.json({ message: "Admin responses are not supported by the current schema." });
}

export async function deleteFeedback(req, res) {
  await getPool().query("DELETE FROM feedback WHERE id = ?", [Number(req.params.feedbackId)]);
  res.json({ message: "Feedback deleted successfully." });
}

export async function getFeedbackStats(req, res) {
  const [totalRows] = await getPool().query("SELECT COUNT(*) AS total, AVG(rating) AS averageRating FROM feedback");
  const [categoryRows] = await getPool().query(
    "SELECT r.category, COUNT(*) AS total FROM feedback f JOIN resources r ON r.id = f.resource_id GROUP BY r.category ORDER BY r.category ASC"
  );
  res.json({
    total: Number(totalRows[0].total || 0),
    averageRating: Number(totalRows[0].averageRating || 0),
    byCategory: categoryRows.map((row) => ({ category: row.category, total: Number(row.total) })),
    byStatus: [{ status: 'reviewed', total: Number(totalRows[0].total || 0) }],
  });
}
