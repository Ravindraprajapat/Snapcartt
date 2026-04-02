"use client";

import axios from "axios";
import { ArrowRight, Bike, User, UserCog } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { set } from "mongoose";

const EditRoleMobile = () => {
  const [roles,setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");

  const router = useRouter();
  const { update } = useSession();

  const handleEditRole = async () => {
    if (!selectedRole) {
      alert("Please select role");
      return;
    }

    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });

      await update({ role: selectedRole });
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const checkForAdmin = async () => {
    try {
      const result = await axios.get("/api/check-for-admin");
     if(result.data.adminExist){
      setRoles(prev=>prev.filter(r=>r.id!=="admin"))
     }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForAdmin();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6 items-center w-full">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setSelectedRole(role.id)}
              className={`flex flex-col items-center justify-center border rounded-2xl w-48 h-48 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-green-600 bg-green-100 shadow-lg"
                    : "border-gray-300 hover:border-green-400"
                }`}
            >
              <Icon size={40} />
              <span className="mt-2 font-medium">{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center mt-10"
      >
        <label className="text-gray-700 font-medium mb-2">
          Enter your Mobile number
        </label>

        <input
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          inputMode="numeric"
          type="tel"
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          placeholder="XXXXXXXXXX"
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        disabled={!selectedRole || mobile.length !== 10}
        onClick={handleEditRole}
        className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 w-[200px] mt-7
          ${
            selectedRole && mobile.length === 10
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Go to Home <ArrowRight />
      </motion.button>
    </div>
  );
};

export default EditRoleMobile;
