"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ChartData = {
  day?: string;
  week?: string;
  month?: string;
  amount: number;
};

const Grafik = () => {
  const [filter, setFilter] = useState("daily");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    // Fetch data based on the selected filter
    const fetchData = async () => {
      let data: ChartData[];
      switch (filter) {
        case "daily":
          data = await fetchDailyData();
          setSubtitle(`Minggu ke-${getWeekNumber(new Date())} ${getMonthName(new Date())} ${new Date().getFullYear()}`);
          break;
        case "monthly":
          data = await fetchMonthlyData();
          setSubtitle(`${getMonthName(new Date())} ${new Date().getFullYear()}`);
          break;
        case "yearly":
          data = await fetchYearlyData();
          setSubtitle(`Tahun ${new Date().getFullYear()}`);
          break;
        default:
          data = [];
      }
      setChartData(data);
    };

    fetchData();
  }, [filter]);

  const fetchDailyData = async () => {
    // Fetch daily data (last 7 days)
    const response = await fetch("/api/transaksi");
    const transaksiData = await response.json();
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(date => {
      const dayTransactions = transaksiData.data.filter((trans: { waktuTransaksi: string }) => new Date(trans.waktuTransaksi).toDateString() === date.toDateString());
      const totalAmount = dayTransactions.reduce((total: number, trans: { totalHarga: number }) => total + trans.totalHarga, 0);
      return { day: date.toLocaleDateString("id-ID", { weekday: "short" }), amount: totalAmount };
    });
  };

  const fetchMonthlyData = async () => {
    // Fetch monthly data (last 4 weeks)
    const response = await fetch("/api/transaksi");
    const transaksiData = await response.json();
    const today = new Date();
    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i * 7);
      return date;
    }).reverse();

    return last4Weeks.map(date => {
      const weekTransactions = transaksiData.data.filter((trans: { waktuTransaksi: string }) => {
        const transDate = new Date(trans.waktuTransaksi);
        return transDate >= date && transDate < new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      });
      const totalAmount = weekTransactions.reduce((total: number, trans: { totalHarga: number }) => total + trans.totalHarga, 0);
      return { week: `${date.getDate()}-${new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000).getDate()}/${date.getMonth() + 1}`, amount: totalAmount };
    });
  };

  const fetchYearlyData = async () => {
    // Fetch yearly data (last 12 months)
    const response = await fetch("/api/transaksi");
    const transaksiData = await response.json();
    const today = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      return date;
    }).reverse();

    return last12Months.map(date => {
      const monthTransactions = transaksiData.data.filter((trans: { waktuTransaksi: string }) => new Date(trans.waktuTransaksi).getMonth() === date.getMonth());
      const totalAmount = monthTransactions.reduce((total: number, trans: { totalHarga: number }) => total + trans.totalHarga, 0);
      return { month: date.toLocaleDateString("id-ID", { month: "short" }), amount: totalAmount };
    });
  };

  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("id-ID", { month: "long" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="bg-blue-300 w-[70px] h-1 mb-[6px]"></div>
        <CardTitle>Grafik Pendapatan</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <select
            className="p-2 border rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="daily">Harian</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={filter === "daily" ? "day" : filter === "monthly" ? "week" : "month"} />
            <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export { Grafik };
