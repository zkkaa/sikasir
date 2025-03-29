import { NextResponse } from "next/server";

export async function GET(){
    try {
        return NextResponse.json({
            message: "Logout berhasil",
        }, {
            status: 200,
            headers: {
                "Set-Cookie": `token=; HttpOnly; Secure; SameSite=None; Path=/; Priority=High`
            }
        })
    } catch (error) {
        return NextResponse.json({
            message: "an error occured, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}