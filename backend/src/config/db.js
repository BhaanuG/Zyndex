import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";
import { env } from "./env.js";
import bcrypt from "bcryptjs";

let pool;

export async function initDatabase() {
  const bootstrapConnection = await mysql.createConnection({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    multipleStatements: true,
  });

  await bootstrapConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await bootstrapConnection.end();

  pool = mysql.createPool({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  });

  const schemaPath = path.resolve(process.cwd(), "sql", "schema.sql");
  const schemaSql = await fs.readFile(schemaPath, "utf8");
  await pool.query(schemaSql);
  await ensureResourceUpdateTracking();
  await ensureUserRelationshipSafety();

  await ensureMainAdmin();
}

export function getPool() {
  if (!pool) {
    throw new Error("Database has not been initialized.");
  }

  return pool;
}

async function ensureMainAdmin() {
  const passwordHash = await bcrypt.hash(env.mainAdminPassword, 10);
  const [rows] = await pool.query("SELECT id, role FROM users WHERE email = ? LIMIT 1", [env.mainAdminEmail]);

  if (rows[0]) {
    if (rows[0].role !== "ADMIN") {
      await pool.query("UPDATE users SET role = ? WHERE id = ?", ["ADMIN", rows[0].id]);
    }
    return;
  }

  await pool.query(
    "INSERT INTO users (created_at, email, password, username, role) VALUES (NOW(), ?, ?, ?, ?)",
    [env.mainAdminEmail, passwordHash, env.mainAdminName, "ADMIN"]
  );
}

async function ensureResourceUpdateTracking() {
  try {
    await pool.query(
      `
        ALTER TABLE resources
        ADD COLUMN updated_at DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
      `
    );
  } catch (error) {
    if (error?.code !== "ER_DUP_FIELDNAME") {
      throw error;
    }
  }

  await pool.query("UPDATE resources SET updated_at = created_at WHERE updated_at IS NULL");
}

async function ensureUserRelationshipSafety() {
  await recreateForeignKey("downloads", "FKjb9vjhmpns24p7vuyjcc0wa5l", "FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE");
  await recreateForeignKey("saved_resources", "FKct0g1bg9wshe1t3tb1js25tmw", "FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE");
  await recreateForeignKey("feedback", "FKpwwmhguqianghvi1wohmtsm8l", "FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE");
  await recreateForeignKey("resource_views", "FKsnvy095s1417ak8mwubssmwbc", "FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE");

  try {
    await pool.query("DROP TRIGGER IF EXISTS before_user_delete_reassign_resources");
    await pool.query(`
      CREATE TRIGGER before_user_delete_reassign_resources
      BEFORE DELETE ON users
      FOR EACH ROW
      BEGIN
        DECLARE main_admin_id BIGINT DEFAULT NULL;
        SELECT id INTO main_admin_id
        FROM users
        WHERE LOWER(email) = LOWER('${env.mainAdminEmail.replace(/'/g, "''")}')
        LIMIT 1;

        IF main_admin_id IS NOT NULL AND OLD.id <> main_admin_id THEN
          UPDATE resources
          SET uploaded_by = main_admin_id
          WHERE uploaded_by = OLD.id;
        END IF;
      END
    `);
  } catch (error) {
    throw error;
  }
}

async function recreateForeignKey(tableName, constraintName, definition) {
  try {
    await pool.query(`ALTER TABLE ${tableName} DROP FOREIGN KEY ${constraintName}`);
  } catch (error) {
    if (error?.code !== "ER_CANT_DROP_FIELD_OR_KEY" && error?.code !== "ER_DROP_INDEX_FK") {
      throw error;
    }
  }

  try {
    await pool.query(`ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${definition}`);
  } catch (error) {
    if (error?.code !== "ER_DUP_KEYNAME") {
      throw error;
    }
  }
}
