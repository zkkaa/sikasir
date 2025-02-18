import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = "seuperadmin+"; // Ganti dengan secret key yang lebih aman

// Fungsi untuk membuat token
export function generateToken(user: { id: number; role: string }) {
  return jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
}

// Fungsi untuk memverifikasi token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}
