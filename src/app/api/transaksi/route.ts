"use server";

import { db } from "../../../db";
import { NextRequest, NextResponse } from "next/server";
import { transaksi, detailTransaksi, produk } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { pelanggan } from "../../../db/schema";

type ItemType = {
  produk_id: number;
  quantity: number;
  sub_total: number;
};

// **POST: Membuat Transaksi Baru**
export async function POST(req: NextRequest) {
  try {
    // HAPUS SEMENTARA AUTH
    const user = { id: 1 }; // Hardcode ID kasir sebagai 1

    // ** Ambil Data dari Body Request**
    const { pelanggan_id, items, total_harga, uang_dibayar, waktu_transaksi } = await req.json();

    // ** Validasi Input**
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Daftar item tidak boleh kosong" }, { status: 400 });
    }

    if (!total_harga || total_harga <= 0) {
      return NextResponse.json({ success: false, message: "Total harga harus lebih dari 0" }, { status: 400 });
    }

    if (!uang_dibayar || uang_dibayar < total_harga) {
      return NextResponse.json({ success: false, message: "Uang dibayar tidak cukup" }, { status: 400 });
    }

    // ** Cek apakah pelanggan_id ada di database**
    const pelangganExist = await db
      .select()
      .from(pelanggan)
      .where(eq(pelanggan.id, pelanggan_id));

    if (pelangganExist.length === 0) {
      return NextResponse.json({ success: false, message: "Pelanggan tidak ditemukan" }, { status: 400 });
    }

    // ** Konversi waktu_transaksi ke Date**
    const waktuTransaksiDate = new Date(waktu_transaksi);
    if (isNaN(waktuTransaksiDate.getTime())) {
      return NextResponse.json({ success: false, message: "Format waktu_transaksi tidak valid!" }, { status: 400 });
    }

    // ** Hitung Kembalian**
    const kembalian = uang_dibayar - total_harga;

    // ** Simpan Data Transaksi ke Database**
    const [newTransaksi] = await db
      .insert(transaksi)
      .values({
        kasirId: user.id,
        pelangganId: pelanggan_id,
        totalHarga: total_harga,
        uangDibayar: uang_dibayar,
        kembalian: kembalian,
        waktuTransaksi: waktuTransaksiDate, // ✅ Simpan sebagai Date, bukan string
      })
      .returning();

    // ** Simpan Detail Transaksi**
    await db.insert(detailTransaksi).values(
      items.map((item: ItemType) => ({
        transaksiId: newTransaksi.id,
        produkId: item.produk_id,
        qty: item.quantity,
        subtotal: item.sub_total,
      }))
    );

    // ** Berikan Respon Sukses**
    return NextResponse.json({ success: true, message: "Transaksi berhasil dibuat", transaksi: newTransaksi }, { status: 201 });

  } catch (error) {
    // ** Menangani Error**
    console.error(error);
    return NextResponse.json({ success: false, message: (error as Error).message || "Internal server error" }, { status: 500 });
  }
}


// ** GET: Mengambil Semua Transaksi**
export async function GET() {
  try {
    const transactions = await db
      .select({
        id: transaksi.id,
        pelanggan: pelanggan.nama,
        totalHarga: transaksi.totalHarga,
        waktuTransaksi: transaksi.waktuTransaksi,
      })
      .from(transaksi)
      .leftJoin(pelanggan, eq(transaksi.pelangganId, pelanggan.id))
      .orderBy(transaksi.waktuTransaksi);

    const transactionDetails = await db
      .select({
        transaksiId: detailTransaksi.transaksiId,
        produk: produk.nama,
        qty: detailTransaksi.qty,
        subtotal: detailTransaksi.subtotal,
      })
      .from(detailTransaksi)
      .leftJoin(produk, eq(detailTransaksi.produkId, produk.id));

    // 🛒 Gabungkan Data Transaksi & Detailnya
    const result = transactions.map((transaksi) => ({
      ...transaksi,
      items: transactionDetails.filter((detail) => detail.transaksiId === transaksi.id),
    }));

    return NextResponse.json({
      success: true,
      message: "Data transaksi berhasil diambil",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
