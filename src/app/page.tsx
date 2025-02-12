"use client"
import UserLogin from "@/components/UserLogin";
import PassLogin from "@/components/PassLogin";

export default function Login() {
  return (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="absolute w-[480px] h-[480px] bg-blue-500 opacity-30 rounded-full -top-44 -left-44"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-30 rounded-full -bottom-48 -right-48"></div>

      <div className="w-96 bg-white shadow-lg p-5 z-10">
        <h1 className="text-4xl font-bold mb-2">Masuk</h1>
        <span className="text-base">Silahkan masukkan akun anda!</span>
        <div className="flex flex-col justify-between gap-5 mt-10">
          <UserLogin/>
          <PassLogin/>
        </div>
        <button className="w-full h-11 bg-cyan-500 text-white border border-cyan-400 border-b-4 font-[600] text-[17px] overflow-hidden relative px-4 py-2 rounded-md hover:brightness-100 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group active:scale-95 mt-14">
          <span className="w-full h-full bg-cyan-400 shadow-cyan-400 absolute -top-[150%] left-0 inline-flex rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>Login
        </button>
      </div>
      <div className="absolute text-center text-xs font-light bottom-0 "><span>© Copyright Muhammad Azka 2025. All rights reserved.</span></div>
    </div>
  );
}