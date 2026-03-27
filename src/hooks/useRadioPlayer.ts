"use client";

import { useRef, useEffect, useCallback } from "react";
import { useMusicStore } from "@/stores/music-store";

export function useRadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, radioStation, musicVolume, setPlaying } = useMusicStore();

  // Create audio element on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && radioStation?.url) {
      if (audio.src !== radioStation.url) {
        audio.src = radioStation.url;
      }
      audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, radioStation, setPlaying]);

  const play = useCallback(
    (stationUrl?: string) => {
      if (stationUrl && audioRef.current) {
        audioRef.current.src = stationUrl;
      }
      setPlaying(true);
    },
    [setPlaying]
  );

  const pause = useCallback(() => {
    setPlaying(false);
  }, [setPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setPlaying(false);
  }, [setPlaying]);

  return { play, pause, stop, isPlaying };
}
