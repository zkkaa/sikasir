"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import HeadPage from "@/components/Headpage";
import { Package, PlusCircle, PencilSimple, MagnifyingGlass, CheckCircle, FileImage, WarningCircle } from "@phosphor-icons/react";
import Image from "next/image";
import currency from "currency.js"; // Import currency.js
import ConfirPopup from "@/components/ComfirPopup";
import ConfirmCheckPopup from "@/components/ConfirCheckPopup";

// Struktur data produk
interface Product {
  id: number;
  nama: string;
  kategori: "Makanan" | "Minuman";
  stok: number;
  harga: number;
  gambar: string | File;
}

const DataProdukPage = () => {
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"Semua" | "Makanan" | "Minuman">("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSucces, setShowSucces] = useState(false);
  const [showEditSucces, setShowEditSucces] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    nama: "",
    kategori: "Makanan",
    stok: 0,
    harga: 0,
    gambar: ""
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [price, setPrice] = useState("");

  // GET
  const fetchProduk = async()=> {
    const response = await fetch("/api/produk", {
      method: "GET", 
    })
    const data = await response.json();
    setProducts(data.data || []);
  }

  // Delate Produk
  const DeleteProduk = async (id: number) => {
    try {
        const response = await fetch(`/api/produk/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Gagal menghapus produk");
        }
        else response.json();
        setShowConfirm(null);
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menghapus produk");
    }
  };

  // Fungsi untuk menghapus produk
  const DeleteProduct = (id: number) => {
    DeleteProduk(id);
  };

  // Filter dan pencarian produk
  const filteredProducts = products
  .filter(product => 
    (filter === "Semua" || product.kategori === filter) &&
    product.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => b.id - a.id); // Urutkan dari ID terbesar ke terkecil (terbaru di atas)
  
  // Fungsi menangani perubahan gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
  
      if (showEditForm && selectedProduct) {
        setSelectedProduct({ ...selectedProduct, gambar: file });
      } else {
        setNewProduct({ ...newProduct, gambar: file });
      }
    }
  };
  
  // Handle Harga
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
    const formatted = currency(rawValue, { separator: ".", precision: 0, symbol: "Rp. " }).format();
  
    setPrice(formatted); // Simpan format Rp di input
    if (showEditForm && selectedProduct) {
      setSelectedProduct({ ...selectedProduct, harga: parseInt(rawValue) || 0 }); // Simpan angka asli ke state
    } else {
      setNewProduct({ ...newProduct, harga: parseInt(rawValue) || 0 });
    }
  };
  

  // Fecch pertama kali produk diload
  useEffect(() => {
    fetchProduk();
  }, []); // Akan berjalan ulang hanya jika kategoriId berubah
  
  
  // Fungsi untuk menambah produk ke API
  const addProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("nama", newProduct.nama);
      formData.append("kategori", newProduct.kategori);
      formData.append("stok", newProduct.stok.toString());
      formData.append("harga", newProduct.harga.toString());
      if (newProduct.gambar) {
        formData.append("gambar", newProduct.gambar);
      }
      const response = await fetch("/api/produk", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        // alert("Produk berhasil ditambahkan!");
        setShowSucces(true);
        setShowForm(false);
        setNewProduct({ id: 0, nama: "", kategori: "Makanan", stok: 0, harga: 0, gambar: "" });
        setPreviewImage("");
        setPrice("");
        fetchProduk(); 
      } else {
        alert("Gagal menambahkan produk!");
      }
    } catch (error) {
      console.error("Error saat menambah produk:", error);
    }
  };

// Edit Produk
const EditProduct = async (id: number) => {
  if (!selectedProduct) return;

  try {
    const response = await fetch(`/api/produk/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: selectedProduct.nama,
        kategori: selectedProduct.kategori,
        stok: selectedProduct.stok,
        harga: selectedProduct.harga,
      }),
    });

    if (!response.ok) {
      throw new Error("Gagal memperbarui produk");
    }

    else response.json();
    setShowEditSucces(true);
    setShowEditForm(false);
    fetchProduk(); // Refresh daftar produk
    setPrice("");
  } catch (error) {
    console.error("Error saat memperbarui produk:", error);
    alert("Terjadi kesalahan, coba lagi.");
  }
};

