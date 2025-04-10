"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transaksi, detailTransaksi, produk, pelanggan } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

type ItemType = {
  produkId: number;
  qty: number;
  subtotal: number;
};

export async function POST(req: NextRequest) {
  try {
    const { pelangganId, kasirId, totalHarga, uangDibayar, kembalian, items } = await req.json();

    if (!pelangganId || !kasirId || !totalHarga || !uangDibayar || kembalian === undefined || !items || items.length === 0) {
      return NextResponse.json({ error: "Semua data harus diisi!" }, { status: 400 });
    }

    if (uangDibayar < totalHarga) {
      return NextResponse.json({ error: "Nominal bayar kurang!" }, { status: 400 });
    }

    // Validate produk_id in items
    for (const item of items) {
      const product = await db.select().from(produk).where(eq(produk.id, item.produkId)).execute();
      if (product.length === 0) {
        return NextResponse.json({ error: `Produk dengan ID ${item.produkId} tidak ditemukan` }, { status: 404 });
      }
    }

    // Insert transaksi baru
    const [newTransaction] = await db.insert(transaksi).values({
      pelangganId,
      kasirId,
      totalHarga,
      uangDibayar,
      kembalian,
    }).returning();

    // Insert detail transaksi
    await db.insert(detailTransaksi).values(
      items.map((item: ItemType) => ({
        transaksiId: newTransaction.id,
        produkId: item.produkId,
        qty: item.qty,
        subtotal: item.subtotal,
      }))
    );

    // Update stok produk
    for (const item of items) {
      const currentStock = await db.select({ stok: produk.stok }).from(produk).where(eq(produk.id, item.produkId)).execute();
      await db.update(produk)
        .set({ stok: currentStock[0].stok - item.qty })
        .where(eq(produk.id, item.produkId));
    }

    return NextResponse.json({ message: "Transaksi berhasil ditambahkan!" }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/transaksi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server", details: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Ambil semua transaksi
    const transaksiData = await db
      .select({
        id: transaksi.id,
        pelangganNama: pelanggan.nama,
        kasirId: transaksi.kasirId,
        totalHarga: transaksi.totalHarga,
        uangDibayar: transaksi.uangDibayar,
        kembalian: transaksi.kembalian,
        waktuTransaksi: transaksi.waktuTransaksi,
      })
      .from(transaksi)
      .leftJoin(pelanggan, eq(transaksi.pelangganId, pelanggan.id))
      .orderBy(desc(transaksi.id))
      .execute();

    // Ambil detail transaksi
    const detailData = await db
      .select({
        transaksiId: detailTransaksi.transaksiId,
        produkId: detailTransaksi.produkId,
        qty: detailTransaksi.qty,
        subtotal: detailTransaksi.subtotal,
        namaProduk: produk.nama,
        kategori: produk.kategori,
        gambar: produk.gambar,
        hargaProduk: produk.harga,
      })
      .from(detailTransaksi)
      .innerJoin(produk, eq(detailTransaksi.produkId, produk.id))
      .execute();

    // Gabungkan transaksi dengan detail transaksi
    const result = transaksiData.map((trx) => ({
      ...trx,
      items: detailData.filter((detail) => detail.transaksiId === trx.id),
    }));

    // Hitung produk terlaris
    const productSales = detailData.reduce((acc: Record<number, { nama: string; kategori: string; gambar: string; harga: number; totalQty: number }>, detail) => {
      if (!acc[detail.produkId]) {
        acc[detail.produkId] = {
          nama: detail.namaProduk,
          kategori: detail.kategori,
          gambar: detail.gambar ?? "",
          harga: detail.hargaProduk,
          totalQty: 0,
        };
      }
      acc[detail.produkId].totalQty += detail.qty;
      return acc;
    }, {});

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 5);

    return NextResponse.json({ message: "success", data: result, topProducts });
  } catch (error) {
    console.error("Error in GET /api/transaksi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server", details: error }, { status: 500 });
  }
}
