"use client";

import { useState, useEffect } from "react";

export default function LiveClock({ className }: { className?: string }) {
    const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(formatted);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
   <div
  className={`font-apple ${className ?? ""}`}
  style={{
    fontSize: "14px",
    fontWeight: 500,
    color: "#888",
    letterSpacing: "0.02em",
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  }}
>
      <span style={{ color: "#FF6600", fontVariantNumeric: "tabular-nums" }}> 
        {time}
      </span>
      <span style={{ margin: "0 4px", color: "#ccc" }}>·</span>
      <span>GMT+5:30</span>
      <span style={{ margin: "0 4px", color: "#ccc" }}>·</span>
      <span>Nagpur, India</span>
    </div>
  );
}