"use client";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Building,
  Home,
  MapPin,
  Navigation,
  Phone,
  Search,
  User,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const CheckOut = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [address, setAddress] = useState({
    fullname: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.log("location err", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ 
        ...prev, 
        fullname: userData?.name || "",
        mobile: userData?.mobile || "" 
      }));
    }
  }, [userData]);

  const DragableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position as LatLngExpression, 15, { animate: true });
      }
    }, [position, map]);

    return (
      <Marker
        icon={markerIcon}
        position={position as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    );
  };

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullname}
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullname: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullAddress}
                placeholder="full address"
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.city}
                  placeholder="city"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.state}
                  placeholder="state"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.pincode}
                  placeholder="pincode"
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />

              <button className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium">
                Search
              </button>
            </div>
            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position && (
                <MapContainer
                  center={position}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="h-full w-full z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <DragableMarker />
                </MapContainer>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckOut;