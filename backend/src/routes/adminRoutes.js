import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * All admin routes require authentication and admin role
 * Rate limited to 50 requests per 15 minutes
 */
router.use(adminLimiter);

// GET /api/admin/dashboard - Get dashboard metrics
router.get('/dashboard', authenticate, requireAdmin, adminController.getDashboard);

// GET /api/admin/analytics/revenue - Get revenue analytics with date filtering
router.get('/analytics/revenue', authenticate, requireAdmin, adminController.getRevenueAnalytics);

// GET /api/admin/reports/export - Export CSV report
router.get('/reports/export', authenticate, requireAdmin, adminController.exportReport);

export default router;
