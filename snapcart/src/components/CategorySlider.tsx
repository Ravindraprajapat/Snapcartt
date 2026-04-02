"use client";

import {
  Apple,
  Baby,
  Box,
  Coffee,
  Cookie,
  Flame,
  Heart,
  Home,
  Milk,
  Wheat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const CategorySlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
    { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
    { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
    { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
    { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
    { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
    { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
    { id: 8, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
    { id: 9, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
    { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
  ];

  // Manual Scroll
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = direction === "left" ? -300 : 300;

    scrollRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  // Auto Scroll
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (!scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // If reached end → reset
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        scrollRef.current.scrollBy({
          left: 300,
          behavior: "smooth",
        });
      }
    }, 2000);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <motion.div
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
        🛒 Shop by Category
      </h2>

      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hidden md:flex"
      >
        <ChevronLeft />
      </button>

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-10 pb-4 scroll-smooth scrollbar-hide"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex flex-col items-center justify-center p-5">
                <Icon className="w-10 h-10 text-green-700 mb-3" />
                <p className="text-center text-sm md:text-base font-semibold text-gray-700">
                  {cat.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hidden md:flex"
      >
        <ChevronRight />
      </button>
    </motion.div>
  );
};

export default CategorySlider;


// "use client";

// import {
//   Apple,
//   Baby,
//   Box,
//   Coffee,
//   Cookie,
//   Flame,
//   Heart,
//   Home,
//   Milk,
//   Wheat,
// } from "lucide-react";
// import { motion } from "framer-motion";

// const CategorySlider = () => {
//   const categories = [
//     { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
//     { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
//     { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
//     { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
//     { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
//     { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
//     { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
//     { id: 8, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
//     { id: 9, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
//     { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
//   ];

//   return (
//     <motion.div
//       className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       viewport={{ once: true }}
//     >
//       <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
//         🛒 Shop by Category
//       </h2>

//       <div className="flex gap-6 overflow-x-auto px-4 pb-4 scroll-smooth">
//         {categories.map((cat) => {
//           const Icon = cat.icon;

//           return (
//             <motion.div
//               key={cat.id}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
//             >
//               <div className="flex flex-col items-center justify-center p-5">
//                 <Icon className="w-10 h-10 text-green-700 mb-3" />
//                 <p className="text-center text-sm md:text-base font-semibold text-gray-700">
//                   {cat.name}
//                 </p>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </motion.div>
//   );
// };

// export default CategorySlider;
