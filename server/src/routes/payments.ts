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
  requireRole(['merchant', 'vendor', 'admin']), 
  paymentLimiter, 
  validatePaymentRequest, 
  createPayment
);

router.get('/transactions', authenticateToken, requireRole(['admin']), getTransactions);
router.get('/transactions/:transactionId', authenticateToken, requireRole(['admin', 'merchant', 'vendor', 'user']), getTransaction);

// Webhook routes (no authentication required)
router.post('/webhooks/:gateway', handleWebhook);

export default router;
