"use client";
import { useState } from "react";
import HeadPage from "@/components/Headpage";
import { CreditCard, UserPlus, Users  } from "@phosphor-icons/react";
import TitlePage from "@/components/titlesection";

// Struktur data pelanggan
interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
}

// Struktur data pesanan
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const PaymentPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([  
    { id: 1, name: "Budi Santoso", phone: "08123456789", address: "Jl. Merdeka No.10" },
    { id: 2, name: "Ani Wijaya", phone: "08129876543", address: "Jl. Diponegoro No.15" },
    { id: 3, name: "Budi Santoso", phone: "08123456789", address: "Jl. Merdeka No.10" },
    { id: 4, name: "Ani Wijaya", phone: "08129876543", address: "Jl. Diponegoro No.15" },
    { id: 7, name: "Budi Santoso", phone: "08123456789", address: "Jl. Merdeka No.10" },
    { id: 8, name: "Ani Wijaya", phone: "08129876543", address: "Jl. Diponegoro No.15" },
    { id: 9, name: "Budi Santoso", phone: "08123456789", address: "Jl. Merdeka No.10" },
    { id: 20, name: "Ani Wijaya", phone: "08129876543", address: "Jl. Diponegoro No.15" },
  ]);

  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 1, name: "Ayam Geprek", price: 15000, quantity: 2 },
    { id: 2, name: "Es Teh Manis", price: 5000, quantity: 1 },
    { id: 3, name: "Ayam Geprek", price: 15000, quantity: 2 },
    { id: 4, name: "Es Teh Manis", price: 5000, quantity: 1 },
    { id: 7, name: "Ayam Geprek", price: 15000, quantity: 2 },
    { id: 8, name: "Es Teh Manis", price: 5000, quantity: 1 },
  ]);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Customer>({ id: 0, name: "", phone: "", address: "" });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  const totalPrice = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Pilih pelanggan lama
  const handleSelectCustomer = (id: number) => {
    const customer = customers.find(c => c.id === id);
    if (customer) setSelectedCustomer(customer);
  };

  // Tambah pelanggan baru
  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
      setSelectedCustomer(newCustomer);
      setShowCustomerForm(false);
      setNewCustomer({ id: 0, name: "", phone: "", address: "" });
    }
  };

  // Filter pelanggan berdasarkan searchTerm
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="-4 md:p-6 lg:p-8 bg-gray-100 flex flex-col gap-6 h-screen">
        <HeadPage icon={<CreditCard size={32} color="#ffffff" weight="fill" />} title="Pembayaran" deskrip="Konfirmasi pembayaran transaksi" />
        <div className="gap-6 grid grid-cols-2 h-screen">
          {/* Pesanan di Kiri */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
            <TitlePage title="Pesanan" />
            <div className="flex flex-col h-[90%]">
              <div className="flex-grow overflow-hidden relative">
                <div className="max-h-[490px] overflow-y-auto">
                  <table className="w-full border-collapse border">
                    <thead className="sticky -top-1 bg-gray-200 shadow">
                      <tr>
                        <th className="border p-2">Nama Produk</th>
                        <th className="border p-2">Qty</th>
                        <th className="border p-2">Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="border p-2">{order.name}</td>
                          <td className="border p-2">{order.quantity}</td>
                          <td className="border p-2">Rp {order.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 text-xl font-semibold flex justify-between border-t-2 border-gray-200 pt-4">
                <span>Total Harga:</span>
                <span>Rp {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Pembayaran di Kanan */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
            {/* <h2 className="text-lg font-semibold mb-2">Pilih Pelanggan</h2> */}
            <TitlePage title="Pilih Pelanggan"/>
            <input 
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder="Cari pelanggan berdasarkan nama"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && filteredCustomers.length > 0 && (
              <ul className="max-h-40 overflow-y-auto border mt-2 rounded-lg p-2">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleSelectCustomer(customer.id)}
                  >
                    {customer.name} - {customer.phone}
                  </li>
                ))}
              </ul>
            )}
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 mt-4"
              onClick={() => setShowCustomerForm(true)}
            >
              <UserPlus size={20} /> Tambah Pelanggan Baru
            </button>
            {selectedCustomer && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-2 font-semibold w-32">Nama</td>
                      <td>:</td>
                      <td className="py-2">{selectedCustomer.name}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold w-32">Telepon</td>
                      <td>:</td>
                      <td className="py-2">{selectedCustomer.phone}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold w-32">Alamat</td>
                      <td>:</td>
                      <td className="py-2">{selectedCustomer.address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <h2 className="text-lg font-semibold mt-4">Total Bayar</h2>
            <input type="number" className="w-full p-2 border rounded mb-2" placeholder="Masukkan jumlah uang" onChange={(e) => setAmountPaid(Number(e.target.value))} />
            <p className="text-gray-600 mb-4">Kembalian: <span className="font-bold">Rp {(amountPaid - totalPrice).toLocaleString()}</span></p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600">
              Konfirmasi Pembayaran
            </button>
            <button className="mt-2 bg-red-400 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600">
              Batalkan Pembayaran
            </button>
          </div>
        </div>
      </div>

      {showCustomerForm && (
          <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-96 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-8 relative overflow-hidden rounded-xl">
              <Users size={48} className="mx-auto text-blue-400 mb-5" />
              <div>
                <label>Nama Pelanggan</label>
                <input className="w-full p-2 border border-stone-400 rounded outline-none" type="text" />
              </div>             
              <div>
                <label>Alamat</label>
                <textarea className="w-full p-2 border border-stone-400 rounded outline-none" name="" id=""></textarea>
              </div>             
              <div>
                <label>No Telp</label>
                <input className="w-full p-2 border rounded outline-none" type="number" />
              </div>
              <button className="mx-auto mt-8 px-6 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={() => setShowCustomerForm(false)}>
                Batal
              </button>
              <button className="mx-auto mt-8 px-6 py-2 flex items-center justify-center bg-blue-400 rounded-2xl font-[600] text-white hover:translate-x-[-0.04rem] hover:translate-y-[-0.04rem] hover:shadow-blue-500 hover:shadow-md active:translate-x-[0.04rem] active:translate-y-[0.04rem] active:shadow-sm" onClick={handleAddCustomer} >
                Tambah
              </button>
            </div>
          </div>
          </>
        )}
    </>
  );
};

export default PaymentPage;
