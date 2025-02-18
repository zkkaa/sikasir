import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { produk } from "../../../../db/schema";
import { eq } from "drizzle-orm";

// **PUT: Update Produk Berdasarkan ID**
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await db.update(produk).set(body).where(eq(produk.id, Number(params.id)));

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}

// **DELETE: Hapus Produk Berdasarkan ID**
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(produk).where(eq(produk.id, Number(params.id)));

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}
