import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "replace-this-with-a-long-random-secret",
  mainAdminEmail: process.env.MAIN_ADMIN_EMAIL || "admin@example.com",
  mainAdminPassword: process.env.MAIN_ADMIN_PASSWORD || "change-me",
  mainAdminName: process.env.MAIN_ADMIN_NAME || "Main Admin",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "zyndex_db",
  otpSmtpHost: process.env.OTP_SMTP_HOST || "",
  otpSmtpPort: Number(process.env.OTP_SMTP_PORT || 587),
  otpSmtpSecure: process.env.OTP_SMTP_SECURE === "true",
  otpSmtpUser: process.env.OTP_SMTP_USER || "",
  otpSmtpPass: process.env.OTP_SMTP_PASS || "",
  otpMailFrom: process.env.OTP_MAIL_FROM || process.env.OTP_SMTP_USER || "",
  exposeOtpInDevelopment: process.env.OTP_EXPOSE_IN_DEVELOPMENT === "true",
};
