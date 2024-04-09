import pg from "pg";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: [".env", ".env.example"],
  });

  console.log(process.env);
}

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // default Postgres port
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
