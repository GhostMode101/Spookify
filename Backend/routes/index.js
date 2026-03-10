const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { getAllSongs, getSongById } = require('../controllers/songController');
const { uploadSong } = require('../controllers/uploadController');
const { healthCheck } = require('../controllers/healthController');

// Health check endpoint (for DevOps/Load Balancer)
router.get('/health', healthCheck);

// Song routes
router.get('/api/songs', getAllSongs);
router.get('/api/songs/:id', getSongById);

// Upload route - handles multipart/form-data
router.post('/api/upload', upload.single('file'), uploadSong);

module.exports = router;
