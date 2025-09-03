import { Request, Response } from 'express';
import { AuthenticatedRequest, PaymentRequest, PaymentResponse, ApiResponse } from '../types';
import Transaction from '../models/Transaction';
import { stripeService } from '../services/stripeService';
import { paypalService } from '../services/paypalService';
import { razorpayService } from '../services/razorpayService';

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       201:
 *         description: Payment initiated successfully
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
 *                   example: Payment initiated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionId:
 *                       type: string
 *                       format: uuid
 *                       description: Internal transaction ID
 *                     paymentUrl:
 *                       type: string
 *                       description: URL to complete payment
 *                     gatewayResponse:
 *                       type: object
 *                       description: Gateway-specific response
 *       400:
 *         description: Payment initiation failed or validation error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export const createPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const paymentData: PaymentRequest = req.body;

    // Create transaction record
    const transaction = await Transaction.create({
      userId: userId!,
      amount: paymentData.amount,
      currency: paymentData.currency,
      description: paymentData.description,
      gateway: paymentData.gateway,
      status: 'pending',
      metadata: paymentData.metadata
    });

    let paymentResponse: PaymentResponse;

    // Route to appropriate payment gateway
    switch (paymentData.gateway) {
      case 'stripe':
        paymentResponse = await stripeService.createPayment({
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
          gateway: paymentData.gateway,
          metadata: { transactionId: transaction.id, ...paymentData.metadata }
        });
        break;
      
      case 'paypal':
        paymentResponse = await paypalService.createPayment({
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
          gateway: paymentData.gateway,
          metadata: { transactionId: transaction.id, ...paymentData.metadata }
        });
        break;
      
      case 'razorpay':
        paymentResponse = await razorpayService.createPayment({
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
          gateway: paymentData.gateway,
          metadata: { transactionId: transaction.id, ...paymentData.metadata }
        });
        break;
      
      default:
        throw new Error(`Unsupported payment gateway: ${paymentData.gateway}`);
    }

    // Update transaction with gateway response
    if (paymentResponse.success && paymentResponse.transactionId) {
      await transaction.update({
        gatewayTransactionId: paymentResponse.transactionId,
        status: 'pending'
      });
    } else {
      await transaction.update({
        status: 'failed'
      });
    }

    const response: ApiResponse = {
      success: paymentResponse.success,
      message: paymentResponse.success ? 'Payment initiated successfully' : 'Payment initiation failed',
      data: {
        transactionId: transaction.id,
        paymentUrl: paymentResponse.paymentUrl,
        gatewayResponse: paymentResponse.gatewayResponse
      }
    };

    res.status(paymentResponse.success ? 201 : 400).json(response);
  } catch (error) {
    console.error('Create payment error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

/**
 * @swagger
 * /payments/transactions/{transactionId}:
 *   get:
 *     summary: Get a specific transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
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
 *                   example: Transaction retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export const getTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.id;

    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        userId: userId
      },
      include: ['user']
    });

    if (!transaction) {
      const response: ApiResponse = {
        success: false,
        message: 'Transaction not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Transaction retrieved successfully',
      data: { transaction }
    };

    res.json(response);
  } catch (error) {
    console.error('Get transaction error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

/**
 * @swagger
 * /payments/transactions:
 *   get:
 *     summary: Get user transactions with pagination
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of transactions per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *         description: Filter by transaction status
 *       - in: query
 *         name: gateway
 *         schema:
 *           type: string
 *           enum: [stripe, paypal, razorpay]
 *         description: Filter by payment gateway
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                   example: Transactions retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           description: Total number of transactions
 *                         page:
 *                           type: integer
 *                           description: Current page number
 *                         limit:
 *                           type: integer
 *                           description: Number of items per page
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export const getTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status, gateway } = req.query;

    const whereClause: any = { userId };
    if (status) whereClause.status = status;
    if (gateway) whereClause.gateway = gateway;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: ['user']
    });

    const response: ApiResponse = {
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get transactions error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

/**
 * @swagger
 * /payments/webhooks/{gateway}:
 *   post:
 *     summary: Handle payment gateway webhooks
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: gateway
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stripe, paypal, razorpay]
 *         description: Payment gateway name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Gateway-specific webhook payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Webhook processing failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gateway } = req.params;
    const payload = req.body;

    let transactionId: string | null = null;

    // Handle different gateway webhooks
    switch (gateway) {
      case 'stripe':
        transactionId = await stripeService.handleWebhook(payload);
        break;
      case 'paypal':
        transactionId = await paypalService.handleWebhook(payload);
        break;
      case 'razorpay':
        transactionId = await razorpayService.handleWebhook(payload);
        break;
      default:
        throw new Error(`Unsupported gateway: ${gateway}`);
    }

    if (transactionId) {
      // Update transaction status based on webhook
      const transaction = await Transaction.findByPk(transactionId);
      if (transaction) {
        // Update status based on webhook data
        // This would need to be implemented based on specific gateway webhook formats
        await transaction.update({ status: 'completed' });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
