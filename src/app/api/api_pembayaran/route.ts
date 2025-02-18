"use server";

import { db } from "../../../db";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware"; // Menggunakan authMiddleware
import { transaksi } from "../../../db/schema";
import { eq } from "drizzle-orm";

// **POST: Memproses Pembayaran dan Menghitung Kembalian**
export async function POST(req: NextRequest) {
  const user = authMiddleware(req); // Menggunakan middleware otentikasi
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { transaksi_id, uang_dibayar } = await req.json();

    // Ambil transaksi berdasarkan ID
    const transaction = await db.select().from(transaksi).where(eq(transaksi.id, transaksi_id)).execute();

    if (transaction.length === 0) {
      return NextResponse.json({ success: false, message: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    const totalHarga = transaction[0].totalHarga;
    const kembalian = uang_dibayar - totalHarga;

    // Update transaksi dengan jumlah uang dibayar dan kembalian
    await db.update(transaksi)
      .set({ uangDibayar: uang_dibayar, kembalian: kembalian })
      .where(eq(transaksi.id, transaksi_id));

    return NextResponse.json({ success: true, message: "Pembayaran berhasil", kembalian }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
