import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"; // Akan kita buat di langkah berikutnya

// Ambil konfigurasi database dari .env
import dotenv from "dotenv";
dotenv.config();

// Buat koneksi ke database PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Sesuaikan dengan .env
});

export const db = drizzle(pool, { schema });