// Handle EditClick
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product); // Simpan produk yang akan diedit
    setPrice(currency(product.harga, { separator: ".", precision: 0, symbol: "Rp. " }).format()); // Format harga
    setShowEditForm(true); // Tampilkan form edit
  };
    
  return (
    <>
      <Sidebar />
      <div className="lg:ml-60 p-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6 h-screen">
        <HeadPage icon={<Package size={32} color="#ffffff" weight="fill" />} title="Data Produk" deskrip="Kelola daftar produk dengan mudah" />
        
        {/* Filter dan Search */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          {["Semua", "Makanan", "Minuman"].map((cat) => (
            <button
              key={cat}
              className={`relative px-3 py-2 text-gray-600 transition-all duration-300 ease-in-out 
                hover:text-blue-300 hover:scale-105
                ${filter === cat ? "text-blue-300 font-semibold" : "text-black"}`}
              onClick={() => setFilter(cat as "Semua" | "Makanan" | "Minuman")}
            >
              <span className="relative">{cat}</span>
              {/* Underline animasi */}
              <span className={`absolute left-0 bottom-0 w-full h-[3px] bg-blue-400 transition-all duration-300 
                ${filter === cat ? "scale-x-100 " : "scale-x-0"} origin-left`}
              ></span>
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <div className="relative w-52">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input  
              type="text" 
              placeholder="Cari produk..." 
              className="border p-2 pl-10 rounded-lg w-full outline-none" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="Btn" onClick={() => setShowForm(true)}>
            <div className="sign"><PlusCircle size={30} color="white" /></div>
            <div className="text">Tambah Produk</div>
          </button>
        </div>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-3 gap-6 max-h-[540px] overflow-y-auto">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative bg-white h-40 rounded-lg shadow-lg flex gap-4">
              <Image src={typeof product.gambar === "string" ? product.gambar : previewImage || "/placeholder.png"} width={500} height={500} alt={product.nama} className="w-36 h-full object-cover rounded bg-blue-400"/>
              <div className="flex flex-col justify-between h-full py-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.nama}</h3>
                  <p className="text-gray-500 text-sm">{product.kategori}</p>
                  <p className="font-semibold">{currency(product.harga, { separator: ".", precision: 0, symbol: "Rp. " }).format()}</p>
                </div>
                <p>
                  <span>Jumlah Stok: </span>
                  <span className="font-semibold">{product.stok}</span>
                </p>
              </div>
              {/* Tombol Edit dan Hapus di Kanan Atas */}
              <div className="absolute top-1 right-1 flex flex-col gap-1">
                <button className="p-2 text-blue-400 rounded-full hover:text-blue-500 hover:bg-gray-100" onClick={() => handleEditClick(product)}>
                  <PencilSimple size={24} weight="fill"/>
                </button>
                {/* <button className="p-2 text-red-400 rounded-full hover:text-red-500 hover:bg-gray-100" onClick={() => setShowConfirm(product.id)}>
                  <TrashSimple size={24} weight="fill"/>
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Popup Tambah Produk */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[440px] flex flex-col gap-4">
              <h2 className="text-xl font-bold">Tambah Produk</h2>              
              <div>
                <label>Nama Produk</label>
                <input className="w-full p-2 border rounded" type="text" placeholder="Masukkan nama produk" value={newProduct.nama} onChange={(e) => setNewProduct({ ...newProduct, nama: e.target.value })} />
              </div>
              <div>
                <label>Kategori</label>
                <select className="w-full p-2 border rounded" value={newProduct.kategori} onChange={(e) => setNewProduct({ ...newProduct, kategori: e.target.value as "Makanan" | "Minuman" })}>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                </select>
              </div>              
              <div>
                <label>Stok</label>
                <input className="w-full p-2 border rounded" type="number" placeholder="Masukkan stok" value={newProduct.stok} onChange={(e) => setNewProduct({ ...newProduct, stok: Number(e.target.value) })} />
              </div>
              <div>
                <label>Harga</label>
                <input className="w-full p-2 border rounded" type="text" placeholder="Masukkan harga" value={price} onChange={handlePriceChange} />
              </div>             
              <div>
                <label>Foto Produk</label>
                <label className="flex flex-col items-center cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  {previewImage ? <Image src={previewImage} width={500} height={500} className="w-32 h-32 rounded-full border" alt="Preview" /> : <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center"><FileImage size={48} color="gray"/></div>}
                </label>
              </div>
              <div className="flex justify-center gap-4 mt-8 mx-auto">
                <button className="w-32 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowForm(false)}>Batal</button>
                <button className="w-32 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={addProduct}>Tambahkan</button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Edit Produk */}
        {showEditForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[440px] flex flex-col gap-4">
              <h2 className="text-xl font-bold">Edit Produk</h2>              
              <div>
                <label>Nama Produk</label>
                <input className="w-full p-2 border rounded" type="text" value={selectedProduct.nama} onChange={(e) => setSelectedProduct({ ...selectedProduct, nama: e.target.value })} />
              </div>
              <div>
                <label>Kategori</label>
                <select className="w-full p-2 border rounded" value={selectedProduct.kategori} onChange={(e) => setSelectedProduct({ ...selectedProduct, kategori: e.target.value as "Makanan" | "Minuman" })}>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                </select>
              </div>              
              <div>
                <label>Stok</label>
                <input className="w-full p-2 border rounded" type="number" value={selectedProduct.stok} onChange={(e) => setSelectedProduct({ ...selectedProduct, stok: Number(e.target.value) })} />
              </div>
              <div>
                <label>Harga</label>
                <input className="w-full p-2 border rounded" type="text" value={price} onChange={handlePriceChange} />
              </div>             
              <div className="flex justify-center gap-4 mt-8 w-full">
                <button className="w-1/2 py-2 flex items-center justify-center bg-red-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-red-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowEditForm(false)}>Batal</button>
                <button className="w-1/2 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => EditProduct(selectedProduct.id)}>Tambahkan</button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Konfirmasi Hapus */}
        {showConfirm !== null && (<ConfirmCheckPopup icon={<WarningCircle size={48} color="white"/>} title="Hapus?" deskrip="Apakah anda yakin ingin menghapus produk ini?" cancelText="Batal" confirText="Hapus" color1="red" onCancel={() => setShowConfirm(null)} onConfirm={() => DeleteProduct(showConfirm)} /> )}

        {showSucces && (<ConfirPopup icon={<CheckCircle size={48} color="white"/>} title="Berhasil" deskrip="Produk berhasil ditambahkan" color1="blue" onClick={() => setShowSucces(false)} /> )}

        {showEditSucces && (<ConfirPopup icon={<CheckCircle size={48} color="white"/>} title="Berhasil" deskrip="Produk berhasil diperbaharui" color1="blue" onClick={() => setShowEditSucces(false)} /> )}
      </div>
    </>
  );
};

export default DataProdukPage;