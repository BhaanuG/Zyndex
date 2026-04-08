# Zyndex

Zyndex is a Vite frontend with a Spring Boot backend that serves the `/api` endpoints used by the app.

## Local Development

```powershell
npm install
npm run dev
```

In another terminal:

```powershell
cd spring-backend
.\mvnw.cmd spring-boot:run
```

Copy `.env.example` to `.env` for local frontend settings. Configure backend secrets and database credentials through environment variables or a local `.env` file.

## Deployment

Frontend hosting:

- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_API_BASE_URL` to the deployed backend URL, ending in `/api`

Backend hosting:

- Root directory: `spring-backend`
- Build command: `./mvnw package -DskipTests`
- Start command: `java -jar target/zyndex-spring-backend-0.0.1-SNAPSHOT.jar`
- Required environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `FRONTEND_URL`, `MAIN_ADMIN_EMAIL`, `MAIN_ADMIN_PASSWORD`, `MAIN_ADMIN_NAME`
