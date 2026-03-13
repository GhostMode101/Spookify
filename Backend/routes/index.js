const express = require('express');
const router = express.Router();
const { login, callback, getMe, logout } = require('../controllers/authController');
const { healthCheck } = require('../controllers/healthController');
const { getFeed } = require('../controllers/feedController');
const { swipe } = require('../controllers/swipeController');
const { requireAuth } = require('../middleware/auth');

// Health check endpoint (for DevOps/Load Balancer)
router.get('/health', healthCheck);

// ── Spotify OAuth Routes ──
router.get('/api/auth/login', login);
router.get('/api/auth/callback', callback);
router.get('/api/auth/me', requireAuth, getMe);
router.post('/api/auth/logout', requireAuth, logout);

// ── Phase 2: Matchmaking Engine ──
router.get('/api/feed', requireAuth, getFeed);
router.post('/api/swipe', requireAuth, swipe);

module.exports = router;

