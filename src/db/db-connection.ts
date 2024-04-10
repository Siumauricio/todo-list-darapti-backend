import pg from "pg";
import dotenv from "dotenv";

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: [".env", ".env.example"],
  });

  console.log(process.env.NODE_ENV)
}

const { Pool } = pg;

const config = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
} : {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // default Postgres port
  database: process.env.DB_NAME,
}


const pool = new Pool(config);



export default pool;
