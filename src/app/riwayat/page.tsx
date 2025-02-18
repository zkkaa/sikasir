"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { Clock, MagnifyingGlass, WarningCircle, FileArrowDown, Printer } from "@phosphor-icons/react";
import jsPDF from "jspdf";
import 'jspdf-autotable'

// Struktur data transaksi
interface Transaction {
  id: string;
  date: string;
  buyer: string;
  items: { name: string; quantity: number; price: number }[];
  cashier?: string;
  total: number;
}

const RiwayatTransaksiPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TRX001",
      date: "2025-02-10 14:30",
      buyer: "Azka",
      items: [
        { name: "Ayam Geprek", quantity: 2, price: 15000 },
        { name: "Es Teh Manis", quantity: 1, price: 5000 },
      ],
      cashier: "Admin",
      total: 35000,
    },
    {
      id: "TRX002",
      date: "2025-02-11 10:00",
      buyer: "Budi",
      items: [{ name: "Nasi Goreng", quantity: 1, price: 20000 }],
      total: 20000,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null
  );

  // Fungsi untuk mencari dan mengurutkan transaksi berdasarkan ID atau Nama Pembeli
  const filteredTransactions = transactions
    .filter(
      (trans) =>
        (searchTerm === "" ||
          trans.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trans.buyer.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterDate === "" || trans.date.includes(filterDate))
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  // Fungsi menghapus transaksi
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((trans) => trans.id !== id));
    setShowConfirmDelete(null);
  };

  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Klik dua kali untuk menampilkan checkbox
  const handleTableDoubleClick = () => {
    setShowCheckboxes(true);
  };

  // Menangani pemilihan satu checkbox
  const handleCheckboxChange = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Select All - Memilih semua checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]); // Jika sudah dipilih semua, maka kosongkan pilihan
    } else {
      setSelectedRows(filteredTransactions.map(trans => trans.id)); // Pilih semua transaksi
    }
    setSelectAll(!selectAll);
  };

  // Fungsi Export ke PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Transaksi", 14, 10);

    const tableData = selectedRows.map((id) => {
      const trans = filteredTransactions.find(t => t.id === id);
      return [trans?.id, trans?.date, trans?.buyer, `Rp ${trans?.total.toLocaleString()}`];
    });

    doc.autoTable({
      head: [["ID Transaksi", "Tanggal & Waktu", "Nama Pembeli", "Total Harga"]],
      body: tableData,
    });

    doc.save("laporan_transaksi.pdf");
  };

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6 h-screen">
        <HeadPage
          icon={<Clock size={32} color="#ffffff" weight="fill" />}
          title="Riwayat Transaksi"
          deskrip="Lihat transaksi yang telah dilakukan"
        />

        {/* Pencarian & Filter */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="relative w-full max-w-sm">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-2.5 text-gray-500"
            />
            <input
              type="text"
              placeholder="Cari ID atau Nama Pembeli..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <select
              className="p-2 border rounded-lg"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
            <input
              type="date"
              className="border p-2 rounded-lg"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Riwayat Transaksi */}
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          {/* Tombol Export & Cetak (Muncul Jika Ada yang Dipilih) */}
          {selectedRows.length > 0 && (
            <div className="flex justify-end gap-2 mb-4">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
                onClick={exportToPDF}
              >
                <FileArrowDown size={20} /> Export PDF
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
              >
                <Printer size={20} /> Cetak
              </button>
            </div>
          )}

          {/* Tabel Transaksi */}
          <table className="w-full border-collapse border" onDoubleClick={handleTableDoubleClick}>
            <thead>
              <tr className="bg-gray-200">
                {showCheckboxes && (
                  <th className="border p-2 text-center">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                )}
                <th className="border p-2">ID Transaksi</th>
                <th className="border p-2">Tanggal & Waktu</th>
                <th className="border p-2">Nama Pembeli</th>
                <th className="border p-2">Total Harga</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(trans => (
                <tr key={trans.id}>
                  {showCheckboxes && (
                    <td className="border p-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(trans.id)} 
                        onChange={() => handleCheckboxChange(trans.id)} 
                      />
                    </td>
                  )}
                  <td className="border p-2">{trans.id}</td>
                  <td className="border p-2">{trans.date}</td>
                  <td className="border p-2">{trans.buyer}</td>
                  <td className="border p-2">Rp {trans.total.toLocaleString()}</td>
                  <td className="border p-2 flex gap-2">
                    <button 
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600" 
                      onClick={() => setSelectedTransaction(trans)}
                    >
                      Detail
                    </button>
                    <button 
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600" 
                      onClick={() => setShowConfirmDelete(trans.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Detail Transaksi */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Detail Transaksi</h2>
            <p>ID: {selectedTransaction.id}</p>
            <p>Nama Pembeli: {selectedTransaction.buyer}</p>
            <p>Tanggal: {selectedTransaction.date}</p>
            <ul>
              {selectedTransaction.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} x Rp{" "}
                  {item.price.toLocaleString()}
                </li>
              ))}
            </ul>
            <p className="font-bold">
              Total: Rp {selectedTransaction.total.toLocaleString()}
            </p>
            <div className="flex justify-center gap-4 mt-8">
            <button
                className="px-6 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm"
                // onClick={true}
              >
                Hapus
              </button>
              <button
                className="px-6 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm"
                onClick={() => setSelectedTransaction(null)}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-8 relative overflow-hidden rounded-xl">
              <div className="w-24 h-24 bg-red-500 rounded-full absolute -right-5 -top-7 flex items-center justify-center pt-3 pr-3">
                <WarningCircle size={48} color="white" />
              </div>
              <h1 className="font-bold text-2xl text-red-500 mt-3">Hapus?</h1>
              <p className="text-zinc-600 leading-6 mt-3">
                Apakah Anda yakin ingin menghapus transaksi ini?
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  className="px-6 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm"
                  onClick={() => setShowConfirmDelete(null)}
                >
                  Batal
                </button>
                <button
                  className="px-6 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm"
                  onClick={() => deleteTransaction(showConfirmDelete)}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
          {/* Menyembunyikan sidebar saat popup tampil */}
          <Sidebar />
        </>
      )}

    </>
  );
};

export default RiwayatTransaksiPage;
