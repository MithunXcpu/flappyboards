const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";

const SCOPES = [
  "streaming",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-read-currently-playing",
].join(" ");

function generateRandomString(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function initiateSpotifyAuth(redirectUri: string): Promise<void> {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);

  // Store verifier for the callback
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const codeVerifier = localStorage.getItem("spotify_code_verifier") || "";

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to exchange code for token");
  }

  const data = await res.json();
  localStorage.removeItem("spotify_code_verifier");
  return data;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; refresh_token?: string; expires_in: number }> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }

  return res.json();
}

export function getStoredTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number;
} {
  return {
    accessToken: localStorage.getItem("spotify_access_token"),
    refreshToken: localStorage.getItem("spotify_refresh_token"),
    expiresAt: Number(localStorage.getItem("spotify_expires_at") || "0"),
  };
}

export function storeTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void {
  localStorage.setItem("spotify_access_token", accessToken);
  localStorage.setItem("spotify_refresh_token", refreshToken);
  localStorage.setItem(
    "spotify_expires_at",
    String(Date.now() + expiresIn * 1000)
  );
}

export function clearTokens(): void {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_expires_at");
  localStorage.removeItem("spotify_code_verifier");
}

export function isAuthenticated(): boolean {
  const { accessToken, expiresAt } = getStoredTokens();
  return !!accessToken && Date.now() < expiresAt;
}

export async function getValidToken(): Promise<string | null> {
  const { accessToken, refreshToken, expiresAt } = getStoredTokens();

  if (!accessToken || !refreshToken) return null;

  // Token still valid
  if (Date.now() < expiresAt - 60000) {
    return accessToken;
  }

  // Refresh
  try {
    const data = await refreshAccessToken(refreshToken);
    storeTokens(
      data.access_token,
      data.refresh_token || refreshToken,
      data.expires_in
    );
    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}
