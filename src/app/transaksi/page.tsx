"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import HeadPage from "@/components/Headpage";
import { HandCoins, MagnifyingGlass, Plus, Minus, WarningCircle  } from "@phosphor-icons/react";
import Image from 'next/image';
import TitlePage from '@/components/titlesection';


// Tipe data untuk menu
interface Product {
  id: number;
  nama: string;
  harga: number;
  gambar: string;
  stok: number;
  kategori: 'Makanan' | 'Minuman';
}

// interface MenuItem {
//   id: number;
//   nama: string;
//   harga: number;
//   gambar: string;
//   stok: number;
//   kategori: 'Makanan' | 'Minuman';
// }

const TransaksiPage = () => {
  interface OrderItem extends Product {
    quantity: number;
  }
  
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterkategori, setFilterkategori] = useState("All");
  const [showConfirm, setShowConfirm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [previewImage] = useState<string>("");

  const fetchProduk = async()=> {
    const response = await fetch("/api/produk", {
      method: "GET", 
    })
    const data = await response.json();
    setProducts(data.data || []);
  }

   useEffect(() => {
      fetchProduk();
    }, []);

    const addToOrder = (product: Product) => {
      if (product.stok > 0) { 
        setOrders((prevOrders) => {
          const existingOrder = prevOrders.find(order => order.id === product.id);
          if (existingOrder) {
            if (existingOrder.quantity < product.stok) {
              return prevOrders.map(order =>
                order.id === product.id ? { ...order, quantity: order.quantity + 1 } : order
              );
            }
          } else {
            return [...prevOrders, { ...product, quantity: 1 }];
          }
          return prevOrders;
        });
    
        // Kurangi stok hanya jika stok masih cukup
        setProducts((prevMenu) =>
          prevMenu.map(menu =>
            menu.id === product.id && menu.stok > 0 ? { ...menu, stok: menu.stok - 1 } : menu
          )
        );
      }
    };
    

    // Fungsi mengurangi qty atau menghapus jika qty = 0
    const decreaseOrder = (id: number) => {
      setOrders((prevOrders) =>
        prevOrders.reduce<OrderItem[]>((acc, order) => {
          if (order.id === id) {
            if (order.quantity > 1) acc.push({ ...order, quantity: order.quantity - 1 });
          } else {
            acc.push(order);
          }
          return acc;
        }, [])
      );
    
      setProducts((prevMenu) =>
        prevMenu.map((menu) =>
          menu.id === id ? { ...menu, stok: menu.stok + 1 } : menu
        )
      );
    };    

  // Fungsi untuk membatalkan semua pesanan
  const clearOrders = () => {
    setOrders([]);
    setProducts((prevMenu) =>
      prevMenu.map(menu => {
        const orderedItem = orders.find(order => order.id === menu.id);
        return orderedItem ? { ...menu, stok: menu.stok + orderedItem.quantity } : menu;
      })
    );
    setShowConfirm(false);
  };

  // filter
  const filteredMenu = products.filter((product) =>
    (filterkategori === "All" || product.kategori === filterkategori) &&
    product.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );   

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-6 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<HandCoins size={32} color="#ffffff" weight="fill" />} title="Transaksi" deskrip="Transaksi secara cepat dan akurat" />
        <div className="flex bg-gray-100 h-[89%]">
          {/* Menu */}
          <div className="w-2/3 p-6 bg-white shadow-lg rounded-lg">
            <TitlePage title='Menu'/>
            <div className="flex items-center justify-between mb-4 -mt-2">
              {/* Filter Kategori */}
              <select 
                className="p-2 border rounded-lg outline-none"
                value={filterkategori}
                onChange={(e) => setFilterkategori(e.target.value)}>
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
            <div className="max-h-[540px] overflow-y-auto overflow-x-hidden">
              <div className="grid grid-cols-3 gap-6">
                {filteredMenu.map((product) => (
                  <div key={product.id} className={`relative border col-span-1 rounded-lg shadow-lg transform transition duration-300 cursor-pointer ${product.stok > 0 ? "" : "opacity-50 cursor-not-allowed"}`} onClick={() => product.stok > 0 && addToOrder(product)}>
                    <Image src={typeof product.gambar === "string" ? product.gambar : previewImage || "/placeholder.png"} width={500} height={500} alt={product.nama} className="w-full h-40 object-cover rounded bg-blue-400" />
                    <div className='pl-3'>
                      <h3 className="mt-3 font-semibold text-lg">{product.nama}</h3>
                      <p className="text-gray-500 text-sm">{product.kategori}</p>
                      <p className={`${product.stok > 0 ? "text-green-500" : "text-red-500"}`}>
                        {product.stok > 0 ? `Stok: ${product.stok}` : "Out of Stock"}
                      </p>
                      <p className="text-lg font-medium mt-4 mb-2">Rp {product.harga.toLocaleString()}</p>
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
                <div className="overflow-auto -mt-2 max-h-[165px]">
                  <table className="w-full border-collapse border">
                    <thead className='sticky -top-[0.4px]'>
                      <tr className='bg-gray-200'>
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
                            <button onClick={() => decreaseOrder(order.id)} className="bg-red-400 text-white p-1 rounded-full hover:bg-red-500">
                              <Minus size={16} />
                            </button>
                            {order.quantity}
                            <button onClick={() => addToOrder(order)} className="bg-green-400 text-white p-1 rounded-full hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"disabled={order.quantity >= order.stok} >
                              <Plus size={16} />
                            </button>
                          </td>
                          <td className="border p-2">Rp {order.harga.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-lg font-semibold flex justify-between border-y-2 py-1 border-gray-200">
                  <span>Total Harga:</span>
                  <span>Rp {orders.reduce((total, order) => total + order.harga * order.quantity, 0).toLocaleString()}</span>
                </div>
                <div className='w-full mt-3'>
                  <div className="relative border rounded-lg w-full">
                    <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Cari Pelanggan" className="border p-2 pl-10 rounded-lg w-full outline-none"/>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="container w-6 mr-3 h-full flex items-center justify-center">
                      <input value="wedding-gift" className="peer cursor-pointer hidden after:opacity-100" defaultChecked={false} type="checkbox" />
                      <span className="inline-block w-5 h-5 border-2 relative cursor-pointer after:content-[''] after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[10px] after:h-[10px] after:bg-[#333] after:rounded-[2px] after:opacity-0 peer-checked:after:opacity-100">
                      </span>
                    </label>
                    <span>Tambah Pelanggan</span>
                  </div>
                  <div className="mt-2 rounded">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="py-2 font-semibold w-32">Nama</td>
                          <td>:</td>
                          <td className="py-2"><input type="text" name="" id="" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold w-32">Telepon</td>
                          <td>:</td>
                          <td className="py-2"><input type="text" name="" id="" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-semibold w-32">Alamat</td>
                          <td>:</td>
                          <td className="py-2"><input type="text" name="" id="" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mt-4">Total Bayar</h2>
                    <input type="number" className="w-full p-2 border rounded mb-2" placeholder="Masukkan jumlah uang" />
                    <p className="text-gray-600 mb-4">Kembalian: <span className="font-bold">Rp </span></p>
                  </div>
                </div>
                <button onClick={() => setShowConfirm(true)} className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300">Batalkan </button>
              </>
            ) : (
              <p className="text-center text-gray-500 my-6">Belum ada pesanan</p>
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
