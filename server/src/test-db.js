import pool from "./db/pool.js";

const result = await pool.query("SELECT NOW()");

console.log(result.rows);

await pool.end();