"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { ChartLine, FileArrowDown, Printer } from "@phosphor-icons/react";
// import { CheckCircle } from "@phosphor-icons/react";

// Struktur data laporan
interface SalesReport {
  date: string;
  transactions: number;
  revenue: number;
  bestProduct: string;
}

const LaporanPenjualanPage = () => {
  const [filterPeriod, setFilterPeriod] = useState("daily");
  const [reports] = useState<SalesReport[]>([
    { date: "2025-02-10", transactions: 20, revenue: 300000, bestProduct: "Ayam Geprek" },
    { date: "2025-02-11", transactions: 15, revenue: 225000, bestProduct: "Nasi Goreng" },
  ]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  // Fungsi untuk menangani perubahan filter
  const formatDateColumn = (date: string) => {
    if (filterPeriod === "monthly") {
      return new Date(date).toLocaleString("id-ID", { month: "long", year: "numeric" });
    } else if (filterPeriod === "yearly") {
      return new Date(date).getFullYear().toString();
    }
    return date;
  };

  // Fungsi menangani klik dua kali untuk menampilkan checkbox
  const handleTableDoubleClick = () => {
    setShowCheckboxes(true);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<ChartLine size={32} color="#ffffff" weight="fill" />} title="Laporan Penjualan" deskrip="Lihat performa penjualan secara detail" />
        
        {/* Filter & Export */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <select className="p-2 border rounded-lg" value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
            <option value="daily">Harian</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedRows.length > 0 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              disabled={selectedRows.length === 0}
            >
              <FileArrowDown size={20} /> Export
            </button>
            <button 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedRows.length > 0 ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              disabled={selectedRows.length === 0}
            >
              <Printer size={20} /> Cetak
            </button>
          </div>
        </div>
        
        {/* Tabel Laporan Penjualan */}
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full border-collapse border" onDoubleClick={handleTableDoubleClick}>
            <thead>
              <tr className="bg-gray-200">
                {showCheckboxes && <th className="border p-2">Pilih</th>}
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Total Transaksi</th>
                <th className="border p-2">Total Pemasukan</th>
                <th className="border p-2">Produk Terlaris</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  {showCheckboxes && (
                    <td className="border p-2 text-center">
                      <input type="checkbox" checked={selectedRows.includes(report.date)} onChange={() => handleCheckboxChange(report.date)} />
                    </td>
                  )}
                  <td className="border p-2">{formatDateColumn(report.date)}</td>
                  <td className="border p-2">{report.transactions}</td>
                  <td className="border p-2">Rp {report.revenue.toLocaleString()}</td>
                  <td className="border p-2">{report.bestProduct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </>
  );
};

export default LaporanPenjualanPage;