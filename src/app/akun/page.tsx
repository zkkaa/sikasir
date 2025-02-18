"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { Users, PlusCircle, PencilSimple, Trash } from "@phosphor-icons/react";
import Image from "next/image";

// Struktur data akun
interface UserAccount {
  id: number;
  name: string;
  username: string;
  level: "Admin" | "Petugas";
  password: string;
  profileImage: string;
}

const KelolaAkunPage = () => {
  const [users, setUsers] = useState<UserAccount[]>([
    { id: 1, name: "Admin", username: "admin01", level: "Admin", password: "admin123", profileImage: "admin.jpg" },
    { id: 2, name: "Kasir 1", username: "kasir01", level: "Petugas", password: "kasir123", profileImage: "kasir.jpg" },
  ]);

  const [filterLevel, setFilterLevel] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<UserAccount>({ id: 0, name: "", username: "", level: "Petugas", password: "", profileImage: "" });
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  
  // Fungsi untuk menambahkan atau memperbarui akun
  const handleSaveUser = () => {
    if (editUser.id !== 0) {
      setUsers(users.map(user => (user.id === editUser.id ? editUser : user)));
    } else {
      setUsers([...users, { ...editUser, id: users.length + 1 }]);
    }
    setShowForm(false);
    setEditUser({ id: 0, name: "", username: "", level: "Petugas", password: "", profileImage: "" });
  };

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<Users size={32} color="#ffffff" weight="fill" />} title="Kelola Akun" deskrip="Kelola akun pengguna dengan mudah" />
        
        {/* Filter & Tambah Akun */}
        <div className="flex justify-between bg-white p-4 rounded-lg shadow">
          <select className="p-2 border rounded-lg" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <option value="All">Semua</option>
            <option value="Admin">Admin</option>
            <option value="Petugas">Petugas</option>
          </select>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            onClick={() => { setShowForm(true); setEditUser({ id: 0, name: "", username: "", level: "Petugas", password: "", profileImage: "" }); }}
          >
            <PlusCircle size={20} /> Tambah Akun
          </button>
        </div>
        
        {/* Data Pengguna */}
        <div className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.filter(user => filterLevel === "All" || user.level === filterLevel).map(user => (
            <div key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-4">
              {/* <img src={user.profileImage} alt={user.name} className="w-14 h-14 rounded-full border" /> */}
                <Image src="/souldout.png" width={500} height={500} alt="souldout" className='w-14 h-14 rounded-full border'/>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-500">@{user.username} ({user.level})</p>
              </div>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => { setShowForm(true); setEditUser(user); }}>
                <PencilSimple size={20} />
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => setShowConfirmDelete(user.id)}>
                <Trash size={20} />
              </button>
            </div>
          ))}
        </div>
        
        {/* Popup Tambah/Edit Akun */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">{editUser?.id ? "Edit Akun" : "Tambah Akun"}</h2>
              <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Nama" value={editUser?.name || ""} onChange={(e) => setEditUser({ ...editUser!, name: e.target.value })} disabled={!!editUser?.id} />
              <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Username" />
              <select className="w-full p-2 border rounded mb-2">
                <option value="Admin">Admin</option>
                <option value="Petugas">Petugas</option>
              </select>
              <input className="w-full p-2 border rounded mb-2" type="password" placeholder="Password" />
              <input className="w-full p-2 border rounded mb-4" type="text" placeholder="URL Gambar Profil" />
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowForm(false)}>Batal</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSaveUser}>{editUser?.id ? "Simpan Perubahan" : "Tambah"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Konfirmasi Hapus */}
        {showConfirmDelete !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">Apakah Anda yakin ingin menghapus akun ini?</p>
              <div className="flex justify-end gap-4">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowConfirmDelete(null)}>Batal</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded">Hapus</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default KelolaAkunPage;
