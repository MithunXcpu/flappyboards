"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TrackInfo {
  title: string;
  artist: string;
}

export interface RadioStation {
  name: string;
  url: string;
  genre: string;
  country: string;
  favicon: string;
}

interface MusicStore {
  source: "spotify" | "radio" | "off";
  isPlaying: boolean;
  currentTrack: TrackInfo | null;
  radioStation: RadioStation | null;
  musicVolume: number;

  setSource: (s: "spotify" | "radio" | "off") => void;
  setPlaying: (v: boolean) => void;
  setCurrentTrack: (t: TrackInfo | null) => void;
  setRadioStation: (s: RadioStation | null) => void;
  setMusicVolume: (v: number) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set) => ({
      source: "off",
      isPlaying: false,
      currentTrack: null,
      radioStation: null,
      musicVolume: 0.5,

      setSource: (source) => set({ source, isPlaying: false, currentTrack: null }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentTrack: (currentTrack) => set({ currentTrack }),
      setRadioStation: (radioStation) =>
        set({
          radioStation,
          currentTrack: radioStation
            ? { title: radioStation.name, artist: "Internet Radio" }
            : null,
        }),
      setMusicVolume: (musicVolume) => set({ musicVolume }),
    }),
    {
      name: "flappyboards-music",
      partialize: (state) => ({
        source: state.source,
        radioStation: state.radioStation,
        musicVolume: state.musicVolume,
      }),
    }
  )
);
