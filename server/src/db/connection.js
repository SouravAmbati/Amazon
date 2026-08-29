import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "jobs",
  password: "Jamshedpu1",
  port: 5432,
});

export default pool;