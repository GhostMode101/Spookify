# 🚀 Spookify Backend - DevOps Deployment Guide

## Quick Summary

✅ **Backend Type**: Node.js/Express REST API  
✅ **Database**: PostgreSQL 15  
✅ **Container**: Docker (node:20-alpine)  
✅ **Port**: 5000  
✅ **Health Check**: GET /health  
✅ **File Uploads**: Multer (100MB default)  
✅ **CORS**: Enabled for localhost:5173  

---

## 🎯 What's Ready for You

### ✅ Core Endpoints Implemented
- `GET /health` - Health check for load balancers
- `GET /api/songs` - List all songs
- `GET /api/songs/:id` - Get single song details
- `POST /api/upload` - Upload audio file with metadata

### ✅ Database Schema
- Automatically created on first run
- PostgreSQL UUID primary keys
- Proper timestamps and metadata fields

### ✅ File Upload Handler
- Validates audio file types (.mp3, .wav, .m4a, .ogg, .flac)
- UUID-based filename generation
- Configurable file size limit

### ✅ Frontend Integration
- CORS explicitly configured for http://localhost:5173
- Credentials/headers support enabled
- Ready for Vite frontend consumption

### ✅ Containerization
- Multi-stage Dockerfile (optimized image size)
- Health check built into image
- Docker Compose with database service included

---

## 📦 Deployment Quick Start

### Option 1: Local Development
```bash
cd Backend
npm install
npm run dev
```
Requires local PostgreSQL running on localhost:5432

### Option 2: Docker Compose (Recommended for Testing)
```bash
cd Backend
docker-compose up --build
```
- Automatically starts PostgreSQL
- Initializes database schema
- Backend available on localhost:5000
- Volumes persist data and uploads

### Option 3: Production with Nginx Reverse Proxy
```bash
# Build image
docker build -t spookify-backend:latest .

# Run with your own database
docker run -d \
  --name spookify-backend \
  -p 5000:5000 \
  -e DB_HOST=your-db-host \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e CORS_ORIGIN=https://your-domain.com \
  -v /path/to/uploads:/app/uploads \
  spookify-backend:latest
```

---

## 🔧 Environment Variables

**Required for Production:**
```env
NODE_ENV=production
PORT=5000
DB_HOST=postgres-server-host
DB_PORT=5432
DB_NAME=spookify_db
DB_USER=spookify_user
DB_PASSWORD=your-secure-password
CORS_ORIGIN=https://yourdomain.com
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=104857600
```

**For Docker Compose (auto-configured):**
See `.env.example` - values automatically passed to containers

---

## 🏥 Health & Monitoring

### Health Check Endpoint
```bash
GET http://localhost:5000/health

Response:
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-03-05T10:00:00Z",
  "database": "connected"
}
```

**Status Codes:**
- `200 OK` - Application and database healthy
- `503 Service Unavailable` - Database connection failed

### For Load Balancers
Configure health check to:
- **Path**: `/health`
- **Method**: GET
- **Expected Status**: 200
- **Interval**: 30s
- **Timeout**: 3s

---

## 📁 File Structure

```
Backend/
├── server.js           # Entry point (Express app)
├── package.json        # Dependencies
├── Dockerfile          # Container image
├── docker-compose.yml  # Multi-container orchestration
├── .env                # Local dev config (git-ignored)
├── .env.example        # Config template
├── README.md           # Full documentation
├── config/
│   └── database.js     # PostgreSQL connection
├── controllers/        # Business logic
├── routes/             # API route definitions
├── middleware/         # Multer file upload config
├── db/                 # Database initialization
└── uploads/            # Audio file storage
```

---

## 🔌 Nginx Reverse Proxy Config Example

```nginx
upstream backend {
  server spookify-backend:5000;
}

server {
  listen 80;
  server_name api.yourdomain.com;

  client_max_body_size 100M;

  location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
  }
}
```

---

## 📊 Database Connection

**Connection Details:**
- Type: PostgreSQL 15
- Port: 5432 (internal in Docker)
- Default Credentials: `spookify_user:spookify_password`
- Database: `spookify_db`

**Backup/Restore with Docker:**
```bash
# Backup
docker exec spookify-db pg_dump -U spookify_user spookify_db > backup.sql

# Restore
docker exec -i spookify-db psql -U spookify_user spookify_db < backup.sql
```

---

## 📤 File Upload Storage

- **Location**: `/app/uploads` (in container) → volumes mounted from host
- **Format**: UUID + original extension (e.g., `a1b2c3d4-e5f6.mp3`)
- **Served At**: `GET /uploads/:filename`
- **Max Size**: 100MB (configurable)

**Persistent Storage:**
- Mount `./uploads` directory from host in Docker
- Files survive container restarts

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Verify database is running
docker-compose logs postgres
```

### Database connection failed
```bash
# Verify network
docker network inspect spookify_network

# Check credentials in .env
# Ensure postgres service is healthy
docker-compose ps
```

### Upload fails
- Verify file is valid audio format
- Check `MAX_FILE_SIZE` env variable
- Ensure `/uploads` directory has write permissions

### CORS errors from frontend
```bash
# Verify CORS_ORIGIN matches frontend URL
env | grep CORS_ORIGIN

# Should output: CORS_ORIGIN=http://localhost:5173 (or your domain)
```

---

## 📋 Pre-Deployment Checklist

- [ ] Database credentials configured in .env
- [ ] `CORS_ORIGIN` matches frontend domain
- [ ] `/uploads` directory is a persistent volume
- [ ] Health check is accessible: `GET /health`
- [ ] Port 5000 is exposed (or mapped through Nginx)
- [ ] File upload limit matches your needs
- [ ] Database backups are configured
- [ ] Logs are being captured

---

## 🔄 Scaling Notes

**Horizontal Scaling:**
- Backend is stateless, safe to scale behind load balancer
- Health checks ensure only healthy instances receive traffic
- File uploads: Use shared storage (S3, NFS) for multi-instance setup

**Vertical Scaling:**
- Increase Node.js heap: `NODE_OPTIONS=--max-old-space-size=2048`
- Increase PostgreSQL resources via docker-compose

---

## 📞 Quick Commands

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f backend

# Rebuild image
docker-compose build --no-cache backend

# Stop everything
docker-compose down

# Execute commands in backend
docker-compose exec backend npm run dev

# Clean up (warning: will delete data)
docker-compose down -v
```

---

**Backend is production-ready! 🚀**

All environment variables are externalized, health checks are built-in, and the app is fully containerized. Ready for your DevOps pipeline.
