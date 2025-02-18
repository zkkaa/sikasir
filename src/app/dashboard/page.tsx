"use client";
import Sidebar from "@/components/sidebar";
import Card from "@/components/card";
import { Grafik } from "../../components/grafik";
import TitlePage from "@/components/titlesection";
import HeadPage from "@/components/Headpage";
import { ShoppingCart, House, CurrencyCircleDollar, WarningCircle, ListChecks } from "@phosphor-icons/react";

// Fungsi format uang
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
};

// Dummy data sementara (nantinya ambil dari API/backend)
const dataDashboard = {
  total_pendapatan: 200000,
  jumlah_transaksi: 25,
  jumlah_menu_tersedia: 15,
  jumlah_menu_habis: 3
};


export default function Utama() {
  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<House size={32} color="#ffffff" weight="fill" />} title="Dashboard" deskrip="Selamat datang di Sikasir" />
        <div className="w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-4 lg:gap-6">
          <Card iconc="bg-yellow-200" textc="text-yellow-500" total={formatCurrency(dataDashboard.total_pendapatan)} title="Total Pendapatan Hari Ini" icon={<CurrencyCircleDollar />} /> 
          <Card iconc="bg-blue-200" textc="text-blue-500" total={dataDashboard.jumlah_transaksi.toString()} title="Jumlah Transaksi Hari Ini" icon={<ShoppingCart />} /> 
          <Card iconc="bg-green-200" textc="text-green-500" total={dataDashboard.jumlah_menu_tersedia.toString()} title="Jumlah Menu Yang Tersedia" icon={<ListChecks />} />
          <Card iconc="bg-red-200" textc="text-red-500" total={dataDashboard.jumlah_menu_habis.toString()} title="Jumlah Menu Yang Habis" icon={<WarningCircle />} />
        </div>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <Grafik />
          </div>
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <TitlePage title="Menu Terlaris" />
            <table className="w-full text-left">
              <tbody>
                <tr className="flex items-center justify-between gap-4 p-2 border-b-2 border-gray-100">
                  <td>
                    <div className="bg-gray-200 w-16 h-16 rounded-lg"></div>
                  </td>
                  <td className="flex flex-col justify-center flex-1">
                    <span className="text-sm text-gray-500">Makanan</span>
                    <h1 className="font-semibold">Chicken Paha Atas</h1>
                  </td>
                  <td className="text-right italic">{formatCurrency(100000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-span-3 bg-white p-6 rounded-lg">
            <TitlePage title="Aktivitas Transaksi Terbaru" />
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-200">
                  <th className="p-2 text-left">Nama Pelanggan</th>
                  <th className="p-2 text-left">Produk</th>
                  <th className="p-2 text-right">Kuantitas</th>
                  <th className="p-2 text-right">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-gray-100">
                  <td className="p-2">Azka</td>
                  <td className="p-2">Nasi Lambada</td>
                  <td className="p-2 text-right">1</td>
                  <td className="p-2 text-right">{formatCurrency(100000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
