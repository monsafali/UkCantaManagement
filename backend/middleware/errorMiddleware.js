export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const label = field === "email" ? "Email" : "Username";
    return res.status(409).json({
      success: false,
      message: `${label} is already in use`,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    console.error("API request failed", {
      method: req.method,
      path: req.originalUrl,
      error: err.message,
      stack: err.stack,
    });
  }
  const message = statusCode >= 500
    ? "The server could not complete the request. Check the Render logs for details."
    : err.message || "Request failed";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
