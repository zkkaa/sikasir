"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HandCoins, ChartBar, Users, ClockCounterClockwise, Package, X, SignOut, IdentificationCard } from "@phosphor-icons/react";
import Image from "next/image";
import Loading from "./loading";
import axios from "axios";

const menuItems = [
  { title: "Dashboard", icon: <ChartBar size={24} />, path: "/dashboard", roles: ["Admin", "Petugas"] },
  { title: "Transaksi", icon: <HandCoins size={24} />, path: "/transaksi", roles: ["Admin", "Petugas"] },
  { title: "Data Produk", icon: <Package size={24} />, path: "/dataproduk", roles: ["Admin", "Petugas"] },
  { title: "Riwayat", icon: <ClockCounterClockwise size={24} />, path: "/riwayat", roles: ["Admin", "Petugas"] },
  { title: "Data Pelanggan", icon: <IdentificationCard size={24} />, path: "/datapelanggan", roles: ["Admin", "Petugas"] },
  { title: "Kelola Pengguna", icon: <Users size={24} />, path: "/akun", roles: ["Admin"] }
];

export default function Sidebar(props: { className?: string }) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Set current path untuk menandai menu aktif
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      const role = window.localStorage.getItem('session_user_hakAkses');
      setUserRole(role);
    }
  }, []);

  // Fungsi Navigasi dengan prefetch dan loading
  const handleNavigation = (path: string) => {
    if (path !== currentPath) {
      setLoading(true);  // Aktifkan loading
      router.prefetch(path);  // Prefetch halaman sebelum pindah
      router.push(path); // Pindah halaman
    }
  };

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await axios.get("/api/signout");
      window.localStorage.removeItem('session_user_name');
      window.localStorage.removeItem('session_user_hakAkses');
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className={`hidden h-screen w-60 lg:flex flex-col justify-between fixed top-0 left-0 shadow-2xl bg-gray-50 p-4 z-50 ${props.className}`}>
        <X size={26} className="absolute right-4 top-4 lg:hidden cursor-pointer" />
        
        <div>
          <div className="w-full flex justify-center items-center py-2">
            <Image src="/logo.png" width={0} height={0} className="w-28 h-14" alt="icon" unoptimized priority />
          </div>
          <div className="w-full h-[0.5px] bg-gray-500 bg-opacity-50 my-2 mt-4"></div>
          
          <div className="py-4">
            <ul>
              {menuItems.filter(item => item.roles.includes(userRole || "")).map((item) => (
                <li
                  key={item.title}
                  className={`flex justify-start items-center gap-4 p-3 cursor-pointer rounded-md hover:bg-blue-100 transition-all ${
                    currentPath === item.path ? "bg-blue-200 font-bold" : ""
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-4">
          <ul>
            <li
              className="flex justify-start items-center gap-4 p-3 cursor-pointer rounded-md hover:bg-blue-200 transition-all"
              onClick={handleLogout}
            >
              <SignOut size={24} />
              <span>Keluar</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Loading Indicator */}
      {loading && (
        <Loading />
      )}
    </>
  );
}
