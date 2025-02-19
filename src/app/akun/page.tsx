"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { Users, PlusCircle, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import Image from "next/image";

// Struktur data akun
interface UserAccount {
  id: number;
  nama: string;
  username: string;
  hakAkses: "Admin" | "Petugas";
  password: string;
}

const KelolaAkunPage = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filterhakAkses, setFilterhakAkses] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUser, setEditUser] = useState<UserAccount>({ id: 0, nama: "", username: "", hakAkses: "Petugas", password: "", });
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowAddForm(false);
      } else {
        console.error("Failed to add user:", data.message);
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowEditForm(false);
      } else {
        console.error("Failed to update user:", data.message);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowConfirmDelete(null);
      } else {
        console.error("Failed to delete user:", data.message);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Fungsi untuk mencari dan mengurutkan pelanggan berdasarkan ID atau Nama
  const filteredUser = users
    .filter(
      (user) =>
        searchTerm === "" ||
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => filterhakAkses === "All" || user.hakAkses === filterhakAkses);

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6 h-screen">
        <HeadPage icon={<Users size={32} color="#ffffff" weight="fill" />} title="Kelola Akun" deskrip="Kelola akun pengguna dengan mudah" />
        
        {/* Filter & Tambah Akun */}
        <div className="flex justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex gap-4">
            <select className="p-2 border rounded-lg" value={filterhakAkses} onChange={(e) => setFilterhakAkses(e.target.value)}>
              <option value="All">Semua</option>
              <option value="Admin">Admin</option>
              <option value="Petugas">Petugas</option>
            </select>
            <div className="relative w-72">
              <MagnifyingGlass size={20} className="absolute left-3 top-2.5 text-gray-500" />
              <input type="text" placeholder="Cari Nama atau Username..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none " value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            onClick={() => { setShowAddForm(true); setEditUser({ id: 0, nama: "", username: "", hakAkses: "Petugas", password: "", }); }}
          >
            <PlusCircle size={20} /> Tambah Akun
          </button>
        </div>
        
        {/* Data Pengguna */}
        <div className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 gap-3">
          {filteredUser.map(user => (
            <div key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-4 col-span-1">
              <Image src="/userprofile.jpg" width={500} height={500} alt="souldout" className='w-14 h-14 rounded-full border'/>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user.nama}</h3>
                <p className="text-gray-500">{user.hakAkses}</p>
              </div>
              <div className="flex gap-4 items-center">
                <button className="w-20 py-2 flex items-center justify-center bg-blue-400 rounded-xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => { setShowEditForm(true); setEditUser(user); }} >
                    Edit
                  </button>
                  <button className="w-20 py-2 flex items-center justify-center bg-red-400 rounded-xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowConfirmDelete(user.id)} >
                    Hapus
                  </button>
              </div>
            </div>
          ))}
        </div>
        
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] flex flex-col gap-4">
            <h2 className="text-xl font-bold">Tambah User</h2>              
            <div>
              <label>Nama</label>
              <input id="nama" className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan nama" value={editUser.nama} onChange={(e) => setEditUser({ ...editUser, nama: e.target.value })} />
            </div>
            <div>
              <label>Username</label>
              <input id="username" className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan username" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
            </div>
            <div>
              <label>Role</label>
              <select className="w-full p-2 border rounded" value={editUser.hakAkses} onChange={(e) => setEditUser({ ...editUser, hakAkses: e.target.value as "Admin" | "Petugas" })}>
                <option value="Admin">Admin</option>
                <option value="Petugas">Petugas</option>
              </select>
            </div>             
            <div>
              <label>Password</label>
              <input id="password" className="w-full p-2 border rounded outline-none" type="password" placeholder="Masukkan password" value={editUser.password} onChange={(e) => setEditUser({ ...editUser, password: e.target.value })} />
            </div>           
            <div className="flex justify-center gap-4 mt-4 mx-auto w-full">
              <button className="w-1/2 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowAddForm(false)} >Batal</button>
              <button className="w-1/2 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={addUser} >Tambah</button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] flex flex-col gap-4">
            <h2 className="text-xl font-bold">Edit User</h2>              
            <div>
              <label>Nama</label>
              <input id="nama" className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan nama" value={editUser.nama} onChange={(e) => setEditUser({ ...editUser, nama: e.target.value })} />
            </div>
            <div>
              <label>Username</label>
              <input id="username" className="w-full p-2 border rounded outline-none" type="text" placeholder="Masukkan username" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
            </div>
            <div>
              <label>Role</label>
              <select className="w-full p-2 border rounded" value={editUser.hakAkses} onChange={(e) => setEditUser({ ...editUser, hakAkses: e.target.value as "Admin" | "Petugas" })}>
                <option value="Admin">Admin</option>
                <option value="Petugas">Petugas</option>
              </select>
            </div>             
            <div>
              <label>Password</label>
              <input id="password" className="w-full p-2 border rounded outline-none" type="password" placeholder="Masukkan password" value={editUser.password} onChange={(e) => setEditUser({ ...editUser, password: e.target.value })} />
            </div>           
            <div className="flex justify-center gap-4 mt-4 mx-auto w-full">
              <button className="w-1/2 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowEditForm(false)} >Batal</button>
              <button className="w-1/2 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={updateUser} >Simpan</button>
            </div>
          </div>
        </div>
      )}

        {/* Popup Konfirmasi Hapus */}
        {showConfirmDelete !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-8 relative overflow-hidden rounded-xl">
            <div className="w-24 h-24 bg-red-500 rounded-full absolute -right-5 -top-7 flex items-center justify-center pt-3 pr-3">
              <WarningCircle size={48} color="white" />
            </div>
            <h1 className="font-bold text-2xl text-red-500 mt-3">Hapus?</h1>
            <p className="text-zinc-600 leading-6 mt-3">
              Apakah Anda yakin ingin menghapus user ini?
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
                onClick={() => deleteUser(showConfirmDelete)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default KelolaAkunPage;
