import { PaymentRequest, PaymentResponse } from '../types';

export const paypalService = {
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock PayPal payment creation with static values
      const mockPaymentId = `paypal_${Date.now()}`;
      const mockApprovalUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${mockPaymentId}`;

      console.log('Mock PayPal Payment Created:', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        customerEmail: paymentData.customerEmail
      });

      return {
        success: true,
        transactionId: mockPaymentId,
        paymentUrl: mockApprovalUrl,
        gatewayResponse: {
          id: mockPaymentId,
          intent: 'sale',
          state: 'created',
          payer: {
            payment_method: 'paypal'
          },
          transactions: [{
            amount: {
              total: paymentData.amount.toString(),
              currency: paymentData.currency
            },
            description: paymentData.description
          }]
        }
      };
    } catch (error) {
      console.error('PayPal payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async handleWebhook(payload: any): Promise<string | null> {
    try {
      console.log('Mock PayPal Webhook Received:', payload);
      
      // Mock webhook processing
      const eventType = payload.event_type;
      
      if (eventType === 'PAYMENT.SALE.COMPLETED' || eventType === 'PAYMENT.SALE.DENIED') {
        return payload.resource?.custom || 'mock_transaction_id';
      }
      
      return null;
    } catch (error) {
      console.error('PayPal webhook error:', error);
      return null;
    }
  },

  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      console.log('Mock PayPal Payment Status Check:', paymentId);
      // Mock status - in real implementation, this would check PayPal API
      return 'completed';
    } catch (error) {
      console.error('PayPal payment status error:', error);
      return 'unknown';
    }
  }
};