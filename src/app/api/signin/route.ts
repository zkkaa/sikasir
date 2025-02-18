import { User } from "../../../db/query"; 
import { NextRequest, NextResponse } from "next/server";
import { Token } from "../../../lib/jwt"

interface RequestBody {
    username: string;
    password: string;
}

export async function POST(req: NextRequest) {
    const body: RequestBody = await req.json();

    try {
        const user = await User.get.byUsername(body.username);  // Mengambil data pengguna berdasarkan username

        if (user === undefined) {
            return NextResponse.json({
                message: "Gagal mengambil data pengguna"
            }, {
                status: 500
            });
        }

        if (user?.length === 0) {
            return NextResponse.json({
                message: "Pengguna tidak ditemukan"
            }, {
                status: 404
            });
        }

        const { password, ...dataUser } = user[0];  // Menghapus password dari data pengguna
        console.log(password)
        const token = Token.generate(dataUser);  // Menghasilkan token JWT

        return NextResponse.json({
            message: "Login berhasil",
            data: {
                name: dataUser.nama,  // Menyesuaikan dengan kolom `username` pada tabel User
                hakAkses: dataUser.hakAkses,  // Menyesuaikan dengan kolom `hak_akses` pada tabel User
            }
        }, {
            status: 200,
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Priority=High`  // Menyimpan token di cookie
            }
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "An error occurred, see console for more details",
            error: error
        }, {
            status: 500
        });
    }
}
