const SpotifyWebApi = require('spotify-web-api-node');

/**
 * Creates a pre-configured SpotifyWebApi instance.
 * Credentials are loaded from environment variables.
 */
const createSpotifyApi = () => {
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost/api/auth/callback',
  });
};

// Required scopes for SpookieFY
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-modify-playback-state',
  'streaming',
];

module.exports = { createSpotifyApi, SPOTIFY_SCOPES };
