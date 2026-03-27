"use client";

import { useCastSession } from "@/hooks/useCastSession";

interface CastButtonProps {
  tvUrl: string;
  style?: React.CSSProperties;
}

export default function CastButton({ tvUrl, style }: CastButtonProps) {
  const { isAvailable, isConnected, startCasting, stopCasting } = useCastSession();

  if (!isAvailable) return null;

  return (
    <button
      onClick={() => (isConnected ? stopCasting() : startCasting(tvUrl))}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        fontSize: 8,
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontFamily: "var(--font-geist-mono)",
        background: isConnected ? "var(--fg)" : "var(--tag-bg)",
        color: isConnected ? "var(--bg)" : "var(--text-muted)",
        border: "1px solid var(--border)",
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 200ms ease",
        ...style,
      }}
    >
      {/* Cast icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
        <line x1="2" y1="20" x2="2.01" y2="20" />
      </svg>
      {isConnected ? "STOP CASTING" : "CAST TO TV"}
    </button>
  );
}
