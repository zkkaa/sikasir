ALTER TABLE "detail_transaksi" ALTER COLUMN "transaksi_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "detail_transaksi" ALTER COLUMN "produk_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "detail_transaksi" ALTER COLUMN "subtotal" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "pelanggan" ALTER COLUMN "alamat" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pelanggan" ALTER COLUMN "no_hp" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "produk" ALTER COLUMN "harga" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "transaksi" ALTER COLUMN "kasir_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transaksi" ALTER COLUMN "total_harga" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "uang_dibayar" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "kembalian" integer NOT NULL;