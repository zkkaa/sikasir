"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Card from "@/components/card";
import { Grafik } from "../../components/grafik";
import TitlePage from "@/components/titlesection";
import HeadPage from "@/components/Headpage";
import { ShoppingCart, House, CurrencyCircleDollar, WarningCircle, ListChecks, CaretDoubleLeft, CaretDoubleRight } from "@phosphor-icons/react";
import Image from 'next/image';

// Fungsi format uang
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

const Utama = () => {
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [jumlahMenuTersedia, setJumlahMenuTersedia] = useState(0);
  const [jumlahMenuHabis, setJumlahMenuHabis] = useState(0);
  const [topMenu, setTopMenu] = useState<{ namaProduk: string; harga: number; gambar: string }[]>([]);
  interface Transaction {
    waktuTransaksi: string;
    pelangganNama: string;
    items: { namaProduk: string; qty: number; subtotal: number }[];
    totalHarga: number;
  }

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total pendapatan hari ini
        const transaksiResponse = await fetch("/api/transaksi");
        const transaksiData = await transaksiResponse.json();
        const today = new Date().toDateString();
        const todayTransactions = transaksiData.data.filter((trans: { waktuTransaksi: string; totalHarga: number }) => new Date(trans.waktuTransaksi).toDateString() === today);
        const totalPendapatanHariIni = todayTransactions.reduce((total: number, trans: { waktuTransaksi: string; totalHarga: number }) => total + trans.totalHarga, 0);
        setTotalPendapatan(totalPendapatanHariIni);
        setJumlahTransaksi(todayTransactions.length);

        // Fetch jumlah menu yang tersedia dan habis
        const produkResponse = await fetch("/api/produk");
        const produkData = await produkResponse.json();
        const totalMenuTersedia = produkData.data.length;
        const totalMenuHabis = produkData.data.filter((produk: { stok: number }) => produk.stok === 0).length;
        setJumlahMenuTersedia(totalMenuTersedia);
        setJumlahMenuHabis(totalMenuHabis);

        // Fetch top 5 most purchased menu items
        const menuCount: { [key: string]: { qty: number; harga: number; gambar: string } } = {};
        transaksiData.data.forEach((trans: { items: { namaProduk: string; qty: number; hargaProduk: number; gambar: string }[] }) => {
          trans.items.forEach((item: { namaProduk: string; qty: number; hargaProduk: number; gambar: string }) => {
            if (menuCount[item.namaProduk]) {
              menuCount[item.namaProduk].qty += item.qty;
            } else {
              menuCount[item.namaProduk] = { qty: item.qty, harga: item.hargaProduk, gambar: item.gambar };
            }
          });
        });
        const sortedMenu = Object.entries(menuCount)
          .sort((a, b) => b[1].qty - a[1].qty)
          .slice(0, 5)
          .map(([namaProduk, { harga, gambar }]) => ({ namaProduk, harga, gambar }));
        setTopMenu(sortedMenu);

        // Set recent transactions
        setRecentTransactions(transaksiData.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate the current transactions to display based on pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = recentTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(recentTransactions.length / transactionsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<House size={32} color="#ffffff" weight="fill" />} title="Dashboard" deskrip="Selamat datang di Sikasir" />
        <div className="w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-4 lg:gap-6">
          <Card iconc="bg-yellow-200" textc="text-yellow-500" total={formatCurrency(totalPendapatan)} title="Total Pendapatan Hari Ini" icon={<CurrencyCircleDollar />} /> 
          <Card iconc="bg-blue-200" textc="text-blue-500" total={jumlahTransaksi.toString()} title="Jumlah Transaksi Hari Ini" icon={<ShoppingCart />} /> 
          <Card iconc="bg-green-200" textc="text-green-500" total={jumlahMenuTersedia.toString()} title="Jumlah Menu Yang Tersedia" icon={<ListChecks />} />
          <Card iconc="bg-red-200" textc="text-red-500" total={jumlahMenuHabis.toString()} title="Jumlah Menu Yang Habis" icon={<WarningCircle />} />
        </div>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <Grafik />
          </div>
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <TitlePage title="Menu Terlaris" />
            <table className="w-full text-left">
              <tbody>
                {topMenu.map((menu, index) => (
                  <tr key={index} className="flex items-center justify-between gap-4 p-2 border-b-2 border-gray-100">
                    <td>
                      <div className="bg-gray-200 w-16 h-16 rounded-lg">
                        <Image src={menu.gambar || "/placeholder.png"} width={64} height={64} alt={menu.namaProduk} className="w-full h-full object-cover rounded" />
                      </div>
                    </td>
                    <td className="flex flex-col justify-center flex-1">
                      <span className="text-sm text-gray-500">Makanan</span>
                      <h1 className="font-semibold">{menu.namaProduk}</h1>
                    </td>
                    <td className="text-right italic">{formatCurrency(menu.harga)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-span-5 bg-white p-6 rounded-lg">
            <TitlePage title="Aktivitas Transaksi Terbaru" />
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-blue-300 text-center">
                  <th className="border p-2">Tanggal & Waktu</th>
                  <th className="border p-2">Nama Pelanggan</th>
                  <th className="border p-2">Produk</th>
                  <th className="border p-2">Kuantitas</th>
                  <th className="border p-2">Sub Total</th>
                  <th className="border p-2">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((trans, index) => (
                  <tr key={index} className="border-b-2 border-gray-100">
                    <td className="border p-2">{new Date(trans.waktuTransaksi).toLocaleString()}</td>
                    <td className="border p-2">{trans.pelangganNama}</td>
                    <td className="border p-2">
                      {trans.items.map((item, idx) => (
                        <div key={idx}>{item.namaProduk}</div>
                      ))}
                    </td>
                    <td className="border p-2">
                      {trans.items.map((item, idx) => (
                        <div key={idx}>{item.qty}</div>
                      ))}
                    </td>
                    <td className="border p-2">
                      {trans.items.map((item, idx) => (
                        <div key={idx}>{formatCurrency(item.subtotal)}</div>
                      ))}
                    </td>
                    <td className="border p-2">{formatCurrency(trans.totalHarga)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-3 py-1 rounded-lg"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <CaretDoubleLeft size={24} />
              </button>
              <span className="px-4 py-2">{currentPage} dari {totalPages}</span>
              <button
                className="px-3 py-1 rounded-lg"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <CaretDoubleRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Utama;
