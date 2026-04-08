export function notFoundHandler(req, res) {
  res.status(404).json({ message: "Endpoint not found." });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error.",
  });
}
