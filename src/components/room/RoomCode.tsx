"use client";

import { useState, useEffect, useRef } from "react";

interface RoomCodeProps {
  code: string;
  connectedDevices: number;
}

export default function RoomCode({ code, connectedDevices }: RoomCodeProps) {
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const resetFade = () => {
      setOpacity(1);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpacity(0.15), 10000);
    };

    resetFade();
    window.addEventListener("mousemove", resetFade);
    window.addEventListener("touchstart", resetFade);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", resetFade);
      window.removeEventListener("touchstart", resetFade);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 20,
        opacity,
        transition: "opacity 1s ease",
      }}
    >
      <p
        style={{
          fontSize: 8,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--tile-text)",
          margin: "0 0 6px",
          fontFamily: "var(--font-geist-mono)",
          opacity: 0.5,
        }}
      >
        ROOM CODE
      </p>
      <p
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.3em",
          color: "var(--tile-text)",
          margin: 0,
          fontFamily: "var(--font-geist-mono)",
          opacity: 0.8,
        }}
      >
        {code}
      </p>
      {connectedDevices > 1 && (
        <p
          style={{
            fontSize: 8,
            letterSpacing: "0.1em",
            color: "var(--tile-text)",
            margin: "6px 0 0",
            fontFamily: "var(--font-geist-mono)",
            opacity: 0.4,
          }}
        >
          {connectedDevices} CONNECTED
        </p>
      )}
    </div>
  );
}
