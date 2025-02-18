CREATE TABLE "detail_transaksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaksi_id" integer,
	"produk_id" integer,
	"qty" integer NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pelanggan" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"alamat" text NOT NULL,
	"no_hp" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "produk" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"kategori" text NOT NULL,
	"stok" integer NOT NULL,
	"harga" numeric(10, 2) NOT NULL,
	"gambar" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transaksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"pelanggan_id" integer,
	"kasir_id" integer,
	"total_harga" numeric(10, 2) NOT NULL,
	"waktu_transaksi" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"hak_akses" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_transaksi_id_transaksi_id_fk" FOREIGN KEY ("transaksi_id") REFERENCES "public"."transaksi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_produk_id_produk_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_pelanggan_id_pelanggan_id_fk" FOREIGN KEY ("pelanggan_id") REFERENCES "public"."pelanggan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_kasir_id_users_id_fk" FOREIGN KEY ("kasir_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;