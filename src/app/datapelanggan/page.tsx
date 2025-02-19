"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { MagnifyingGlass, FileArrowDown } from "@phosphor-icons/react";
import jsPDF from "jspdf";
import 'jspdf-autotable';

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: { head: string[][]; body: (string | number)[][] }) => jsPDF;
  }
}

// Struktur data pelanggan
interface Customer {
  id: string;
  nama: string;
  alamat: string;
  noHp: string;
}

const DataPelangganPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showAddPelangganForm, setShowAddCustomerForm] = useState(false);
  const [showEditPelanggan, setShowEditPelanggan] =
    useState<Customer | null>(null);

  const fetchCustomers = async () => { 
    const response = await fetch("/api/pelanggan", { 
      method: "GET", 
    });
    const data = await response.json(); 
    setCustomers(data.data || []);
  }

  useEffect(() => {
    fetchCustomers();
  }, [])

  const addCustomer = async (customer: Omit<Customer, "id">) => {
    try {
      const response = await fetch("/api/pelanggan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      const data = await response.json();
      if (data.success) {
        fetchCustomers();
        setShowAddCustomerForm(false);
      }
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  const updateCustomer = async (id: string, customer: Omit<Customer, "id">) => {
    try {
      const response = await fetch(`/api/pelanggan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      const data = await response.json();
      if (data.success) {
        fetchCustomers();
        setShowEditPelanggan(null);
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  // Fungsi untuk mencari dan mengurutkan pelanggan berdasarkan ID atau Nama
  const filteredCustomers = customers
    .filter(
      (customer) =>
        searchTerm === "" ||
        customer.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? b.id.toString().localeCompare(a.id.toString())
        : a.id.toString().localeCompare(b.id.toString())
    );

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
      setSelectedRows(filteredCustomers.map(customer => customer.id)); // Pilih semua pelanggan
    }
    setSelectAll(!selectAll);
  };

  // Fungsi Export ke PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Data Pelanggan", 14, 10);

    const tableData = selectedRows.map((id) => {
      const customer = filteredCustomers.find(c => c.id === id);
      return [customer?.id || "", customer?.nama || "", customer?.alamat || "", customer?.noHp || ""];
    });

    doc.autoTable({
      head: [["ID Pelanggan", "Nama", "Alamat", "No. HP"]],
      body: tableData,
    });

    doc.save("data_pelanggan.pdf");
  };

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6 h-screen">
        <HeadPage
          icon={<MagnifyingGlass size={32} color="#ffffff" weight="fill" />}
          title="Data Pelanggan"
          deskrip="Lihat data pelanggan yang terdaftar"
        />

        {/* Pencarian & Filter & tambah */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              <select className="p-2 border rounded-lg" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} >
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
            <div className="relative w-80">
              <MagnifyingGlass size={20} className="absolute left-3 top-2.5 text-gray-500" />
              <input type="text" placeholder="Cari ID atau Nama Pelanggan..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none " value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600" onClick={() => setShowAddCustomerForm(true)} >
              Tambah Pelanggan
            </button>
          </div>
        </div>

        {/* Tabel Data Pelanggan */}
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          {/* Tombol Export & Cetak (Muncul Jika Ada yang Dipilih) */}
          {selectedRows.length > 0 && (
            <div className="flex justify-end gap-2 mb-4">
              <button  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600" onClick={exportToPDF} >
                <FileArrowDown size={20} /> Export PDF
              </button>
            </div>
          )}

          {/* Tabel Pelanggan */}
          <table className="w-full border-collapse border" onDoubleClick={handleTableDoubleClick}>
            <thead>
              <tr className="bg-gray-200">
                {showCheckboxes && (
                  <th className="border p-2 text-center">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                )}
                <th className="border p-2">ID Pelanggan</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Alamat</th>
                <th className="border p-2">No. HP</th>
                <th className="border p-2 w-48">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  {showCheckboxes && (
                    <td className="border p-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(customer.id)} 
                        onChange={() => handleCheckboxChange(customer.id)} 
                      />
                    </td>
                  )}
                  <td className="border p-2">{customer.id}</td>
                  <td className="border p-2">{customer.nama}</td>
                  <td className="border p-2">{customer.alamat}</td>
                  <td className="border p-2">{customer.noHp}</td>
                  <td className="border p-2 flex gap-2 justify-center ">
                    <button 
                      className="bg-blue-500 text-white w-16 py-1 rounded-lg hover:bg-blue-600" 
                      onClick={() => setShowEditPelanggan(customer)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Edit Pelanggan */}
      {showEditPelanggan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] flex flex-col gap-4">
            <h2 className="text-xl font-bold">Edit Pelanggan</h2>              
            <div>
              <label>Nama</label>
              <input className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan nama" value={showEditPelanggan.nama} onChange={(e) => setShowEditPelanggan({ ...showEditPelanggan, nama: e.target.value })} />
            </div>
            <div>
              <label>Alamat</label>
              <textarea className="w-full p-2 border rounded outline-none" name="alamatpelangan" id="alamatpelanggan" placeholder="masukan alamat" value={showEditPelanggan.alamat} onChange={(e) => setShowEditPelanggan({ ...showEditPelanggan, alamat: e.target.value })}></textarea>
            </div>              
            <div>
              <label>No Telepon</label>
              <input className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan no telepon" value={showEditPelanggan.noHp} onChange={(e) => setShowEditPelanggan({ ...showEditPelanggan, noHp: e.target.value })} />
            </div>            
            <div className="flex justify-center gap-4 mt-4 mx-auto w-full">
              <button className="w-1/2 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowEditPelanggan(null)} >Batal</button>
              <button className="w-1/2 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => updateCustomer(showEditPelanggan.id, { nama: showEditPelanggan.nama, alamat: showEditPelanggan.alamat, noHp: showEditPelanggan.noHp })} >Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Tambah Pelanggan */}
      {showAddPelangganForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] flex flex-col gap-4">
            <h2 className="text-xl font-bold">Tambah Pelanggan</h2>              
            <div>
              <label>Nama</label>
              <input id="nama" className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan nama" />
            </div>
            <div>
              <label>Alamat</label>
              <textarea id="alamat" className="w-full p-2 border rounded outline-none" name="" placeholder="masukan alamat"></textarea>
            </div>              
            <div>
              <label>No Telepon</label>
              <input id="noHp" className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan no telepon" />
            </div>            
            <div className="flex justify-center gap-4 mt-4 mx-auto w-full">
              <button className="w-1/2 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowAddCustomerForm(false)} >Batal</button>
              <button className="w-1/2 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => addCustomer({ nama: (document.getElementById("nama") as HTMLInputElement).value, alamat: (document.getElementById("alamat") as HTMLTextAreaElement).value, noHp: (document.getElementById("noHp") as HTMLInputElement).value })} >Tambah</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataPelangganPage;
