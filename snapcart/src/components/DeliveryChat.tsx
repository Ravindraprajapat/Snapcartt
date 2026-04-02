"use client";
import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/messageModel";
import axios from "axios";
import mongoose from "mongoose";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, motion } from "motion/react";
import { Loader, Send, Sparkle } from "lucide-react";
import { tr } from "motion/react-client";

type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

const DeliveryChat = ({ orderId, deliveryBoyId }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);

    socket.on("send-message", (message) => {
      if (message.roomId.toString() === orderId.toString()) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("send-message");
    };
  }, [orderId]);

  const sendMsg = () => {
    const socket = getSocket();
    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);

    setNewMessage("");
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        console.log(result.data);
        setMessages(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessages();
  }, []);

 const getSuggestion = async () =>{
  setLoading(true)
  try {

    const lastMessage = messages?.filter(m=>m.senderId!==deliveryBoyId).at(-1)
    const result = await axios.post("/api/chat/ai-suggestions",{message:lastMessage?.text,role:"delivery-boy"})
    console.log(result.data)
    setSuggestions(result.data)
    setLoading(false)
  } catch (error) {
    setLoading(false)
    console.log(error)
  }
 }

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700 text-sm">
          Quick Replies
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={loading}
          onClick={getSuggestion}
          className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200"
        >
          <Sparkle size={14} /> {loading ? <Loader className="w-5 h-5 animate-spin"/> : "AI suggest "}
        </motion.button>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {suggestions.map((s, i) => (
          <motion.div
            key={s}
            whileTap={{ scale: 0.92 }}
            className=" cursor-pointer px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full"
            onClick={() => setNewMessage(s)}
          >
            {s}
          </motion.div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3" ref={chatBoxRef}>
        <AnimatePresence>
          {messages?.map((msg, index) => (
            <motion.div
              key={msg._id?.toString() || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${
                msg.senderId === deliveryBoyId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${
                  msg.senderId === deliveryBoyId
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          placeholder="Type a Message..."
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMsg}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;
