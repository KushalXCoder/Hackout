"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Waves } from "lucide-react";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setLastUpdated(
        now.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(connectionInterval);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-blue-950/80 backdrop-blur-md border-b border-white/10 px-6 py-4 md:px-10 shadow-md"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 shadow-inner">
            <Waves className="w-7 h-7 text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Coastal Early Warning
            </h1>
            <p className="text-sm text-blue-200/80">
              Real-time Maritime Safety Monitoring
            </p>
          </div>
        </div>

        {/* Status + Time */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
          {/* Connection Status */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium shadow-inner"
            animate={{
              backgroundColor: isConnected
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",
            }}
          >
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span
              className={isConnected ? "text-green-400" : "text-red-400"}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </motion.div>

          {/* Time */}
          <div className="text-right">
            <div className="text-lg font-semibold text-white">
              {currentTime}
            </div>
            <div className="text-xs text-blue-200/70">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;