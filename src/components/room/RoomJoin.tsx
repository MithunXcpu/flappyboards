"use client";

import { useState, useRef, useCallback } from "react";

interface RoomJoinProps {
  onConnect: (code: string) => void;
  isConnecting: boolean;
  error: string | null;
}

export default function RoomJoin({ onConnect, isConnecting, error }: RoomJoinProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;

      const next = [...digits];
      next[index] = value;
      setDigits(next);

      // Auto-advance
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-connect when all filled
      if (value && index === 3 && next.every((d) => d)) {
        onConnect(next.join(""));
      }
    },
    [digits, onConnect]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
      if (text.length === 4) {
        const next = text.split("");
        setDigits(next);
        onConnect(text);
      }
    },
    [onConnect]
  );

  const code = digits.join("");
  const isComplete = code.length === 4;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: "0 24px",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--text)",
          margin: 0,
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        FLAPPYBOARDS
      </p>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          margin: 0,
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        REMOTE
      </p>

      <div style={{ height: 1, width: 40, background: "var(--divider)", margin: "8px 0" }} />

      <p
        style={{
          fontSize: 8,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-subtle)",
          margin: 0,
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        ENTER ROOM CODE
      </p>

      <div style={{ display: "flex", gap: 12 }} onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{
              width: 48,
              height: 56,
              textAlign: "center",
              fontSize: 24,
              fontWeight: 600,
              fontFamily: "var(--font-geist-mono)",
              color: "var(--text)",
              background: "var(--tag-bg)",
              border: "1px solid var(--border)",
              borderRadius: 2,
              outline: "none",
              caretColor: "var(--fg)",
            }}
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && (
        <p
          style={{
            fontSize: 8,
            letterSpacing: "0.1em",
            color: "#e55",
            margin: 0,
            fontFamily: "var(--font-geist-mono)",
            textTransform: "uppercase",
          }}
        >
          {error}
        </p>
      )}

      <button
        onClick={() => isComplete && onConnect(code)}
        disabled={!isComplete || isConnecting}
        style={{
          padding: "10px 32px",
          fontSize: 8,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "var(--font-geist-mono)",
          background: isComplete ? "var(--fg)" : "var(--tag-bg)",
          color: isComplete ? "var(--bg)" : "var(--text-subtle)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          cursor: isComplete ? "pointer" : "default",
          transition: "all 200ms ease",
          opacity: isConnecting ? 0.5 : 1,
        }}
      >
        {isConnecting ? "CONNECTING..." : "CONNECT"}
      </button>
    </div>
  );
}
