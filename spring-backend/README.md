# Zyndex Spring Boot Backend

This is the Spring Boot backend for Zyndex. It mirrors the existing `/api` endpoints and uses the same default MySQL settings as the previous backend.

## Run

```powershell
.\mvnw.cmd spring-boot:run
```

From the project root, you can also run:

```powershell
npm run dev:backend
```

## Configuration

Configuration is read from environment variables:

- `PORT` defaults to `8080`
- `FRONTEND_URL` defaults to `http://localhost:5173`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`
- `JWT_SECRET`
- `MAIN_ADMIN_EMAIL`, `MAIN_ADMIN_PASSWORD`, and `MAIN_ADMIN_NAME`
- `OTP_SMTP_HOST`, `OTP_SMTP_PORT`, `OTP_SMTP_USER`, `OTP_SMTP_PASS`, and `OTP_MAIL_FROM`
- `UPLOAD_DIR` defaults to `../backend/uploads` so existing resource files remain available

The Spring Boot app also loads `.env` values from the project root and the existing `backend/.env`, so your current database and OTP SMTP settings can be reused without editing the old backend files.

## Hosted Deployment

- Build command: `./mvnw package -DskipTests`
- Start command: `java -jar target/zyndex-spring-backend-0.0.1-SNAPSHOT.jar`
- Set `FRONTEND_URL` to the deployed frontend URL.
- Set database variables to a hosted MySQL-compatible database.
- Set `UPLOAD_DIR` to a writable runtime path if your hosting provider supports persistent disks.
