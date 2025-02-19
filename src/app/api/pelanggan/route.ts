import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db";
import { pelanggan } from "../../../db/schema";
import { authMiddleware } from "../../../middleware/authMiddleware";

// **GET: Ambil Semua Pelanggan**
export async function GET(req: NextRequest) {
  const user = authMiddleware(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(pelanggan).execute();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}

// **POST: Tambah Pelanggan Baru**
export async function POST(req: NextRequest) {
  const user = authMiddleware(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { nama, alamat, noHp } = body;

    if (!nama) {
      return NextResponse.json({ success: false, message: "Nama pelanggan harus diisi!" }, { status: 400 });
    }

    await db.insert(pelanggan).values({ nama, alamat, noHp });

    return NextResponse.json({ success: true, message: "Pelanggan berhasil ditambahkan!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}
