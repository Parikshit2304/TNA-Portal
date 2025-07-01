import express from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [
      totalUsers,
      totalSurveys,
      activeSurveys,
      totalResponses,
      usersByDepartment,
      surveyCompletionRates,
      recentActivity,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total surveys
      prisma.survey.count(),
      
      // Active surveys
      prisma.survey.count({
        where: { status: 'ACTIVE' },
      }),
      
      // Total responses
      prisma.surveyResponse.count(),
      
      // Users by department
      prisma.user.groupBy({
        by: ['department'],
        _count: {
          id: true,
        },
        where: {
          department: {
            not: null,
          },
        },
      }),
      
      // Survey completion rates
      prisma.survey.findMany({
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              responses: true,
            },
          },
        },
        where: {
          status: 'ACTIVE',
        },
        take: 5,
      }),
      
      // Recent activity
      prisma.surveyResponse.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          survey: {
            select: {
              title: true,
            },
          },
        },
      }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalSurveys,
        activeSurveys,
        totalResponses,
      },
      usersByDepartment: usersByDepartment.map(item => ({
        department: item.department || 'Unassigned',
        count: item._count.id,
      })),
      surveyCompletionRates,
      recentActivity,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get training needs analysis
router.get('/training-needs', authMiddleware, async (req, res) => {
  try {
    // This would be more complex in a real application
    // For now, we'll return mock data structure
    const trainingNeeds = await prisma.surveyResponse.findMany({
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        user: {
          select: {
            department: true,
            position: true,
          },
        },
      },
    });

    // Process and categorize training needs
    const processedData = {
      byDepartment: {},
      bySkill: {},
      priority: {
        high: 0,
        medium: 0,
        low: 0,
      },
    };

    res.json(processedData);
  } catch (error) {
    console.error('Training needs analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze training needs' });
  }
});

export default router;