"use client";

import { useState, useEffect, useCallback } from "react";
import {
  searchStations,
  getPopularStations,
  GENRE_PRESETS,
  type RadioStation,
} from "@/lib/music/radio-browser";
import { useMusicStore } from "@/stores/music-store";

export default function StationPicker() {
  const [query, setQuery] = useState("");
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const { radioStation, setRadioStation, setPlaying } = useMusicStore();

  // Load popular stations on mount
  useEffect(() => {
    setLoading(true);
    getPopularStations(10).then((s) => {
      setStations(s);
      setLoading(false);
    });
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setActiveGenre(null);
    const results = await searchStations(query.trim(), 10);
    setStations(results);
    setLoading(false);
  }, [query]);

  const handleGenre = useCallback(async (genre: string) => {
    setLoading(true);
    setActiveGenre(genre);
    setQuery("");
    const { getStationsByGenre } = await import("@/lib/music/radio-browser");
    const results = await getStationsByGenre(genre, 10);
    setStations(results);
    setLoading(false);
  }, []);

  const selectStation = useCallback(
    (station: RadioStation) => {
      setRadioStation({
        name: station.name,
        url: station.url,
        genre: station.genre,
        country: station.country,
        favicon: station.favicon,
      });
      setPlaying(true);
    },
    [setRadioStation, setPlaying]
  );

  return (
    <div>
      {/* Search */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="SEARCH STATIONS..."
          style={{
            flex: 1,
            background: "var(--tag-bg)",
            border: "1px solid var(--border)",
            borderRadius: 2,
            padding: "6px 8px",
            fontSize: 8,
            fontFamily: "var(--font-geist-mono)",
            color: "var(--text)",
            letterSpacing: "0.04em",
            outline: "none",
            textTransform: "uppercase",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "6px 10px",
            fontSize: 8,
            fontFamily: "var(--font-geist-mono)",
            background: "var(--tag-bg)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: 2,
            cursor: "pointer",
            letterSpacing: "0.1em",
          }}
        >
          GO
        </button>
      </div>

      {/* Genre pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {GENRE_PRESETS.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenre(genre)}
            style={{
              padding: "3px 8px",
              fontSize: 7,
              fontFamily: "var(--font-geist-mono)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: activeGenre === genre ? "var(--fg)" : "var(--tag-bg)",
              color: activeGenre === genre ? "var(--bg)" : "var(--text-subtle)",
              border: "1px solid var(--border)",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Results */}
      <div
        style={{
          maxHeight: 160,
          overflowX: "hidden",
          overflowY: "auto",
          borderRadius: 2,
          border: stations.length ? "1px solid var(--border)" : "none",
        }}
      >
        {loading ? (
          <p
            style={{
              fontSize: 8,
              color: "var(--text-subtle)",
              padding: 10,
              margin: 0,
              fontFamily: "var(--font-geist-mono)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            LOADING...
          </p>
        ) : (
          stations.map((station) => {
            const isSelected = radioStation?.url === station.url;
            return (
              <button
                key={station.stationuuid}
                onClick={() => selectStation(station)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 10px",
                  background: isSelected ? "var(--fg)" : "transparent",
                  color: isSelected ? "var(--bg)" : "var(--text)",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 150ms",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 8,
                      fontWeight: 500,
                      margin: 0,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {station.name}
                  </p>
                  <p
                    style={{
                      fontSize: 7,
                      margin: "2px 0 0",
                      opacity: 0.6,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {station.genre} · {station.country}
                  </p>
                </div>
                {isSelected && (
                  <span style={{ fontSize: 8, opacity: 0.7 }}>&#9654;</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
