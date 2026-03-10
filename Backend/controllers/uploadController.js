const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const path = require('path');

/**
 * POST /api/upload
 * Handle audio file uploads with metadata
 * Expects multipart/form-data with:
 *   - file: audio file
 *   - title: song title
 *   - artist: song artist
 *   - album: (optional) song album
 *   - genre: (optional) song genre
 *   - year: (optional) release year
 */
const uploadSong = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { title, artist, album, genre, year } = req.body;

    // Validate required fields
    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Title and artist are required',
      });
    }

    // Store file metadata in database
    const songId = uuidv4();
    const filePath = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO songs (id, title, artist, album, file_path, file_name, duration, genre, year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, title, artist, album, file_path, genre, year, created_at`,
      [
        songId,
        title,
        artist,
        album || null,
        filePath,
        req.file.filename,
        null, // Duration would need to be parsed from audio file
        genre || null,
        year ? parseInt(year) : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Song uploaded successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload song',
      error: error.message,
    });
  }
};

module.exports = {
  uploadSong,
};
