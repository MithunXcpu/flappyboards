"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRoomStore } from "@/stores/room-store";

interface RoomSettings {
  flipSpeed?: number;
  staggerDelay?: number;
  rotationInterval?: number;
  volume?: number;
  isMuted?: boolean;
  theme?: "dark" | "light";
}

interface ConnectionHandlers {
  onSettingsChange?: (settings: RoomSettings) => void;
  onContentChange?: (lines: string[]) => void;
  onSkip?: () => void;
  onStateSync?: (state: {
    settings: RoomSettings;
    currentContent: { lines: string[] } | null;
    musicState: unknown;
    connectedClients: number;
  }) => void;
  onMusicUpdate?: (state: unknown) => void;
}

export function usePartyConnection(
  roomCode: string | null,
  isHost: boolean,
  handlers: ConnectionHandlers
) {
  const { connect, disconnect, sendMessage, isConnected, connectedDevices, socket } =
    useRoomStore();
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // Connect on mount
  useEffect(() => {
    if (!roomCode) return;
    connect(roomCode, isHost);
    return () => {
      disconnect();
    };
  }, [roomCode, isHost, connect, disconnect]);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    const handler = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        const h = handlersRef.current;

        switch (msg.type) {
          case "settings-changed":
            h.onSettingsChange?.(msg.payload);
            break;
          case "content-changed":
            h.onContentChange?.(msg.payload.lines);
            break;
          case "skip":
            h.onSkip?.();
            break;
          case "state-sync":
            h.onStateSync?.(msg.payload);
            break;
          case "music-update":
            h.onMusicUpdate?.(msg.payload);
            break;
        }
      } catch {
        // ignore
      }
    };

    socket.addEventListener("message", handler);
    return () => {
      socket.removeEventListener("message", handler);
    };
  }, [socket]);

  const send = useCallback(
    (msg: object) => {
      sendMessage(msg);
    },
    [sendMessage]
  );

  return { isConnected, connectedDevices, send, disconnect };
}
