"use client";
import AdminOrderCard from "@/components/AdminOrderCard";
import { Iorder } from "@/models/orderModel";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ManageOrder() {
  const router = useRouter();
  const [orders, setOrders] = useState<Iorder[]>();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
          <button
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={24} className="text-green-700" />
          </button>

          <h1 className="text-xl font-bold text-gray-800">Manage Orders</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8">
        <div className="space-y-6">
          {orders?.map((order, index) => (
            <AdminOrderCard order={order} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageOrder;
