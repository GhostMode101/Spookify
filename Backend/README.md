# Spookify Backend - Node.js/Express API

A robust Node.js/Express backend for the Spookify music streaming platform with PostgreSQL, Multer file uploads, CORS integration, and Docker containerization.

## 📋 Tech Stack

- **Runtime**: Node.js (v20 Alpine)
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **File Upload**: Multer
- **CORS**: Configured for Vite frontend (localhost:5173)
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Local Development

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Configure Environment
```bash
# Copy example file and update with your values
cp .env.example .env
```

#### 3. Start PostgreSQL (using Docker or local)
```bash
# Option 1: Use Docker Compose (recommended)
docker-compose up -d postgres

# Option 2: Local PostgreSQL
# Ensure PostgreSQL is running on localhost:5432
```

#### 4. Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:5000`

### Docker Deployment

#### Run Full Stack (Backend + Database)
```bash
docker-compose up --build
```

This will:
- Build the backend Docker image
- Start PostgreSQL container
- Start backend container with proper networking
- Initialize database schema automatically

#### Environment Variables (for Docker)
Create a `.env` file in the Backend directory:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_HOST=postgres
DB_PORT=5432
DB_NAME=spookify_db
DB_USER=spookify_user
DB_PASSWORD=spookify_password
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
**Description**: DevOps/Load balancer health check endpoint
**Response**: 200 OK with health status and database connection status

### Get All Songs
```
GET /api/songs
```
**Description**: Retrieve all songs from database
**Response**: 
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Song Title",
      "artist": "Artist Name",
      "album": "Album Name",
      "duration": 180,
      "genre": "Rock",
      "year": 2024,
      "cover_url": "url/to/cover",
      "created_at": "2024-03-05T10:00:00Z"
    }
  ],
  "count": 5
}
```

### Get Song by ID
```
GET /api/songs/:id
```
**Description**: Retrieve a specific song by UUID
**Parameters**: 
- `id` (path parameter): Song UUID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "file_path": "/uploads/filename.mp3",
    "duration": 180,
    "genre": "Rock",
    "year": 2024,
    "cover_url": "url/to/cover",
    "created_at": "2024-03-05T10:00:00Z"
  }
}
```

### Upload Song
```
POST /api/upload
Content-Type: multipart/form-data
```
**Description**: Upload an audio file with metadata
**Form Fields**:
- `file` (required): Audio file (.mp3, .wav, .m4a, .ogg, .flac)
- `title` (required): Song title
- `artist` (required): Artist name
- `album` (optional): Album name
- `genre` (optional): Genre (e.g., "Rock", "Jazz")
- `year` (optional): Release year (e.g., 2024)

**Max File Size**: 100MB (configurable via MAX_FILE_SIZE env var)

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Song uploaded successfully",
  "data": {
    "id": "uuid",
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "file_path": "/uploads/filename.mp3",
    "genre": "Rock",
    "year": 2024,
    "created_at": "2024-03-05T10:00:00Z"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Title and artist are required"
}
```

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js           # PostgreSQL connection pool
├── controllers/
│   ├── songController.js     # GET /api/songs endpoints
│   ├── uploadController.js   # POST /api/upload endpoint
│   └── healthController.js   # GET /health endpoint
├── middleware/
│   └── upload.js             # Multer configuration & file filter
├── routes/
│   └── index.js              # Route definitions
├── db/
│   └── init.js               # Database schema initialization
├── uploads/                  # Audio file storage (git-ignored)
├── server.js                 # Express app & server initialization
├── package.json              # Dependencies & scripts
├── Dockerfile                # Container image definition
├── docker-compose.yml        # Multi-container orchestration
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── .dockerignore              # Docker build ignore rules
└── README.md                 # This file
```

## 🔐 CORS Configuration

The backend is configured to accept requests from your Vite frontend:
- **Origin**: `http://localhost:5173` (configurable via CORS_ORIGIN env var)
- **Credentials**: Enabled (cookies, authorization headers)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With

