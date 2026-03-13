// SpookieFY API Service — Phase 1 & 2

export interface SpookieFyUser {
  id: string;
  spotifyId: string;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  topArtists: SpotifyArtist[] | null;
  createdAt: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  imageUrl: string | null;
}

// ── Phase 2 Types ──

export interface FeedUser {
  id: string;
  spotifyId: string;
  displayName: string | null;
  avatarUrl: string | null;
  topArtists: { id: string; name: string; imageUrl: string | null }[];
  vibeScore: number;
}

export interface SwipeResponse {
  isMatch: boolean;
  roomId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include", // Always send cookies for JWT auth
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `API error: ${res.status}` }));
    throw new Error(body.message || `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  /** Check current session — returns the authenticated user or throws */
  getMe: () => request<ApiResponse<SpookieFyUser>>("/api/auth/me"),

  /** Logout — clears the session cookie */
  logout: () =>
    request<ApiResponse<null>>("/api/auth/logout", { method: "POST" }),

  /** Phase 2: Get discovery feed sorted by Vibe Score */
  getFeed: () => request<ApiResponse<FeedUser[]>>("/api/feed"),

  /** Phase 2: Swipe on a user */
  swipe: (swipedId: string, action: "LIKE" | "PASS") =>
    request<ApiResponse<SwipeResponse>>("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swipedId, action }),
    }),
};

/**
 * Redirect to Spotify login.
 * Uses a hard window.location redirect (not fetch) because
 * the backend responds with a 302 to Spotify's authorize URL.
 */
export const loginWithSpotify = () => {
  window.location.href = "/api/auth/login";
};

