"use client";
import React from "react";
import { HandCoins, ChartBar, Users, ClockCounterClockwise, Package, X,} from "@phosphor-icons/react";
import Image from "next/image";
import MenSid from "./menusidebar";

export default function Sidebar(props: { className?: string }) {
  return (
      <div className={`hidden h-screen w-60 lg:flex flex-col justify-between fixed top-0 left-0 shadow-2xl bg-gray-50 p-4 z-50 ${props.className}`}>
        <X size={26} className="absolute right-4 top-4 lg:hidden" />
        <div>
          <div className="w-full flex justify-center items-center py-2">
            <Image src="/logo.png" width={0} height={0} className="w-28 h-14" alt="icon" unoptimized priority />
          </div>
          <div className="w-full h-[0.5px] bg-gray-500 bg-opacity-50 my-2 mt-4"></div>
          <div className="py-4">
            <ul>
              <MenSid icon={<ChartBar size={24} />} title="Dashboard" />
              <MenSid icon={<HandCoins size={24} />} title="Transaksi" />
              <MenSid icon={<Package size={24} />} title="Data Produk" />
              <MenSid icon={<ClockCounterClockwise size={24} />} title="Riwayat" />
              <MenSid icon={<Users size={24} />} title="Kelola Pengguna" />
            </ul>
          </div>
        </div>
      </div>
  );
}
