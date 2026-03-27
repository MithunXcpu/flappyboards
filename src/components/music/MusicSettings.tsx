"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMusicStore } from "@/stores/music-store";
import {
  initiateSpotifyAuth,
  exchangeCodeForToken,
  storeTokens,
  clearTokens,
  isAuthenticated,
} from "@/lib/music/spotify-auth";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import StationPicker from "./StationPicker";

export default function MusicSettings() {
  const { source, setSource, musicVolume, setMusicVolume } = useMusicStore();
  const searchParams = useSearchParams();
  const { isReady, disconnect: disconnectPlayer } = useSpotifyPlayer();

  // Handle Spotify OAuth callback code
  useEffect(() => {
    const code = searchParams.get("spotify_code");
    if (!code) return;

    const redirectUri = `${window.location.origin}/api/spotify/callback`;
    exchangeCodeForToken(code, redirectUri)
      .then((data) => {
        storeTokens(data.access_token, data.refresh_token, data.expires_in);
        // Clean URL
        window.history.replaceState({}, "", "/display");
      })
      .catch(() => {
        // Auth failed
      });
  }, [searchParams]);

  const handleSpotifyLogin = () => {
    const redirectUri = `${window.location.origin}/api/spotify/callback`;
    initiateSpotifyAuth(redirectUri);
  };

  const handleSpotifyLogout = () => {
    disconnectPlayer();
    clearTokens();
  };

  const authenticated = isAuthenticated();

  return (
    <div>
      {/* Source toggle */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {(["off", "radio", "spotify"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSource(s)}
            style={{
              flex: 1,
              padding: "6px 0",
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-geist-mono)",
              background: source === s ? "var(--fg)" : "var(--tag-bg)",
              color: source === s ? "var(--bg)" : "var(--text-subtle)",
              border: "1px solid var(--border)",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Radio station picker */}
      {source === "radio" && <StationPicker />}

      {/* Spotify */}
      {source === "spotify" && (
        <div>
          {!authenticated ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={handleSpotifyLogin}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  fontSize: 8,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-geist-mono)",
                  background: "#1DB954",
                  color: "#000",
                  border: "none",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "opacity 200ms ease",
                }}
              >
                LOGIN WITH SPOTIFY
              </button>
              <p
                style={{
                  fontSize: 7,
                  color: "var(--text-subtle)",
                  margin: 0,
                  fontFamily: "var(--font-geist-mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  opacity: 0.6,
                }}
              >
                REQUIRES SPOTIFY PREMIUM
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-geist-mono)",
                    color: "#1DB954",
                  }}
                >
                  {isReady ? "CONNECTED" : "CONNECTING..."}
                </span>
                <button
                  onClick={handleSpotifyLogout}
                  style={{
                    fontSize: 7,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-geist-mono)",
                    padding: "3px 8px",
                    background: "none",
                    color: "var(--text-subtle)",
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                >
                  LOG OUT
                </button>
              </div>
              <p
                style={{
                  fontSize: 7,
                  color: "var(--text-subtle)",
                  margin: 0,
                  fontFamily: "var(--font-geist-mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                }}
              >
                {isReady
                  ? "PLAY MUSIC IN SPOTIFY TO START"
                  : "INITIALIZING PLAYBACK SDK..."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Music volume (when any source active) */}
      {source !== "off" && (
        <div style={{ marginTop: 12 }}>
          <p
            style={{
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: "0 0 8px",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            MUSIC VOLUME — {Math.round(musicVolume * 100)}%
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={musicVolume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
            style={{
              width: "100%",
              height: 2,
              appearance: "none",
              background: "var(--border)",
              borderRadius: 1,
              outline: "none",
              cursor: "pointer",
              accentColor: "var(--fg)",
            }}
          />
        </div>
      )}
    </div>
  );
}
