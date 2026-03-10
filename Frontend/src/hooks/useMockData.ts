import type { Song, Playlist } from "@/services/api";

// Mock data so the UI works without a backend
const mockSongs: Song[] = [
  { id: "1", title: "Midnight Drive", artist: "Neon Pulse", coverUrl: "https://picsum.photos/seed/song1/400/400", audioUrl: "", duration: 234 },
  { id: "2", title: "Solar Winds", artist: "Astral Waves", coverUrl: "https://picsum.photos/seed/song2/400/400", audioUrl: "", duration: 198 },
  { id: "3", title: "Urban Echo", artist: "City Lights", coverUrl: "https://picsum.photos/seed/song3/400/400", audioUrl: "", duration: 267 },
  { id: "4", title: "Deep Blue", artist: "Ocean Floor", coverUrl: "https://picsum.photos/seed/song4/400/400", audioUrl: "", duration: 312 },
  { id: "5", title: "Crystal Rain", artist: "Glass Garden", coverUrl: "https://picsum.photos/seed/song5/400/400", audioUrl: "", duration: 189 },
  { id: "6", title: "Velvet Thunder", artist: "Storm Collective", coverUrl: "https://picsum.photos/seed/song6/400/400", audioUrl: "", duration: 245 },
  { id: "7", title: "Neon Dreams", artist: "Synthwave Radio", coverUrl: "https://picsum.photos/seed/song7/400/400", audioUrl: "", duration: 278 },
  { id: "8", title: "Golden Hour", artist: "Sunset Boulevard", coverUrl: "https://picsum.photos/seed/song8/400/400", audioUrl: "", duration: 203 },
];

const mockPlaylists: Playlist[] = [
  { id: "p1", name: "Chill Vibes", songs: mockSongs.slice(0, 4) },
  { id: "p2", name: "Late Night Drives", songs: mockSongs.slice(4, 8) },
  { id: "p3", name: "Focus Flow", songs: mockSongs.slice(2, 6) },
];

export const useMockSongs = () => mockSongs;
export const useMockPlaylists = () => mockPlaylists;
