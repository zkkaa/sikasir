"use client";
import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import HeadPage from "@/components/Headpage";
import { HandCoins, MagnifyingGlass, Plus, Minus } from "@phosphor-icons/react";
import Image from 'next/image';
import TitlePage from '@/components/titlesection';

// Tipe data untuk menu
interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: 'Makanan' | 'Minuman';
}

const TransaksiPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Ayam Geprek', price: 15000, image: 'ayam.jpg', category: 'Makanan', stock: 10 },
    { id: 2, name: 'Es Teh Manis', price: 5000, image: 'esteh.jpg', category: 'Minuman', stock: 5 }
  ]);

  interface OrderItem extends MenuItem {
    quantity: number;
  }
  
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showConfirm, setShowConfirm] = useState(false);

  // Fungsi menambahkan menu ke pesanan
  const addToOrder = (item: MenuItem) => {
    if (item.stock > 0) {
      setOrders((prevOrders) => {
        const existingOrder = prevOrders.find(order => order.id === item.id);
        if (existingOrder) {
          return prevOrders.map(order =>
            order.id === item.id ? { ...order, quantity: order.quantity + 1 } : order
          );
        } else {
          return [...prevOrders, { ...item, quantity: 1 }];
        }
      });
      
      setMenuItems((prevMenu) =>
        prevMenu.map(menu => menu.id === item.id ? { ...menu, stock: menu.stock - 1 } : menu)
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
        prevMenu.map(menu => menu.id === id ? { ...menu, stock: menu.stock + 1 } : menu)
      );
    };

  // Fungsi untuk membatalkan semua pesanan
  const clearOrders = () => {
    setOrders([]);
    setMenuItems((prevMenu) =>
      prevMenu.map(menu => {
        const orderedItem = orders.find(order => order.id === menu.id);
        return orderedItem ? { ...menu, stock: menu.stock + orderedItem.quantity } : menu;
      })
    );
    setShowConfirm(false);
  };

  // Fungsi mencari produk
  const filteredMenu = menuItems.filter(item => 
    (filterCategory === "All" || item.category === filterCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<HandCoins size={32} color="#ffffff" weight="fill" />} title="Transaksi" deskrip="Transaksi secara cepat dan akurat" />
        <div className="flex bg-gray-100 h-full">
          {/* Menu */}
          <div className="w-2/3 p-6 bg-white shadow-lg rounded-lg">
            <TitlePage title='Menu'/>
            <div className="flex items-center gap-4 mb-4">
              {/* Filter Kategori */}
              <select 
                className="p-2 border rounded-lg"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">Semua</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
              </select>
              
              {/* Search Input & Button */}
              <div className="relative flex items-center border rounded-lg w-full">
                <input 
                  type="text" 
                  placeholder="Cari produk..." 
                  className="p-2 w-full focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300"
                >
                  <MagnifyingGlass size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {filteredMenu.map(item => (
                <div 
                  key={item.id} 
                  className={`border p-4 rounded-lg shadow-md transform transition duration-300 ${item.stock > 0 ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`} 
                  onClick={() => item.stock > 0 && addToOrder(item)}
                >
                  <h3 className="text-center mt-2 font-semibold">{item.name}</h3>
                  <p className="text-center text-gray-500">Rp {item.price.toLocaleString()}</p>
                  <p className={`text-center ${item.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>{item.stock > 0 ? `Stok: ${item.stock}` : <Image src="/souldout.png" width={500} height={500} alt="souldout" className='w-40 h-40 absolute left-10 -top-5'/>}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pesanan */}
          <div className="w-1/3 p-6 bg-white shadow-lg rounded-lg ml-6">
            <TitlePage title='Pesanan' />
            {orders.length > 0 ? (
              <>
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
                        <td className="border p-2">{order.name}</td>
                        <td className="border p-2 flex items-center gap-2 justify-center">
                          <button onClick={() => decreaseOrder(order.id)} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                            <Minus size={16} />
                          </button>
                          {order.quantity}
                          <button onClick={() => addToOrder(order)} className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600">
                            <Plus size={16} />
                          </button>
                        </td>
                        <td className="border p-2">Rp {order.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-right mt-4 text-lg font-bold">
                  Total: Rp {orders.reduce((total, order) => total + order.price * order.quantity, 0).toLocaleString()}
                </p>
                <button 
                  onClick={() => setShowConfirm(true)} 
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Batalkan Pesanan
                </button>
                <button 
                  className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Pesan
                </button>
              </>
            ) : (
              <p className="text-center text-gray-500">Belum ada pesanan</p>
            )}
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">Apakah Anda yakin ingin membatalkan pesanan?</p>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setShowConfirm(false)}>Batal</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={clearOrders}>Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransaksiPage;
