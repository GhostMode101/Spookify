const pool = require('../config/database');

/**
 * GET /api/songs
 * Retrieve all songs from the database
 */
const getAllSongs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, artist, album, duration, genre, year, cover_url, created_at FROM songs ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch songs',
      error: error.message,
    });
  }
};

/**
 * GET /api/songs/:id
 * Retrieve a single song by ID
 */
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Song ID is required',
      });
    }

    const result = await pool.query(
      'SELECT id, title, artist, album, file_path, duration, genre, year, cover_url, created_at FROM songs WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch song',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
};
