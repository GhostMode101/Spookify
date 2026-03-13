const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

/**
 * POST /api/swipe
 * Body: { swipedId: string, action: 'LIKE' | 'PASS' }
 *
 * Saves the swipe. If mutual LIKE, creates a Match and returns roomId.
 */
const swipe = async (req, res) => {
  try {
    const swiperId = req.userId;
    const { swipedId, action } = req.body;

    // ── Validation ──
    if (!swipedId || !action) {
      return res.status(400).json({
        success: false,
        message: 'swipedId and action are required',
      });
    }

    if (!['LIKE', 'PASS'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'action must be either LIKE or PASS',
      });
    }

    if (swiperId === swipedId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot swipe on yourself',
      });
    }

    // ── Verify the target user exists ──
    const targetUser = await prisma.user.findUnique({
      where: { id: swipedId },
      select: { id: true },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ── Save the swipe (upsert to prevent duplicates) ──
    await prisma.swipe.upsert({
      where: {
        swiperId_swipedId: { swiperId, swipedId },
      },
      update: { action },
      create: { swiperId, swipedId, action },
    });

    // ── Check for mutual LIKE ──
    if (action === 'LIKE') {
      const reciprocalLike = await prisma.swipe.findFirst({
        where: {
          swiperId: swipedId,
          swipedId: swiperId,
          action: 'LIKE',
        },
      });

      if (reciprocalLike) {
        // Determine consistent ordering so we don't create duplicate matches
        const [userOneId, userTwoId] =
          swiperId < swipedId ? [swiperId, swipedId] : [swipedId, swiperId];

        // Check if match already exists
        const existingMatch = await prisma.match.findUnique({
          where: {
            userOneId_userTwoId: { userOneId, userTwoId },
          },
        });

        if (existingMatch) {
          return res.json({
            success: true,
            data: { isMatch: true, roomId: existingMatch.roomId },
          });
        }

        // Create the match with a fresh roomId
        const roomId = crypto.randomUUID();
        const match = await prisma.match.create({
          data: { userOneId, userTwoId, roomId },
        });

        return res.json({
          success: true,
          data: { isMatch: true, roomId: match.roomId },
        });
      }
    }

    // No match (either PASS or no reciprocal LIKE yet)
    res.json({
      success: true,
      data: { isMatch: false },
    });
  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process swipe',
      error: error.message,
    });
  }
};

module.exports = { swipe };
