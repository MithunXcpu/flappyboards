"use client";

import { create } from "zustand";
import PartySocket from "partysocket";

interface RoomStore {
  roomCode: string | null;
  isHost: boolean;
  isConnected: boolean;
  connectedDevices: number;
  socket: PartySocket | null;

  generateRoomCode: () => string;
  connect: (roomCode: string, isHost: boolean) => void;
  disconnect: () => void;
  sendMessage: (msg: object) => void;
}

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export const useRoomStore = create<RoomStore>()((set, get) => ({
  roomCode: null,
  isHost: false,
  isConnected: false,
  connectedDevices: 0,
  socket: null,

  generateRoomCode: () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    set({ roomCode: code });
    return code;
  },

  connect: (roomCode: string, isHost: boolean) => {
    const existing = get().socket;
    if (existing) {
      existing.close();
    }

    const socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomCode,
    });

    socket.addEventListener("open", () => {
      set({ isConnected: true, roomCode, isHost, socket });
      if (isHost) {
        socket.send(JSON.stringify({ type: "register-host" }));
      }
    });

    socket.addEventListener("close", () => {
      set({ isConnected: false });
    });

    socket.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "client-count") {
          set({ connectedDevices: msg.payload });
        }
      } catch {
        // ignore parse errors — other handlers will process
      }
    });

    set({ socket, roomCode, isHost });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
    }
    set({
      socket: null,
      roomCode: null,
      isHost: false,
      isConnected: false,
      connectedDevices: 0,
    });
  },

  sendMessage: (msg: object) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  },
}));
