import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db";
import { users } from "../../../db/schema";
// import { eq } from "drizzle-orm";
import argon2 from "argon2";

// **GET: Ambil Semua User (Tanpa Password)**
export async function GET() {
  try {
    const data = await db.select({
      id: users.id,
      nama: users.nama,
      username: users.username,
      hakAkses: users.hakAkses,
      createdAt: users.createdAt
    }).from(users).execute();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}

// **POST: Tambah User Baru dengan Hashing Password**
export async function POST(req: NextRequest) {
  try {
    const { nama, username, password, hakAkses } = await req.json();

    if (!nama || !username || !password || !hakAkses) {
      return NextResponse.json({ success: false, message: "Semua data harus diisi!" }, { status: 400 });
    }

    // Hash password dengan Argon2
    const hashedPassword = await argon2.hash(password);

    await db.insert(users).values({ nama, username, password: hashedPassword, hakAkses });

    return NextResponse.json({ success: true, message: "User berhasil ditambahkan!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error}, { status: 500 });
  }
}
