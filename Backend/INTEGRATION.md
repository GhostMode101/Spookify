# 🎵 Spookify Platform - Backend/Frontend Integration Guide

## 📐 System Architecture

```
┌─────────────────────────┐
│   React/Vite Frontend   │
│  (localhost:5173)       │
└───────────┬─────────────┘
            │
            │ HTTP Requests
            │ CORS Enabled
            ▼
┌─────────────────────────────────────┐
│    Node.js/Express Backend          │
│    (localhost:5000)                 │
│  ├─ Health Checks (/health)         │
│  ├─ Song API (/api/songs)           │
│  ├─ Upload API (/api/upload)        │
│  └─ CORS: http://localhost:5173     │
└───────────┬─────────────────────────┘
            │ (Internal Network)
            ▼
┌─────────────────────────┐
│   PostgreSQL Database   │
│  (port 5432)            │
│   - Songs Table         │
│   - Metadata Storage    │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│  File Storage           │
│  /uploads directory     │
│  (Audio Files)          │
└─────────────────────────┘
```

---

## 🔗 Frontend Integration - Code Examples

### 1️⃣ Fetch All Songs
**Frontend Code:**
```typescript
// In your React component
const fetchSongs = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/songs', {
      method: 'GET',
      credentials: 'include',  // Enable CORS credentials
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch songs');
    
    const data = await response.json();
    console.log('Songs:', data.data); // Array of song objects
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Backend Endpoint:**
```
GET http://localhost:5000/api/songs
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Spooky Symphony",
      "artist": "Ghost Notes",
      "album": "Haunted House Hits",
      "duration": 240,
      "genre": "Electronic",
      "year": 2024,
      "cover_url": "https://...",
      "created_at": "2024-03-05T10:30:00Z"
    },
    // ... more songs
  ],
  "count": 5
}
```

---

### 2️⃣ Fetch Single Song Details
**Frontend Code:**
```typescript
const fetchSongById = async (songId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/songs/${songId}`,
      {
        credentials: 'include',
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log('Song Details:', data.data);
      // Now you have:
      // - file_path: URL to stream/download the audio
      // - metadata: title, artist, album, etc.
    }
  } catch (error) {
    console.error('Error fetching song:', error);
  }
};
```

**Backend Endpoint:**
```
GET http://localhost:5000/api/songs/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Spooky Symphony",
    "artist": "Ghost Notes",
    "album": "Haunted House Hits",
    "file_path": "/uploads/a1b2c3d4-e5f6.mp3",  // ← Use this to stream
    "duration": 240,
    "genre": "Electronic",
    "year": 2024,
    "cover_url": "https://...",
    "created_at": "2024-03-05T10:30:00Z"
  }
}
```

**Stream Audio in Frontend:**
```typescript
// Use the file_path to play audio
const audioElement = new Audio(
  `http://localhost:5000${data.data.file_path}`
);
audioElement.play();
```

---

### 3️⃣ Upload a Song
**Frontend Code:**
```typescript
const uploadSong = async (
  audioFile: File,
  metadata: {
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    year?: number;
  }
) => {
  try {
    const formData = new FormData();
    
    // Append file
    formData.append('file', audioFile);
    
    // Append metadata
    formData.append('title', metadata.title);
    formData.append('artist', metadata.artist);
    if (metadata.album) formData.append('album', metadata.album);
    if (metadata.genre) formData.append('genre', metadata.genre);
    if (metadata.year) formData.append('year', metadata.year.toString());

    const response = await fetch(
      'http://localhost:5000/api/upload',
      {
        method: 'POST',
        credentials: 'include',  // CORS credentials
        body: formData,
        // Don't set Content-Type - browser will set it with boundary
      }
    );

    if (!response.ok) throw new Error('Upload failed');
    
    const data = await response.json();
    console.log('Upload successful:', data.data);
    
    // data.data contains the newly created song with ID
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

**HTML Input Example:**
```tsx
import { useState } from 'react';

export function SongUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !artist) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('artist', artist);

      const response = await fetch(
        'http://localhost:5000/api/upload',
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      const result = await response.json();
      
      if (result.success) {
        alert('Song uploaded successfully!');
        setFile(null);
        setTitle('');
        setArtist('');
        // Refresh song list
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Artist Name"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Song'}
      </button>
    </form>
  );
}
```

**Backend Endpoint:**
```
POST http://localhost:5000/api/upload
Content-Type: multipart/form-data

Form Fields:
- file: [binary audio file]
- title: "Song Title"
- artist: "Artist Name"  
- album: "Album Name" (optional)
- genre: "Rock" (optional)
- year: 2024 (optional)
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Song uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Spooky Symphony",
    "artist": "Ghost Notes",
    "album": "Haunted House Hits",
    "file_path": "/uploads/newly-uploaded-file.mp3",
    "genre": "Electronic",
    "year": 2024,
    "created_at": "2024-03-05T10:45:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Title and artist are required"
}
```

---

### 4️⃣ Health Check
**Frontend Code (for monitoring):**
```typescript
const checkBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    
    if (data.success) {
      console.log('✓ Backend is healthy');
      console.log('✓ Database is', data.database);
    }
  } catch (error) {
    console.error('✗ Backend is down:', error);
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-03-05T10:50:00Z",
  "database": "connected"
}
```

---

## 🔄 Complete Frontend Hook Example

**useSpotifyAPI.ts:**
```typescript
import { useState, useCallback, useEffect } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
  year: number;
  cover_url: string;
  file_path: string;
  created_at: string;
}

interface UploadProgress {
  isUploading: boolean;
  error: string | null;
}

export const useSpookifyAPI = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    error: null,
  });

  const API_URL = 'http://localhost:5000';

  // Fetch all songs
  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/songs`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch songs');
      
      const data = await response.json();
      setSongs(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single song
  const fetchSong = useCallback(
    async (id: string): Promise<Song | null> => {
      try {
        const response = await fetch(`${API_URL}/api/songs/${id}`, {
          credentials: 'include',
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.data;
      } catch (err) {
        console.error('Error fetching song:', err);
        return null;
      }
    },
    []
  );

  // Upload song
  const uploadSong = useCallback(
    async (
      file: File,
      metadata: {
        title: string;
        artist: string;
        album?: string;
        genre?: string;
        year?: number;
      }
    ): Promise<Song | null> => {
      setUploadProgress({ isUploading: true, error: null });
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title);
        formData.append('artist', metadata.artist);
        if (metadata.album) formData.append('album', metadata.album);
        if (metadata.genre) formData.append('genre', metadata.genre);
        if (metadata.year) formData.append('year', metadata.year.toString());

        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        
        if (data.success) {
          // Add new song to list
          setSongs((prev) => [data.data, ...prev]);
          setUploadProgress({ isUploading: false, error: null });
          return data.data;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setUploadProgress({ isUploading: false, error: message });
      }
      
      return null;
    },
    []
  );

  // Check backend health
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Fetch songs on mount
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return {
    songs,
    loading,
    error,
    uploadProgress,
    fetchSongs,
    fetchSong,
    uploadSong,
    checkHealth,
  };
};
```

**Usage in Component:**
```tsx
import { useSpookifyAPI } from './hooks/useSpookifyAPI';

export function MusicLibrary() {
  const { songs, loading, error, uploadSong } = useSpookifyAPI();

  if (loading) return <div>Loading songs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Music Library ({songs.length})</h1>
      <div className="songs-grid">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🌐 CORS Configuration Details

**What's Enabled:**
- ✅ Origin: `http://localhost:5173`
- ✅ Credentials: Cookies, Authorization headers
- ✅ Methods: GET, POST, PUT, DELETE, OPTIONS
- ✅ Headers: Content-Type, Authorization, X-Requested-With

**In Frontend, Always Use:**
```typescript
fetch(url, {
  credentials: 'include',  // ← Important for CORS
  // ... other options
})
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│          Frontend (React/Vite)                          │
│  - useSpookifyAPI() hook                                │
│  - Components render song list                          │
│  - File input for uploads                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP + CORS
                     │ credentials: 'include'
                     ▼
┌──────────────────────────────────────────────────────────┐
│        Backend (Express.js)                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ CORS Middleware                                  │   │
│  │ - Allow http://localhost:5173                   │   │
│  │ - Support credentials                           │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes                                           │   │
│  │ - GET /api/songs → songController.getAllSongs() │   │
│  │ - GET /api/songs/:id → songController.getSong()│   │
│  │ - POST /api/upload → uploadController.upload()  │   │
│  │ - GET /health → healthController.check()        │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Middleware                                       │   │
│  │ - Multer: Handle file uploads                    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────┬─────────────────────────────────────────────┘
             │
             │ SQL Queries
             ▼
┌──────────────────────────────────────┐
│    PostgreSQL Database               │
│  - Store song metadata               │
│  - Return results                    │
└──────────────────────────────────────┘

     Data returned to Frontend ◄───┐
     ┌────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  File Storage (/uploads)                │
│  - Audio files served as static files   │
│  - Streamed to frontend for playback    │
└─────────────────────────────────────────┘
```

---

## ✨ Key Integration Points

| Frontend | Backend | Purpose |
|----------|---------|---------|
| Fetch request | GET /api/songs | Load entire song library |
| Solo song request | GET /api/songs/:id | Get playback URL & metadata |
| Form submission | POST /api/upload | Store new song with file |
| Periodic check | GET /health | Monitor backend availability |

---

## 🚀 Ready to Deploy!

Your React/Vite frontend is now fully connected to this Node.js Express backend. Everything is CORS-enabled, database-backed, and containerized for DevOps handoff.

**Next Steps:**
1. ✅ Backend is ready
2. → Update Frontend API URLs (currently hardcoded to localhost:5000)
3. → Test endpoints using the hook examples above
4. → Deploy with docker-compose up --build
5. → Put behind Nginx reverse proxy

All integration points documented. Happy coding! 🎵
