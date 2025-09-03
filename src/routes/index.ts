import { Router } from 'express';
import authRoutes from './auth';
import paymentRoutes from './payments';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment Aggregator API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Current server timestamp
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                   description: API version
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Payment Aggregator API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);

export default router;
