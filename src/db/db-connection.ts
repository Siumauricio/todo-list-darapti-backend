import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5433, // default Postgres port
  database: "db_todo_list_app_darapti",
});

export default pool;
