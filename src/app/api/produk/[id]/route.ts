import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { produk } from "../../../../db/schema";
import { eq } from "drizzle-orm";

// **PUT: Update Produk Berdasarkan ID**
export async function PUT(req: NextRequest) {
  try {
    // Ambil ID langsung dari URL
    const id = Number(req.nextUrl.pathname.split("/").pop());
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid!" },
        { status: 400 }
      );
    }

    const body = await req.json();
    await db.update(produk).set(body).where(eq(produk.id, id));

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
  }
}