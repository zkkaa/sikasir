import { NextRequest, NextResponse } from "next/server";
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