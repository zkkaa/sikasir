"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { Package, PlusCircle, PencilSimple, Trash } from "@phosphor-icons/react";
import Image from "next/image";

// Struktur data produk
interface Product {
  id: number;
  name: string;
  category: "Makanan" | "Minuman";
  stock: number;
  price: number;
  image: string;
}

const DataProdukPage = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Ayam Geprek", category: "Makanan", stock: 10, price: 15000, image: "/ayam.jpg" },
    { id: 2, name: "Es Teh Manis", category: "Minuman", stock: 5, price: 5000, image: "/esteh.jpg" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0, name: "", category: "Makanan", stock: 0, price: 0, image: ""
  });

  // Fungsi untuk menambahkan produk baru
  const addProduct = () => {
    if (newProduct.name && newProduct.price > 0 && newProduct.stock >= 0) {
      setProducts([...products, { ...newProduct, id: products.length + 1 }]);
      setShowForm(false);
      setNewProduct({ id: 0, name: "", category: "Makanan", stock: 0, price: 0, image: "" });
    }
  };

  // Fungsi untuk menghapus produk
  const deleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    setShowConfirm(null);
  };

  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6">
        <HeadPage icon={<Package size={32} color="#ffffff" weight="fill" />} title="Data Produk" deskrip="Kelola daftar produk dengan mudah" />
        
        {/* Tombol Tambah Produk */}
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          onClick={() => setShowForm(true)}
        >
          <PlusCircle size={20} /> Tambah Produk
        </button>

        {/* Grid Data Produk */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              {/* <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" /> */}
              <Image src="/souldout.png" width={500} height={500} alt="souldout" className='w-24 h-24 object-cover rounded'/>
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="text-gray-700 mt-1">Stok: {product.stock}</p>
              <p className="text-blue-600 font-semibold">Rp {product.price.toLocaleString()}</p>
              <div className="flex gap-2 mt-3">
                <button className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                  <PencilSimple size={18} />
                </button>
                <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => setShowConfirm(product.id)}>
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popup Konfirmasi Hapus */}
        {showConfirm !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <h2 className="text-lg font-bold">Hapus Produk?</h2>
              <p className="text-gray-600">Apakah kamu yakin ingin menghapus produk ini?</p>
              <div className="flex justify-center gap-4 mt-4">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowConfirm(null)}>Batal</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => deleteProduct(showConfirm)}>Hapus</button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Tambah Produk */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Tambah Produk</h2>
              <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Nama Produk" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              <select className="w-full p-2 border rounded mb-2" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as "Makanan" | "Minuman" })}>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
              </select>
              <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Stok" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
              <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Harga" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
              <input className="w-full p-2 border rounded mb-4" type="text" placeholder="URL Gambar" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowForm(false)}>Batal</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addProduct}>Tambah</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DataProdukPage;
