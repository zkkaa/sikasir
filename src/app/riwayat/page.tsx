"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { Clock, MagnifyingGlass, FileArrowDown } from "@phosphor-icons/react";
import jsPDF from "jspdf";
import 'jspdf-autotable';

// Struktur data transaksi
interface Transaction {
  id: number;
  waktuTransaksi: string;
  pelangganNama: string;
  items: { namaProduk: string; qty: number; hargaProduk: number }[];
  totalHarga: number;
}

const RiwayatTransaksiPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    const response = await fetch("/api/transaksi", {
      method: "GET",
    });
    const data = await response.json();
    setTransactions(data.data || []);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fungsi untuk mencari dan mengurutkan transaksi berdasarkan ID atau Nama Pembeli
  const filteredTransactions = transactions
    .filter(
      (trans) =>
        (searchTerm === "" ||
          trans.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          trans.pelangganNama.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterDate === "" || trans.waktuTransaksi.includes(filterDate)) &&
        new Date(trans.waktuTransaksi).toDateString() === new Date().toDateString() // Filter transaksi hari ini
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.waktuTransaksi).getTime() - new Date(a.waktuTransaksi).getTime()
        : new Date(a.waktuTransaksi).getTime() - new Date(b.waktuTransaksi).getTime()
    );

  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Klik dua kali untuk menampilkan checkbox
  const handleTableDoubleClick = () => {
    setShowCheckboxes(true);
  };

  // Menangani pemilihan satu checkbox
  const handleCheckboxChange = (id: number) => {
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
      return [trans?.id || "", trans?.waktuTransaksi || "", trans?.pelangganNama || "", `Rp ${trans?.totalHarga?.toLocaleString() || 0}`];
    });

    doc.autoTable({
      head: [["ID Transaksi", "Tanggal & Waktu", "Nama Pembeli", "Total Harga"]],
      body: tableData,
    });

    doc.save("laporan_transaksi.pdf");
  };

  // Format date and time
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Fungsi untuk print detail transaksi
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6 h-screen">
        <HeadPage icon={<Clock size={32} color="#ffffff" weight="fill" />} title="Riwayat Transaksi" deskrip="Lihat transaksi yang telah dilakukan" />

        {/* Pencarian & Filter */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="relative w-full max-w-sm">
            <MagnifyingGlass size={20} className="absolute left-3 top-2.5 text-gray-500" />
            <input type="text" placeholder="Cari ID atau Nama Pembeli..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <select className="p-2 border rounded-lg" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
            <input type="date" className="border p-2 rounded-lg"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Riwayat Transaksi */}
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          {/* Tombol Export & Cetak (Muncul Jika Ada yang Dipilih) */}
          {selectedRows.length > 0 && (
            <div className="flex justify-end gap-2 mb-4 mt-2 mr-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600" onClick={exportToPDF} >
                <FileArrowDown size={20} /> Export PDF
              </button>
            </div>
          )}

          {/* Tabel Transaksi */}
          <table className="w-full border-collapse border" onDoubleClick={handleTableDoubleClick}>
            <thead className="sticky -top-[1px] bg-gray-200">
              <tr>
                {showCheckboxes && (
                  <th className="border p-2 text-center">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                )}
                <th className="border p-2">ID Transaksi</th>
                <th className="border p-2">Tanggal & Waktu</th>
                <th className="border p-2">Nama Pembeli</th>
                <th className="border p-2">Total Harga</th>
                <th className="border p-2 w-48">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(trans => (
                <tr key={trans.id}>
                  {showCheckboxes && (
                    <td className="border p-2 text-center">
                      <input type="checkbox" checked={selectedRows.includes(trans.id)} onChange={() => handleCheckboxChange(trans.id)} />
                    </td>
                  )}
                  <td className="border p-2">{trans.id}</td>
                  <td className="border p-2">{formatDateTime(trans.waktuTransaksi)}</td>
                  <td className="border p-2">{trans.pelangganNama}</td>
                  <td className="border p-2">Rp {trans.totalHarga?.toLocaleString()}</td>
                  <td className="border p-2 flex gap-2 justify-center ">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600" onClick={() => setSelectedTransaction(trans)} >
                      Detail
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] flex flex-col gap-4 print:w-full print:p-0 print:shadow-none">
            <h2 className="text-xl font-bold text-center">Detail Transaksi</h2>
            <div className="border-b pb-2">
              <h3 className="font-semibold">Pesanan:</h3>
              {selectedTransaction.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.namaProduk} x{item.qty}</span>
                  <span>Rp {item.hargaProduk.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-b pb-2">
              <div className="flex justify-between font-semibold">
                <span>Total Harga:</span>
                <span>Rp {selectedTransaction.totalHarga?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Uang Dibayar:</span>
                <span>Rp {selectedTransaction.totalHarga?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembalian:</span>
                <span>Rp {(selectedTransaction.totalHarga - selectedTransaction.totalHarga)?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Transaksi:</span>
                <span>{formatDateTime(selectedTransaction.waktuTransaksi)}</span>
              </div>
            </div>
            <div className="border-b pb-2">
              <h3 className="font-semibold">Pelanggan:</h3>
              <div>
                <p>Nama: {selectedTransaction.pelangganNama}</p>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4 print:hidden">
              <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setSelectedTransaction(null)}>Kembali</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handlePrint}>Print</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RiwayatTransaksiPage;
