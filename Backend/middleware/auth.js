const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Extracts and verifies the JWT from the HTTP-only cookie.
 * Sets req.userId and req.spotifyId on success.
 */
const requireAuth = (req, res, next) => {
  const token = req.cookies?.spookiefy_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. Please log in with Spotify.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.spotifyId = decoded.spotifyId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};

module.exports = { requireAuth };
