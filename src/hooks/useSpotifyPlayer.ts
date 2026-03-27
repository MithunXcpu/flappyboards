"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getValidToken, isAuthenticated } from "@/lib/music/spotify-auth";
import { useMusicStore } from "@/stores/music-store";

declare global {
  interface Window {
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (state: unknown) => void) => void;
  removeListener: (event: string) => void;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getCurrentState: () => Promise<SpotifyPlaybackState | null>;
}

interface SpotifyPlaybackState {
  paused: boolean;
  track_window: {
    current_track: {
      name: string;
      artists: { name: string }[];
      album: { name: string };
    };
  };
}

export function useSpotifyPlayer() {
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const sdkLoadedRef = useRef(false);
  const {
    source,
    isPlaying,
    musicVolume,
    setPlaying,
    setCurrentTrack,
  } = useMusicStore();

  // Load SDK script
  useEffect(() => {
    if (source !== "spotify" || !isAuthenticated() || sdkLoadedRef.current) return;

    if (document.querySelector('script[src*="spotify-player"]')) {
      sdkLoadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
    sdkLoadedRef.current = true;
  }, [source]);

  // Initialize player when SDK is ready
  useEffect(() => {
    if (source !== "spotify" || !isAuthenticated()) return;

    const initPlayer = () => {
      if (playerRef.current) return;

      const player = new window.Spotify.Player({
        name: "FlappyBoards",
        getOAuthToken: async (cb) => {
          const token = await getValidToken();
          if (token) cb(token);
        },
        volume: musicVolume,
      });

      player.addListener("ready", (data: unknown) => {
        const { device_id } = data as { device_id: string };
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener("not_ready", () => {
        setIsReady(false);
        setDeviceId(null);
      });

      player.addListener("player_state_changed", (state: unknown) => {
        if (!state) return;
        const s = state as SpotifyPlaybackState;
        setPlaying(!s.paused);
        if (s.track_window?.current_track) {
          setCurrentTrack({
            title: s.track_window.current_track.name,
            artist: s.track_window.current_track.artists
              .map((a) => a.name)
              .join(", "),
          });
        }
      });

      player.connect();
      playerRef.current = player;
    };

    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
    }

    return () => {
      // Don't disconnect on every re-render, only on unmount
    };
  }, [source, musicVolume, setPlaying, setCurrentTrack]);

  // Volume sync
  useEffect(() => {
    playerRef.current?.setVolume(musicVolume);
  }, [musicVolume]);

  const togglePlay = useCallback(async () => {
    if (!playerRef.current) return;
    await playerRef.current.togglePlay();
  }, []);

  const skip = useCallback(async () => {
    if (!playerRef.current) return;
    await playerRef.current.nextTrack();
  }, []);

  const previous = useCallback(async () => {
    if (!playerRef.current) return;
    await playerRef.current.previousTrack();
  }, []);

  const disconnect = useCallback(() => {
    playerRef.current?.disconnect();
    playerRef.current = null;
    setIsReady(false);
    setDeviceId(null);
  }, []);

  return {
    isReady,
    isPlaying,
    deviceId,
    togglePlay,
    skip,
    previous,
    disconnect,
  };
}
