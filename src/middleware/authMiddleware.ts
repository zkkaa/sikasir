import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../utils/auth";

export function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1]; // Format: Bearer <token>
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 403 });
  }

  return user;
}
