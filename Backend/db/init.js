const pool = require('../config/database');

const initializeDatabase = async () => {
  try {
    // Create songs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS songs (
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
    `);

    console.log('✓ Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };
