"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HandCoins, ChartBar, Users, ClockCounterClockwise, Package, X } from "@phosphor-icons/react";
import Image from "next/image";
import Loading from "./loading";

const menuItems = [
  { title: "Dashboard", icon: <ChartBar size={24} />, path: "/dashboard" },
  { title: "Transaksi", icon: <HandCoins size={24} />, path: "/transaksi" },
  { title: "Data Produk", icon: <Package size={24} />, path: "/dataproduk" },
  { title: "Riwayat", icon: <ClockCounterClockwise size={24} />, path: "/riwayat" },
  { title: "Laporan", icon: <ClockCounterClockwise size={24} />, path: "/laporan" },
  { title: "Kelola Pengguna", icon: <Users size={24} />, path: "/akun" }
];

export default function Sidebar(props: { className?: string }) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);

  // Set current path untuk menandai menu aktif
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
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

  return <>
    <div className={`hidden h-screen w-60 lg:flex flex-col justify-between fixed top-0 left-0 shadow-2xl bg-gray-50 p-4 z-50 ${props.className}`}>
      <X size={26} className="absolute right-4 top-4 lg:hidden cursor-pointer" />
      
      <div>
        <div className="w-full flex justify-center items-center py-2">
          <Image src="/logo.png" width={0} height={0} className="w-28 h-14" alt="icon" unoptimized priority />
        </div>
        <div className="w-full h-[0.5px] bg-gray-500 bg-opacity-50 my-2 mt-4"></div>
        
        <div className="py-4">
          <ul>
            {menuItems.map((item) => (
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
    </div>
      {/* Loading Indicator */}
      {loading && (
        <Loading />
      )}

  </>
}
