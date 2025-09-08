import { Router } from 'express';
import { 
  createPayment, 
  getTransaction, 
  getTransactions, 
  handleWebhook,
  createPayout,
  submitPayoutUpi
} from '../controllers/paymentController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validatePaymentRequest, validateCreatePayout, validateSubmitPayoutUpi } from '../middleware/validation';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protected routes
router.post('/', 
  authenticateToken,
  requireRole(['vendor', 'admin']), 
  paymentLimiter, 
  validatePaymentRequest, 
  createPayment
);

// Create payout request (returns URL)
router.post('/payouts',
  authenticateToken,
  requireRole(['vendor', 'admin']),
  paymentLimiter,
  validateCreatePayout,
  createPayout
);

// No public UPI submission endpoints; the URL is for customer entry only
router.post('/payouts/submit', validateSubmitPayoutUpi, submitPayoutUpi);

router.get('/transactions', authenticateToken, requireRole(['admin']), getTransactions);
router.get('/transactions/:transactionId', authenticateToken, requireRole(['admin', 'vendor', 'user']), getTransaction);

// Webhook routes (no authentication required)
router.post('/webhooks/:gateway', handleWebhook);

export default router;
