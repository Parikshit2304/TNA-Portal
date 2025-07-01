import express from 'express';
import { prisma } from '../index.js';
import { authMiddleware, managerMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all training applications
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    const userId = req.user.role === 'EMPLOYEE' ? req.user.userId : undefined;

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (type) where.applicationType = type;
    if (priority) where.priority = priority;

    const applications = await prisma.trainingApplication.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create new training application
router.post('/applications', authMiddleware, async (req, res) => {
  try {
    const {
      applicationType,
      title,
      description,
      category,
      priority,
      justification,
      expectedOutcome,
      preferredDates,
      duration,
      budget,
      participants,
      location,
      provider,
    } = req.body;

    const application = await prisma.trainingApplication.create({
      data: {
        userId: req.user.userId,
        applicationType,
        title,
        description,
        category,
        priority,
        justification,
        expectedOutcome,
        preferredDates: preferredDates ? JSON.stringify(preferredDates) : null,
        duration,
        budget: budget ? parseFloat(budget) : null,
        participants: participants ? parseInt(participants) : null,
        location,
        provider,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Get application by ID
router.get('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const application = await prisma.trainingApplication.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user can access this application
    if (req.user.role === 'EMPLOYEE' && application.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Update application status (Manager/Admin only)
router.put('/applications/:id/status', managerMiddleware, async (req, res) => {
  try {
    const { status, managerApproval, hrApproval, adminComments } = req.body;

    const application = await prisma.trainingApplication.update({
      where: { id: req.params.id },
      data: {
        status,
        managerApproval,
        hrApproval,
        adminComments,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    });

    res.json(application);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Delete application
router.delete('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const application = await prisma.trainingApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user can delete this application
    if (req.user.role === 'EMPLOYEE' && application.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow deletion if status is PENDING
    if (application.status !== 'PENDING') {
      return res.status(400).json({ error: 'Cannot delete application that is not pending' });
    }

    await prisma.trainingApplication.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Get training statistics
router.get('/statistics', managerMiddleware, async (req, res) => {
  try {
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      applicationsByType,
      applicationsByPriority,
      recentApplications,
    ] = await Promise.all([
      prisma.trainingApplication.count(),
      prisma.trainingApplication.count({ where: { status: 'PENDING' } }),
      prisma.trainingApplication.count({ where: { status: 'APPROVED' } }),
      prisma.trainingApplication.count({ where: { status: 'REJECTED' } }),
      prisma.trainingApplication.groupBy({
        by: ['applicationType'],
        _count: { id: true },
      }),
      prisma.trainingApplication.groupBy({
        by: ['priority'],
        _count: { id: true },
      }),
      prisma.trainingApplication.findMany({
        take: 10,
        orderBy: { submittedAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              department: true,
            },
          },
        },
      }),
    ]);

    res.json({
      stats: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
      },
      applicationsByType,
      applicationsByPriority,
      recentApplications,
    });
  } catch (error) {
    console.error('Training statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch training statistics' });
  }
});

export default router;