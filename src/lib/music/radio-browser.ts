export interface RadioStation {
  name: string;
  url: string;
  genre: string;
  country: string;
  favicon: string;
  bitrate: number;
  stationuuid: string;
}

const BASE_URL = "https://de1.api.radio-browser.info/json";

interface RawStation {
  name: string;
  url_resolved: string;
  tags: string;
  country: string;
  favicon: string;
  bitrate: number;
  stationuuid: string;
}

function mapStation(raw: RawStation): RadioStation {
  return {
    name: raw.name.trim(),
    url: raw.url_resolved,
    genre: raw.tags?.split(",")[0]?.trim() || "Various",
    country: raw.country,
    favicon: raw.favicon,
    bitrate: raw.bitrate,
    stationuuid: raw.stationuuid,
  };
}

export async function searchStations(
  query: string,
  limit = 20
): Promise<RadioStation[]> {
  const res = await fetch(
    `${BASE_URL}/stations/byname/${encodeURIComponent(query)}?limit=${limit}&order=clickcount&reverse=true&hidebroken=true`,
    { headers: { "User-Agent": "FlappyBoards/1.0" } }
  );
  if (!res.ok) return [];
  const data: RawStation[] = await res.json();
  return data.filter((s) => s.url_resolved?.startsWith("https://")).map(mapStation);
}

export async function getStationsByGenre(
  genre: string,
  limit = 20
): Promise<RadioStation[]> {
  const res = await fetch(
    `${BASE_URL}/stations/bytag/${encodeURIComponent(genre)}?limit=${limit}&order=clickcount&reverse=true&hidebroken=true`,
    { headers: { "User-Agent": "FlappyBoards/1.0" } }
  );
  if (!res.ok) return [];
  const data: RawStation[] = await res.json();
  return data.filter((s) => s.url_resolved?.startsWith("https://")).map(mapStation);
}

export async function getPopularStations(
  limit = 20
): Promise<RadioStation[]> {
  const res = await fetch(
    `${BASE_URL}/stations/topclick/${limit}?hidebroken=true`,
    { headers: { "User-Agent": "FlappyBoards/1.0" } }
  );
  if (!res.ok) return [];
  const data: RawStation[] = await res.json();
  return data.filter((s) => s.url_resolved?.startsWith("https://")).map(mapStation);
}

export const GENRE_PRESETS = [
  "lofi",
  "ambient",
  "jazz",
  "classical",
  "chillout",
  "electronic",
  "indie",
  "soul",
  "blues",
  "rock",
];
