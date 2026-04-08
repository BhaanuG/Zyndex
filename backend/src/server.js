import app from "./app.js";
import { initDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await initDatabase();

  app.listen(env.port, () => {
    console.log(`Zyndex backend listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
