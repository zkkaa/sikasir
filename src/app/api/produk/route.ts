import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { db } from "../../../db";
import { produk } from "../../../db/schema";
import { authMiddleware } from "../../../middleware/authMiddleware";

// **GET: Ambil Semua Produk**
export async function GET(req: NextRequest) {
  const user = authMiddleware(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(produk).execute();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}

// **POST: Tambah Produk Baru dengan Gambar**
export async function POST(req: NextRequest) {
  const user = authMiddleware(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const nama = formData.get("nama") as string;
    const kategori = formData.get("kategori") as string;
    const harga = parseInt(formData.get("harga") as string, 10);
    const stok = parseInt(formData.get("stok") as string, 10);
    const file = formData.get("gambar") as File;

    if (!nama || !kategori || isNaN(harga) || isNaN(stok)) {
      return NextResponse.json({ success: false, message: "Semua data harus diisi dengan benar!" }, { status: 400 });
    }

    if (!["Makanan", "Minuman"].includes(kategori)) {
      return NextResponse.json({ success: false, message: "Kategori harus 'Makanan' atau 'Minuman'!" }, { status: 400 });
    }

    // **Simpan Gambar ke Server**
    let gambarURL = "";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`; // Hilangkan spasi di nama file
      const filePath = join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      gambarURL = `/uploads/${fileName}`;
    }

    // **Simpan Data ke Database**
    await db.insert(produk).values({ nama, kategori: kategori as "Makanan" | "Minuman", harga, stok, gambar: gambarURL });

    return NextResponse.json({ success: true, message: "Produk berhasil ditambahkan!", data: { nama, kategori, harga, stok, gambar: gambarURL } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}
