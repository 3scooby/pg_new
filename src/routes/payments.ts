import { Router } from 'express';
import { 
  createPayment, 
  getTransaction, 
  getTransactions, 
  handleWebhook 
} from '../controllers/paymentController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validatePaymentRequest } from '../middleware/validation';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protected routes
router.post('/', 
  authenticateToken, 
  paymentLimiter, 
  validatePaymentRequest, 
  createPayment
);

router.get('/transactions', authenticateToken, getTransactions);
router.get('/transactions/:transactionId', authenticateToken, getTransaction);

// Webhook routes (no authentication required)
router.post('/webhooks/:gateway', handleWebhook);

export default router;
