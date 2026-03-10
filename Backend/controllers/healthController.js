const pool = require('../config/database');

/**
 * GET /health
 * Health check endpoint for DevOps/Load Balancer monitoring
 * Returns 200 if app and database are healthy
 */
const healthCheck = async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');

    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
};

module.exports = {
  healthCheck,
};
