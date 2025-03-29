"use client";
import Form from "next/form";
import UserLogin from "@/components/UserLogin";
import PassLogin from "@/components/PassLogin";
import Load from "../components/Load";
import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LockKeyOpen, WarningCircle } from "@phosphor-icons/react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showLoginSucces, setShowLoginSucces] = useState(false);
  const [showError, setShowError] = useState(false);

  const authUser = useCallback(async (formData: FormData) => {
    return await axios.post("/api/signin", {
      username: formData.get('username'),
      password: formData.get('password')
    }).then((response) => {
      if(response.status === 200){
        const localStorage = window.localStorage;

        localStorage.setItem('session_user_name', response.data.data.username);
        localStorage.setItem('session_user_hakAkses', response.data.data.hakAkses);

        setShowLoginSucces(true);
      }
    }).catch((error: AxiosError) => {
      const { message } = error.response?.data as { message: string };
      alert(message);
      setShowError(true);
    }).finally(() => setIsLoading(false));
  }, []);

  const signInHandler = (formData: FormData) => {
    setIsLoading(true);
    authUser(formData);
  };

  const handleSuccessOk = () => {
    setShowLoginSucces(false);
    const hakAkses = window.localStorage.getItem('session_user_hakAkses');
    router.push(hakAkses === "Admin" ? "/dashboard" : "/dashboard");
  };

  const handleErrorOk = () => {
    setShowError(false);
    window.location.reload();
  };

  return isLoading ? (
    <Load />
  ) : (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="absolute w-[480px] h-[480px] bg-blue-500 opacity-30 rounded-full -top-44 -left-44"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-30 rounded-full -bottom-48 -right-48"></div>

      <div className="w-96 bg-white shadow-lg p-5 z-10">
        <h1 className="text-4xl font-bold mb-2">Masuk</h1>
        <span className="text-base">Silahkan masukkan akun anda!</span>

        <Form action={signInHandler} formMethod="POST">
          <div className="flex flex-col justify-between gap-5 mt-10">
            <UserLogin />
            <PassLogin />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-cyan-500 text-white border border-cyan-400 border-b-4 font-[600] text-[17px] overflow-hidden relative px-4 py-2 rounded-md hover:brightness-100 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group active:scale-95 mt-14"
          >
            <span className="w-full h-full bg-cyan-400 shadow-cyan-400 absolute -top-[150%] left-0 inline-flex rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Login
          </button>
        </Form>
      </div>

      {showLoginSucces && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-8 relative overflow-hidden rounded-xl">
            <div className="w-24 h-24 bg-blue-500 rounded-full absolute -right-5 -top-7 flex items-center justify-center pt-3 pr-3">
              <LockKeyOpen size={48} color="white"/>
            </div>
            <h1 className="font-bold text-2xl text-blue-500 mt-3">Berhasil</h1>
            <p className="text-zinc-600 leading-6 mt-3">Anda Berhasil Masuk</p>
            <button className="mx-auto mt-8 px-6 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={handleSuccessOk}>
              Oke
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-8 relative overflow-hidden rounded-xl">
            <div className="w-24 h-24 bg-red-500 rounded-full absolute -right-5 -top-7 flex items-center justify-center pt-3 pr-3">
              <WarningCircle size={48} color="white"/>
            </div>
            <h1 className="font-bold text-2xl text-red-500 mt-3">Gagal!</h1>
            <p className="text-zinc-600 leading-6 mt-3">Login gagal</p>
            <button className="mx-auto mt-8 px-6 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={handleErrorOk}>
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
