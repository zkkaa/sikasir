import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// **Tabel Users (Admin & Petugas)**
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  hakAkses: text("hak_akses").$type<"Admin" | "Petugas">().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// **Tabel Pelanggan**
export const pelanggan = pgTable("pelanggan", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  alamat: text("alamat"),
  noHp: text("no_hp"),
  createdAt: timestamp("created_at").defaultNow(),
});

// **Tabel Produk**
export const produk = pgTable("produk", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  kategori: text("kategori").$type<"Makanan" | "Minuman">().notNull(),
  stok: integer("stok").notNull(),
  harga: integer("harga").notNull(), 
  gambar: text("gambar"),
  createdAt: timestamp("created_at").defaultNow(),
});

// **Tabel Transaksi**
export const transaksi = pgTable("transaksi", {
  id: serial("id").primaryKey(),
  pelangganId: integer("pelanggan_id").references(() => pelanggan.id),
  kasirId: integer("kasir_id").references(() => users.id).notNull(),
  totalHarga: integer("total_harga").notNull(), // Sama seperti harga di produk, lebih baik integer
  uangDibayar: integer("uang_dibayar").notNull(), // Tambahkan kolom ini agar bisa menghitung kembalian
  kembalian: integer("kembalian").notNull(), // Simpan kembalian langsung
  waktuTransaksi: timestamp("waktu_transaksi").defaultNow(),
});

// **Tabel Detail Transaksi (Relasi Produk & Transaksi)**
export const detailTransaksi = pgTable("detail_transaksi", {
  id: serial("id").primaryKey(),
  transaksiId: integer("transaksi_id").references(() => transaksi.id).notNull(),
  produkId: integer("produk_id").references(() => produk.id).notNull(),
  qty: integer("qty").notNull(),
  subtotal: integer("subtotal").notNull(), 
});
