"use client";
import Sidebar from "@/components/sidebar";
import Card from "@/components/card";
import { Grafik } from "../../components/grafik";
import TitlePage from "@/components/titlesection";
import HeadPage from "@/components/Headpage";
import { ShoppingCart, House, CurrencyCircleDollar, WarningCircle, ListChecks } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Transaction {
  id: number;
  waktuTransaksi: string;
  pelangganNama: string;
  items: { namaProduk: string; qty: number; }[];
  totalHarga: number;
}

interface Product {
  id: number;
  stok: number;
  nama?: string;
  harga?: number;
  kategori?: string;
  gambar?: string;
}

interface TopProduct {
  nama: string;
  kategori: string;
  gambar: string;
  harga: number;
  totalQty: number;
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
};

// Format date and time
const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // Pastikan default value sesuai dengan tipe Product[]
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [menuTersedia, setMenuTersedia] = useState(0);
  const [menuHabis, setMenuHabis] = useState(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  // Fetch transactions
  const fetchTransactions = async () => {
    const response = await fetch("/api/transaksi", { method: "GET" });
    const data = await response.json();
    const today = new Date().toDateString();
    const dailyTransactions = data.data.filter((trx: Transaction) => new Date(trx.waktuTransaksi).toDateString() === today);

    setTransactions(dailyTransactions);
    setTotalPendapatan(dailyTransactions.reduce((sum: number, trx: Transaction) => sum + trx.totalHarga, 0));
    setJumlahTransaksi(dailyTransactions.length);
  };

  // Fetch products
  const fetchProducts = async () => {
    const response = await fetch("/api/produk", { method: "GET" });
    const data = await response.json();
    setProducts(data.data || []); // Perbarui state 'products'
  };

  // Fetch top products
  const fetchTopProducts = async () => {
    const response = await fetch("/api/transaksi", { method: "GET" });
    const data = await response.json();
    setTopProducts(data.topProducts || []);
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
    fetchTopProducts();
  }, []);

  useEffect(() => {
    // Hitung ulang menu tersedia dan menu habis berdasarkan data produk
    const available = products.filter((product) => product.stok > 0).length;
    const outOfStock = products.filter((product) => product.stok === 0).length;

    setMenuTersedia(available);
    setMenuHabis(outOfStock);
  }, [products]); // Jalankan setiap kali 'products' berubah

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<House size={32} color="#ffffff" weight="fill" />} title="Dashboard" deskrip="Selamat datang di Sikasir" />
        <div className="w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-4 lg:gap-6">
          <Card iconc="bg-yellow-200" textc="text-yellow-500" total={formatCurrency(totalPendapatan)} title="Total Pendapatan Hari Ini" icon={<CurrencyCircleDollar />} />
          <Card iconc="bg-blue-200" textc="text-blue-500" total={jumlahTransaksi.toString()} title="Jumlah Transaksi Hari Ini" icon={<ShoppingCart />} />
          <Card iconc="bg-green-200" textc="text-green-500" total={menuTersedia.toString()} title="Jumlah Menu Yang Tersedia" icon={<ListChecks />} />
          <Card iconc="bg-red-200" textc="text-red-500" total={menuHabis.toString()} title="Jumlah Menu Yang Habis" icon={<WarningCircle />} />
        </div>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <Grafik />
          </div>
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <TitlePage title="Menu Terlaris" />
            <div className="grid grid-cols-1 gap-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-2 border-b-2 border-gray-100">
                  <div className="bg-gray-200 w-20 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={typeof product.gambar === "string" ? product.gambar : "/placeholder.png"}
                      alt={product.nama || "Product Image"}
                      width={1000}
                      height={1000}
                      quality={100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <span className="text-sm text-gray-500">{product.kategori}</span>
                    <h1 className="font-semibold">{product.nama}</h1>
                  </div>
                  <div className="text-right">
                    <p className="italic">{formatCurrency(product.harga)}</p>
                    <p className="text-sm text-gray-500">{product.totalQty} Terjual</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-5 bg-white p-6 rounded-lg">
            <TitlePage title="Aktivitas Transaksi Terbaru" />
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-200">
                  <th className="p-2 text-left">ID Transaksi</th>
                  <th className="p-2 text-left">Nama Pelanggan</th>
                  <th className="p-2 text-left">Tanggal & Waktu</th>
                  <th className="p-2 text-left">Produk & Qty</th>
                  <th className="p-2 text-center w-36">Total Pesanan</th>
                  <th className="p-2 text-right">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 7).map((transaction) => (
                  <tr key={transaction.id} className="border-b-2 border-gray-100">
                    <td className="p-2">{transaction.id}</td>
                    <td className="p-2">{transaction.pelangganNama}</td>
                    <td className="p-2">{formatDateTime(transaction.waktuTransaksi)}</td>
                    <td className="p-2">
                      {transaction.items.map((item, index) => (
                        <div key={index}>
                          {item.namaProduk} ({item.qty})
                        </div>
                      ))}
                    </td>
                    <td className="p-2 text-center">
                      {transaction.items.reduce((total, item) => total + item.qty, 0)}
                    </td>
                    <td className="p-2 text-right">{formatCurrency(transaction.totalHarga)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;