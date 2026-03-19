"use client";

import { getSocket } from "@/lib/socket";
import axios from "axios";
import { useEffect, useState } from "react";

function DeliveryBoyDashBoard() {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await axios.get("/api/delivery/get-assignments");

        setAssignments(result.data.assignments); // ✅ FIX

        console.log(result.data.assignments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket?.on("new-assignment", (DeliveryAssignment) => {
      setAssignments((prev) => [...prev, DeliveryAssignment]);
    });
    return () => {
      socket?.off("new-assignment");
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-[120px] mb-[30px]">
          Delivery Assignments
        </h2>

        {assignments.length === 0 && (
          <p className="text-center text-gray-500">No assignments available</p>
        )}

        {assignments.map((a) => (
          <div
            key={a._id}
            className="p-5 bg-white rounded-xl shadow mb-4 border"
          >
            <p>
              Order ID <b>#{a.order?._id?.slice(-6)}</b>
            </p>

            <p className="text-gray-600">{a.order?.address?.fullAddress}</p>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                Accept
              </button>

              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryBoyDashBoard;
