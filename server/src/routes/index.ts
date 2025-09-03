import { Router } from 'express';
import authRoutes from './auth';
import paymentRoutes from './payments';

const router = Router();

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
