import express from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all surveys
router.get('/', authMiddleware, async (req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            responses: true,
            questions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(surveys);
  } catch (error) {
    console.error('Get surveys error:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// Create survey
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        createdById: req.user.userId,
        questions: {
          create: questions.map((q: any, index: number) => ({
            title: q.title,
            type: q.type,
            options: q.options ? JSON.stringify(q.options) : null,
            required: q.required || false,
            order: index,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(survey);
  } catch (error) {
    console.error('Create survey error:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

// Get survey by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    console.error('Get survey error:', error);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});

// Submit survey response
router.post('/:id/responses', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const surveyId = req.params.id;
    const userId = req.user.userId;

    // Check if user already submitted response
    const existingResponse = await prisma.surveyResponse.findUnique({
      where: {
        surveyId_userId: {
          surveyId,
          userId,
        },
      },
    });

    if (existingResponse) {
      return res.status(400).json({ error: 'Response already submitted' });
    }

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId,
        userId,
        status: 'COMPLETED',
        answers: {
          create: answers.map((answer: any) => ({
            questionId: answer.questionId,
            answer: answer.answer,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    res.status(201).json(response);
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Get survey responses (admin/manager only)
router.get('/:id/responses', authMiddleware, async (req, res) => {
  try {
    const responses = await prisma.surveyResponse.findMany({
      where: { surveyId: req.params.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
            position: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    res.json(responses);
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

export default router;