'use client'
import { ArrowLeft, EyeIcon, EyeOff, Leaf, Loader, Lock, LogIn, Mail, User } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { motion } from "framer-motion"; 
import Image from "next/image";
import googleImage from "@/assets/google.png"
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const[loading,setLoading] = useState(false)
  const isFormValid = email.includes("@") && password.length >= 6;
  const router = useRouter()
   const session = useSession()
  console.log(session)
  const handleLogin = async (e:FormEvent)=>{
    e.preventDefault()
    setLoading(true)
    try {
      await signIn("credentials",{
        email,password
      },)
     router.push("/")
      setLoading(false)
    } catch (error) {
       setLoading(false)
       console.log(error)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      {/* Back Button */}
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome back!
      </motion.h1>

      <p className="text-gray-400 mb-8 flex flex-row items-center gap-2">
        login to SnapCart<Leaf className="w-5 h-5 text-green-600" />
      </p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleLogin}
        className="flex flex-col gap-5 w-full max-w-sm"
      >

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="button"
            className="absolute right-3 top-3.5"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Action Button */}
        <button
          disabled={!isFormValid}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
            isFormValid
              ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading?<Loader className="w-5 h-5 animate-spin"/>:"Log in"}
        </button>

      <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
        <span className="flex-1 h-px bg-gray-200"></span>
        OR
       <span className="flex-1 h-px bg-gray-200"></span>
      </div>

      <div
      onClick={()=>signIn("google",{callbackUrl:"/"})}
       className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer">
     <Image src={googleImage} width={20} height={20} alt="google"/>
     Continue With Google
      </div>

      </motion.form>
      <p 
       onClick={()=>router.push("/register")}
      className="text-gray-600 mt-6 text-sm flex items-center gap-1  cursor-pointer">want to  an account ? <LogIn className="w-4 h-4"/> <span className="text-green-600">Sign Up</span> </p>
    </div>
  );
};

export default Login;