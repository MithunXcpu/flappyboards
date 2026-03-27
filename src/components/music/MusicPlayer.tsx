"use client";

import { useState, useEffect, useRef } from "react";
import { useMusicStore } from "@/stores/music-store";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";

export default function MusicPlayer() {
  const { source, isPlaying, currentTrack } = useMusicStore();
  const { play, pause } = useRadioPlayer();
  const [opacity, setOpacity] = useState(0.6);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const resetFade = () => {
      setOpacity(0.6);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpacity(0.15), 8000);
    };

    resetFade();
    window.addEventListener("mousemove", resetFade);
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", resetFade);
    };
  }, []);

  if (source === "off") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 38,
        right: 26,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        background: "none",
        border: "none",
        padding: 0,
        opacity,
        transition: "opacity 1s ease",
        cursor: "default",
      }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0.6)}
    >
      {/* Play/Pause */}
      <button
        onClick={() => (isPlaying ? pause() : play())}
        style={{
          width: 24,
          height: 24,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          fontSize: 12,
        }}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      {/* Track info */}
      {currentTrack && (
        <div style={{ maxWidth: 160, overflow: "hidden" }}>
          <p
            style={{
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--text)",
              margin: 0,
              fontFamily: "var(--font-geist-mono)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack.title}
          </p>
          <p
            style={{
              fontSize: 7,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: "2px 0 0",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {currentTrack.artist}
          </p>
        </div>
      )}
    </div>
  );
}
