"use client";

import { useState, useCallback } from "react";
import RoomJoin from "@/components/room/RoomJoin";
import RemoteControl from "@/components/remote/RemoteControl";
import { usePartyConnection } from "@/hooks/usePartyConnection";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

interface RemoteSettings {
  flipSpeed: number;
  staggerDelay: number;
  rotationInterval: number;
  volume: number;
  isMuted: boolean;
  theme: "dark" | "light";
}

const DEFAULT_SETTINGS: RemoteSettings = {
  flipSpeed: 160,
  staggerDelay: 20,
  rotationInterval: 15,
  volume: 0.7,
  isMuted: false,
  theme: "dark",
};

export default function RemotePage() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [settings, setSettings] = useState<RemoteSettings>(DEFAULT_SETTINGS);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { setTheme } = useTheme();

  const handleConnect = useCallback((code: string) => {
    setIsConnecting(true);
    setError(null);
    setRoomCode(code);
  }, []);

  const { isConnected, connectedDevices, send, disconnect } = usePartyConnection(
    roomCode,
    false,
    {
      onStateSync: (state) => {
        setIsConnecting(false);
        if (state.settings) {
          const s = state.settings as RemoteSettings;
          setSettings(s);
          if (s.theme) setTheme(s.theme);
        }
      },
      onSettingsChange: (incoming) => {
        setSettings((prev) => ({ ...prev, ...incoming }));
        if (incoming.theme) setTheme(incoming.theme as "dark" | "light");
      },
    }
  );

  const handleDisconnect = useCallback(() => {
    disconnect();
    setRoomCode(null);
    setIsConnecting(false);
  }, [disconnect]);

  return (
    <>
      {/* Back button — top left */}
      <a
        href="/"
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 30,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fg)",
          textDecoration: "none",
          opacity: 0.5,
          transition: "opacity 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        title="Back to home"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </a>

      {/* Theme toggle — top right */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 30,
          opacity: 0.6,
          transition: "opacity 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        <ThemeToggle />
      </div>

      {isConnected ? (
        <RemoteControl
          settings={settings}
          roomCode={roomCode!}
          connectedDevices={connectedDevices}
          onSendMessage={send}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <RoomJoin
          onConnect={handleConnect}
          isConnecting={isConnecting}
          error={error}
        />
      )}
    </>
  );
}
