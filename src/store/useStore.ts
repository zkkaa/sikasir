// /src/store/useStore.ts
import { create } from "zustand";

// Struktur data pesanan
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Struktur untuk store
interface Store {
  orders: OrderItem[];
  setOrders: (orders: OrderItem[]) => void; // Fungsi untuk mengupdate pesanan
}

// Membuat store Zustand
export const useStore = create<Store>((set) => ({
  orders: [], // Data pesanan dimulai dengan array kosong
  setOrders: (orders) => set({ orders }), // Fungsi untuk menyimpan data pesanan
}));
