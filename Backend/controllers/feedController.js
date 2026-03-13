const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Calculate Jaccard Index (Vibe Score) between two artist arrays.
 * Compares artist IDs to find overlap.
 * Returns a score from 0 to 100.
 */
function calculateVibeScore(artistsA, artistsB) {
  if (!artistsA || !artistsB || artistsA.length === 0 || artistsB.length === 0) {
    return 0;
  }

  // Extract artist IDs (or names as fallback) into Sets
  const setA = new Set(artistsA.map((a) => a.id || a.name));
  const setB = new Set(artistsB.map((a) => a.id || a.name));

  // Jaccard Index = |A ∩ B| / |A ∪ B|
  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSize++;
    }
  }

  const unionSize = setA.size + setB.size - intersectionSize;

  if (unionSize === 0) return 0;

  return Math.round((intersectionSize / unionSize) * 100);
}

/**
 * GET /api/feed
 * Returns up to 20 potential matches sorted by Vibe Score (descending).
 * Excludes: the current user, and any users already swiped on.
 */
const getFeed = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // 1. Get the current user to access their topArtists
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { topArtists: true },
    });

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Get all user IDs the current user has already swiped on
    const existingSwipes = await prisma.swipe.findMany({
      where: { swiperId: currentUserId },
      select: { swipedId: true },
    });

    const swipedUserIds = existingSwipes.map((s) => s.swipedId);

    // 3. Fetch all candidate users (exclude self + already swiped)
    const candidates = await prisma.user.findMany({
      where: {
        id: {
          notIn: [currentUserId, ...swipedUserIds],
        },
      },
      select: {
        id: true,
        spotifyId: true,
        displayName: true,
        avatarUrl: true,
        topArtists: true,
      },
    });

    // 4. Calculate Vibe Score for each candidate
    const currentArtists = Array.isArray(currentUser.topArtists)
      ? currentUser.topArtists
      : [];

    const scoredCandidates = candidates.map((candidate) => {
      const candidateArtists = Array.isArray(candidate.topArtists)
        ? candidate.topArtists
        : [];

      const vibeScore = calculateVibeScore(currentArtists, candidateArtists);

      // Return only the top 3 artists for the card display
      const topThreeArtists = candidateArtists.slice(0, 3).map((a) => ({
        id: a.id,
        name: a.name,
        imageUrl: a.imageUrl || null,
      }));

      return {
        id: candidate.id,
        spotifyId: candidate.spotifyId,
        displayName: candidate.displayName,
        avatarUrl: candidate.avatarUrl,
        topArtists: topThreeArtists,
        vibeScore,
      };
    });

    // 5. Sort by Vibe Score descending, take top 20
    scoredCandidates.sort((a, b) => b.vibeScore - a.vibeScore);
    const feed = scoredCandidates.slice(0, 20);

    res.json({ success: true, data: feed });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load feed',
      error: error.message,
    });
  }
};

module.exports = { getFeed };