## 🗄️ Database Schema

### Songs Table
```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255),
  file_path VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  duration INTEGER,
  genre VARCHAR(100),
  year INTEGER,
  cover_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The schema is automatically created on first server startup.

## 📦 File Upload Handling

- **Storage**: `/uploads` directory (mounted in Docker)
- **File Filter**: Only audio files (.mp3, .wav, .m4a, .ogg, .flac)
- **Naming**: UUID-based with original extension preserved
- **Size Limit**: 100MB (configurable)
- **URL Access**: Served at `/uploads/:filename` after upload

## 🔄 Frontend Integration

Your React/Vite frontend can call these endpoints:

```typescript
// Fetch all songs
const response = await fetch('http://localhost:5000/api/songs', {
  credentials: 'include',
});

// Fetch specific song
const song = await fetch('http://localhost:5000/api/songs/song-uuid', {
  credentials: 'include',
});

// Upload song
const formData = new FormData();
formData.append('file', audioFile);
formData.append('title', 'Song Title');
formData.append('artist', 'Artist Name');
formData.append('album', 'Album Name');

const upload = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData,
});
```

## 🐳 DevOps Handoff

### For Nginx Reverse Proxy
1. Backend is exposed on port 5000
2. Health check endpoint: `GET /health`
3. All requests to `/api/*` should be proxied to backend
4. CORS is handled by backend (no need for Nginx CORS config)

### Docker Compose Services
- **Backend**: `spookify-backend` (port 5000)
- **Database**: `spookify-db` (port 5432, only accessible on internal network)
- **Network**: `spookify_network` (internal bridge network)

### Health Checks
- Backend: `GET /health` (returns 200 if DB connected)
- Database: Built-in `pg_isready` check

### Volumes
- **postgres_data**: PostgreSQL data persistence
- **uploads**: Audio file storage (mounted from host)

### Environment Variables Required for Production

| Variable | Purpose | Default |
|----------|---------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| FRONTEND_URL | Frontend URL for docs | http://localhost:5173 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | spookify_db |
| DB_USER | Database user | spookify_user |
| DB_PASSWORD | Database password | spookify_password |
| CORS_ORIGIN | CORS origin | http://localhost:5173 |
| UPLOAD_DIR | Upload directory | ./uploads |
| MAX_FILE_SIZE | Max file size (bytes) | 104857600 |

## 🧪 Testing Endpoints

### Using cURL

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Get All Songs
```bash
curl http://localhost:5000/api/songs
```

#### Get Single Song
```bash
curl http://localhost:5000/api/songs/song-uuid
```

#### Upload Song
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/audio.mp3" \
  -F "title=Song Name" \
  -F "artist=Artist Name" \
  -F "album=Album Name" \
  -F "genre=Rock"
```

## 🔧 Troubleshooting

**Database Connection Error**
- Ensure PostgreSQL is running
- Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in .env
- Verify network connectivity (especially in Docker)

**Upload Fails**
- Check file format (must be audio: mp3, wav, m4a, ogg, flac)
- Verify title and artist are provided
- Check file size doesn't exceed MAX_FILE_SIZE

**CORS Errors**
- Verify CORS_ORIGIN environment variable matches frontend URL
- Check frontend is making requests with `credentials: 'include'`

**Port Already in Use**
- Change PORT environment variable or kill process using port 5000

## 📝 Scripts

```bash
npm start              # Run server (production)
npm run dev            # Run server with auto-reload (development)
npm test               # Run tests (placeholder)
```

## 📄 License

ISC

## 🙋 Support

For issues, bugs, or feature requests, create an issue in the repository.

---

**Ready for DevOps deployment!** 🚀

All environment variables are externalized, health checks are in place, and the app is fully containerized. Ready for Nginx reverse proxy and Kubernetes deployment when needed.
