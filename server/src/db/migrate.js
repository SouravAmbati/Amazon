import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import pool from "./pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(__dirname, "../../migrations");

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = await fs.readdir(migrationsPath);

    const migrationFiles = files
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const result = await client.query(`
      SELECT id
      FROM schema_migrations
      ORDER BY id
    `);

    const appliedMigrations = new Set(
      result.rows.map((row) => row.id)
    );

    for (const file of migrationFiles) {
      const migrationId = file.replace(".sql", "");

      if (appliedMigrations.has(migrationId)) {
        console.log(`Already applied: ${migrationId}`);
        continue;
      }

      console.log(`Applying: ${migrationId}`);

      const sql = await fs.readFile(
        path.join(migrationsPath, file),
        "utf8"
      );

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO schema_migrations (id)
          VALUES ($1)
          `,
          [migrationId]
        );

        await client.query("COMMIT");

        console.log(`Applied: ${migrationId}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Migrations complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error("Migration failed:");
  console.error(error);

  process.exit(1);
});