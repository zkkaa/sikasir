import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

interface UpdateData {
  nama: string;
  username: string;
  hakAkses: "Admin" | "Petugas";
  password: string;
}

// **GET: Ambil User Berdasarkan ID (Tanpa Password)**
export async function GET(req: NextRequest) {
  try {
    // Ambil ID langsung dari URL
    const id = Number(req.nextUrl.pathname.split("/").pop());
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid!" },
        { status: 400 }
      );
    }

    const user = await db.select().from(users).where(eq(users.id, id)).execute();

    if (user.length === 0) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
  }
}

// **PUT: Update User (Hash Ulang Jika Password Diubah)**
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

    const { nama, username, password, hakAkses } = await req.json();
    const updateData: UpdateData = { nama, username, hakAkses, password };

    // Hash password hanya jika diubah
    if (password) {
      updateData.password = await argon2.hash(password);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    return NextResponse.json({ success: true, message: "User berhasil diperbarui!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
  }
}

// **DELETE: Hapus User**
export async function DELETE(req: NextRequest) {
  try {
    // Ambil ID langsung dari URL
    const id = Number(req.nextUrl.pathname.split("/").pop());
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid!" },
        { status: 400 }
      );
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true, message: "User berhasil dihapus!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
  }
}