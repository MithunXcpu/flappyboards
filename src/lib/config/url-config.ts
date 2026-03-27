export interface TVConfig {
  theme: "dark" | "light";
  flipSpeed: number;
  staggerDelay: number;
  rotationInterval: number;
  volume: number;
  isMuted: boolean;
}

const DEFAULTS: TVConfig = {
  theme: "dark",
  flipSpeed: 160,
  staggerDelay: 20,
  rotationInterval: 15,
  volume: 0.7,
  isMuted: false,
};

export function encodeConfig(config: Partial<TVConfig>): string {
  const merged = { ...DEFAULTS, ...config };
  const json = JSON.stringify(merged);
  // base64url encode
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeConfig(encoded: string): TVConfig {
  try {
    // Restore base64 padding
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const json = atob(base64);
    const parsed = JSON.parse(json);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}
