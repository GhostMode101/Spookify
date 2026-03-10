const API_BASE = "http://localhost:5000";

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
}

export interface Playlist {
  id: string;
  name: string;
  songs?: Song[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getSongs: () => request<Song[]>("/api/songs"),
  getSong: (id: string) => request<Song>(`/api/songs/${id}`),
  searchSongs: (q: string) => request<Song[]>(`/api/search?q=${encodeURIComponent(q)}`),
  uploadSong: (formData: FormData) =>
    request<Song>("/api/upload", { method: "POST", body: formData }),
  getPlaylists: () => request<Playlist[]>("/api/playlists"),
  createPlaylist: (name: string) =>
    request<Playlist>("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
};
