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
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await db.select().from(users).where(eq(users.id, Number(params.id))).execute();

    if (user.length === 0) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}

// **PUT: Update User (Hash Ulang Jika Password Diubah)**
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nama, username, password, hakAkses } = await req.json();
    const updateData: UpdateData = { nama, username, hakAkses, password };

    // Hash password hanya jika diubah
    if (password) {
      updateData.password = await argon2.hash(password);
    }

    console.log(updateData.password);

    await db.update(users).set(updateData).where(eq(users.id, Number(params.id)));

    return NextResponse.json({ success: true, message: "User berhasil diperbarui!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}

// **DELETE: Hapus User**
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(users).where(eq(users.id, Number(params.id)));

    return NextResponse.json({ success: true, message: "User berhasil dihapus!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}
