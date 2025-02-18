"use client";
import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import HeadPage from "@/components/Headpage";
import { HandCoins, MagnifyingGlass, Plus, Minus, WarningCircle  } from "@phosphor-icons/react";
import Image from 'next/image';
import TitlePage from '@/components/titlesection';

// Tipe data untuk menu
interface MenuItem {
  id: number;
  nama: string;
  harga: number;
  gambar: string;
  stok: number;
  kategori: 'Makanan' | 'Minuman';
}

const TransaksiPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, nama: 'Ayam Geprek', harga: 15000, gambar: 'ayam.jpg', kategori: 'Makanan', stok: 10 },
    { id: 2, nama: 'Es Teh Manis', harga: 5000, gambar: 'esteh.jpg', kategori: 'Minuman', stok: 5 },
    { id: 3, nama: 'Es Teh Manis', harga: 5000, gambar: 'esteh.jpg', kategori: 'Minuman', stok: 5 },
    { id: 11, nama: 'Ayam Geprek', harga: 15000, gambar: 'ayam.jpg', kategori: 'Makanan', stok: 10 },
    { id: 12, nama: 'Es Teh Manis', harga: 5000, gambar: 'esteh.jpg', kategori: 'Minuman', stok: 5 },
    { id: 13, nama: 'Es Teh Manis', harga: 5000, gambar: 'esteh.jpg', kategori: 'Minuman', stok: 5 },
    { id: 21, nama: 'Ayam Geprek', harga: 15000, gambar: 'ayam.jpg', kategori: 'Makanan', stok: 10 },
    { id: 32, nama: 'Es Teh Manis', harga: 5000, gambar: 'esteh.jpg', kategori: 'Minuman', stok: 5 },
    { id: 23, nama: 'Es Teh Manis', harga: 5000, gambar: 'esteh.jpg', kategori: 'Minuman', stok: 5 },
  ]);

  interface OrderItem extends MenuItem {
    quantity: number;
  }
  
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterkategori, setFilterkategori] = useState("All");
  const [showConfirm, setShowConfirm] = useState(false);

  // Fungsi menambahkan menu ke pesanan
  const addToOrder = (item: MenuItem) => {
    if (item.stok > 0) { // Pastikan stok masih ada sebelum ditambahkan
      setOrders((prevOrders) => {
        const existingOrder = prevOrders.find(order => order.id === item.id);
        if (existingOrder) {
          // Jika produk sudah ada di pesanan, tambahkan qty jika stok mencukupi
          if (existingOrder.quantity < item.stok) {
            return prevOrders.map(order =>
              order.id === item.id ? { ...order, quantity: order.quantity + 1 } : order
            );
          }
          return prevOrders; // Jangan tambah qty jika sudah mencapai stok maksimal
        } else {
          return [...prevOrders, { ...item, quantity: 1 }];
        }
      });
  
      // Kurangi stok produk di menu hanya 1 unit setiap kali ditambahkan
      setMenuItems((prevMenu) =>
        prevMenu.map(menu =>
          menu.id === item.id ? { ...menu, stok: menu.stok - 1 } : menu
        )
      );
    }
  };

    // Fungsi mengurangi qty atau menghapus jika qty = 0
    const decreaseOrder = (id: number) => {
      setOrders((prevOrders) => {
        return prevOrders.map(order =>
          order.id === id ? { ...order, quantity: order.quantity - 1 } : order
        ).filter(order => order.quantity > 0);
      });
      
      setMenuItems((prevMenu) =>
        prevMenu.map(menu => menu.id === id ? { ...menu, stok: menu.stok + 1 } : menu)
      );
    };

  // Fungsi untuk membatalkan semua pesanan
  const clearOrders = () => {
    setOrders([]);
    setMenuItems((prevMenu) =>
      prevMenu.map(menu => {
        const orderedItem = orders.find(order => order.id === menu.id);
        return orderedItem ? { ...menu, stok: menu.stok + orderedItem.quantity } : menu;
      })
    );
    setShowConfirm(false);
  };

  // Fungsi mencari produk
  const filteredMenu = menuItems.filter(item => 
    (filterkategori === "All" || item.kategori === filterkategori) &&
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Sidebar  />
      <div className="lg:ml-60 p-6 bg-gray-100 flex flex-col gap-6 h-screen">
        <HeadPage icon={<HandCoins size={32} color="#ffffff" weight="fill" />} title="Transaksi" deskrip="Transaksi secara cepat dan akurat" />
        <div className="flex bg-gray-100 h-[89%]">
          {/* Menu */}
          <div className="w-2/3 p-6 bg-white shadow-lg rounded-lg">
            <TitlePage title='Menu'/>
            <div className="flex items-center justify-between mb-4">
              {/* Filter Kategori */}
              <select 
                className="p-2 border rounded-lg outline-none"
                value={filterkategori}
                onChange={(e) => setFilterkategori(e.target.value)}
              >
                <option value="All">Semua</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
              </select>
              {/* Search Input */}
              <div className="relative border rounded-lg w-56">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari produk..." 
                  className="border p-2 pl-10 rounded-lg w-full outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[480px] overflow-y-auto overflow-x-hidden"> {/* Tambahkan batas tinggi agar scroll aktif */}
              <div className="grid grid-cols-3 gap-6 ">
                {filteredMenu.map((item) => (
                  <div key={item.id} className={`relative border col-span-1 rounded-lg shadow-lg transform transition duration-300 cursor-pointer ${item.stok > 0 ? "" : "opacity-50 cursor-not-allowed"}`} onClick={() => item.stok > 0 && addToOrder(item)} >
                    <Image src="/nasilemak.jpg" width={500} height={500} alt="nasilemak" className="w-full h-40 object-cover rounded bg-blue-400" />
                    <div className='pl-3'>
                      <h3 className="mt-3 font-semibold text-lg">{item.nama}</h3>
                      <p className="text-gray-500 text-sm">{item.kategori}</p>
                      <p
                        className={`${item.stok > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {item.stok > 0 ? (
                          `Stok: ${item.stok}`
                        ) : (
                          <Image src="/souldout.png" width={500} height={500} alt="souldout" className="w-40 h-40 absolute left-10 -top-5" />
                        )}
                      </p>
                      <p className="text-lg font-medium mt-4 mb-2">Rp {item.harga.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>

          {/* Pesanan */}
          <div className="w-1/3 p-6 bg-white shadow-lg rounded-lg ml-6 flex flex-col h-full">
            <TitlePage title='Pesanan' />
            {orders.length > 0 ? (
              <>
                {/* Container tabel dengan scrolling */}
                <div className="flex-grow overflow-auto">
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Qty</th>
                        <th className="border p-2">Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="border p-2">{order.nama}</td>
                          <td className="border p-2 flex items-center gap-2 justify-center">
                            <button 
                              onClick={() => decreaseOrder(order.id)} 
                              className="bg-red-400 text-white p-1 rounded-full hover:bg-red-500"
                            >
                              <Minus size={16} />
                            </button>
                            {order.quantity}
                            <button 
                              onClick={() => addToOrder(order)} 
                              className="bg-green-400 text-white p-1 rounded-full hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={order.quantity >= order.stok} // Tidak bisa menambah qty jika stok sudah habis
                            >
                              <Plus size={16} />
                            </button>
                          </td>
                          <td className="border p-2">Rp {order.harga.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bagian bawah tetap di posisi fix */}
                <div className="mt-4">
                  <div className="mt-4 text-lg font-semibold flex justify-between border-t-2 border-gray-200 pt-4">
                    <span>Total Harga:</span>
                    <span>Rp {orders.reduce((total, order) => total + order.harga * order.quantity, 0).toLocaleString()}</span>
                  </div>
                  <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">Lanjut ke pembayaran</button>
                  <button onClick={() => setShowConfirm(true)} className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300">Batalkan </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 mt-10">Belum ada pesanan</p>
            )}
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4"></p>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setShowConfirm(false)}>Batal</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={clearOrders}>Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-8 relative overflow-hidden rounded-xl">
            <div className="w-24 h-24 bg-red-500 rounded-full absolute -right-5 -top-7 flex items-center justify-center pt-3 pr-3">
              <WarningCircle   size={48} color="white"/>
            </div>
            <h1 className="font-bold text-2xl text-red-500 mt-3">Batalkan?</h1>
            <p className="text-zinc-600 leading-6 mt-3">Apakah Anda yakin ingin membatalkan pesanan?</p>
            <div className="flex justify-center gap-4 mt-8">
              <button className="px-3 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowConfirm(false)}>Kembali</button>
              <button className="px-3 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={clearOrders}>Batalkan</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default TransaksiPage;
