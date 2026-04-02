import {
  ArrowLeft,
  EyeIcon,
  EyeOff,
  Leaf,
  Loader,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import googleImage from "@/assets/google.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type propType = {
  prevStep: (s: number) => void;
};

const RegisterForm = ({ prevStep }: propType) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isFormValid =
    name.trim() !== "" && email.includes("@") && password.length >= 6;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      await signIn("credentials", {
      email,
      password,
      callbackUrl: "/", // direct home
    });

      router.push("/");
    } catch (error) {
      console.log(error)
    } 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      {/* Back Button */}
      <div
        onClick={() => prevStep(1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 cursor-pointer "
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </div>

      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Create Account
      </motion.h1>

      <p className="text-gray-400 mb-8 flex items-center gap-2">
        Join SnapCart Today <Leaf className="w-5 h-5 text-green-600" />
      </p>

      <motion.form
        onSubmit={handleRegister}
        className="flex flex-col gap-5 w-full max-w-sm"
      >
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl py-3 pl-10"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl py-3 pl-10"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 chars)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl py-3 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5"
          >
            {showPassword ? <EyeOff /> : <EyeIcon />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-3 rounded-xl font-semibold ${
            isFormValid
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          {loading ? <Loader className="animate-spin mx-auto" /> : "Register"}
        </button>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="flex-1 h-px bg-gray-200"></span>OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* Google */}
        <div
          onClick={() => signIn("google",{callbackUrl:"/"})}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl cursor-pointer"
        >
          <Image src={googleImage} width={20} height={20} alt="google" />
          Continue with Google
        </div>
      </motion.form>

      <p
        onClick={() => router.push("/login")}
        className="text-gray-600 mt-6 text-sm cursor-pointer flex items-center gap-1"
      >
        Already have an account?
        <span className="text-green-600 flex items-center gap-1">
          <LogIn className="w-4 h-4" /> Sign in
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
