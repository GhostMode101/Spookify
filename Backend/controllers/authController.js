const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { createSpotifyApi, SPOTIFY_SCOPES } = require('../config/spotify');

const prisma = new PrismaClient();

/**
 * GET /api/auth/login
 * Redirects user to Spotify authorize URL
 */
const login = (req, res) => {
  const spotifyApi = createSpotifyApi();
  const authorizeURL = spotifyApi.createAuthorizeURL(SPOTIFY_SCOPES, 'spookiefy-state');
  res.redirect(authorizeURL);
};

/**
 * GET /api/auth/callback
 * Handles Spotify OAuth callback:
 *  1. Exchange code for tokens
 *  2. Fetch user profile + top artists
 *  3. Upsert user in database via Prisma
 *  4. Issue JWT as HTTP-only cookie
 *  5. Redirect to frontend
 */
const callback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Missing authorization code' });
  }

  try {
    const spotifyApi = createSpotifyApi();

    // 1. Exchange auth code for tokens
    const tokenData = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = tokenData.body;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    // 2. Fetch user profile
    const meData = await spotifyApi.getMe();
    const profile = meData.body;
    const spotifyTier = profile.product || 'free';

    // 3. Fetch top artists (up to 50)
    let topArtists = [];
    try {
      const topArtistsData = await spotifyApi.getMyTopArtists({ limit: 50, time_range: 'medium_term' });
      topArtists = topArtistsData.body.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
        imageUrl: artist.images?.[0]?.url || null,
      }));
    } catch (topErr) {
      console.warn('Could not fetch top artists (user may be new):', topErr.message);
    }

    // 4. Upsert user in DB
    const user = await prisma.user.upsert({
      where: { spotifyId: profile.id },
      update: {
        displayName: profile.display_name,
        email: profile.email || null,
        avatarUrl: profile.images?.[0]?.url || null,
        spotifyTier: spotifyTier,
        accessToken: access_token,
        refreshToken: refresh_token,
        topArtists: topArtists,
      },
      create: {
        spotifyId: profile.id,
        displayName: profile.display_name,
        email: profile.email || null,
        avatarUrl: profile.images?.[0]?.url || null,
        spotifyTier: spotifyTier,
        accessToken: access_token,
        refreshToken: refresh_token,
        topArtists: topArtists,
      },
    });

    // 5. Issue JWT
    const token = jwt.sign(
      { userId: user.id, spotifyId: user.spotifyId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Set HTTP-only cookie and redirect to frontend
    res.cookie('spookiefy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // Redirect back to the frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost';
    res.redirect(`${frontendUrl}/dashboard`);
  } catch (error) {
    console.error('Spotify auth callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Requires the auth middleware to have verified the JWT.
 */
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        spotifyId: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        topArtists: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

/**
 * POST /api/auth/logout
 * Clears the session cookie
 */
const logout = (req, res) => {
  res.clearCookie('spookiefy_token', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, callback, getMe, logout };
