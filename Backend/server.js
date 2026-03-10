require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./db/init');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ============================================
// CORS Configuration
// ============================================
// Explicitly allow traffic from Vite frontend and accept credentials/headers
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// ============================================
// Middleware
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Routes
// ============================================
app.use(routes);

// ============================================
// Error Handling
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File is too large',
      error: 'File size exceeds limit',
    });
  }

  if (err.message && err.message.includes('Only audio files')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type',
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ============================================
// Initialize Database and Start Server
// ============================================
const startServer = async () => {
  try {
    // Initialize database tables
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ CORS enabled for: ${FRONTEND_URL}`);
      console.log(`✓ Upload directory: ${path.join(__dirname, 'uploads')}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
