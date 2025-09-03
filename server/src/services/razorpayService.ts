import { PaymentRequest, PaymentResponse } from '../types';

export const razorpayService = {
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock Razorpay payment creation with static values
      const mockPaymentId = `razorpay_${Date.now()}`;
      const mockPaymentUrl = `https://checkout.razorpay.com/v1/checkout.js?payment_id=${mockPaymentId}`;

      console.log('Mock Razorpay Payment Created:', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        customerEmail: paymentData.customerEmail
      });

      return {
        success: true,
        transactionId: mockPaymentId,
        paymentUrl: mockPaymentUrl,
        gatewayResponse: {
          id: mockPaymentId,
          amount: Math.round(paymentData.amount * 100), // Convert to paise
          currency: paymentData.currency,
          status: 'created',
          description: paymentData.description,
          customer: {
            email: paymentData.customerEmail,
            name: paymentData.customerName
          }
        }
      };
    } catch (error) {
      console.error('Razorpay payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async handleWebhook(payload: any): Promise<string | null> {
    try {
      console.log('Mock Razorpay Webhook Received:', payload);
      
      // Mock webhook processing
      const event = payload.event;
      
      if (event === 'payment.captured' || event === 'payment.failed') {
        return payload.payload?.payment?.entity?.id || 'mock_transaction_id';
      }
      
      return null;
    } catch (error) {
      console.error('Razorpay webhook error:', error);
      return null;
    }
  },

  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      console.log('Mock Razorpay Payment Status Check:', paymentId);
      // Mock status - in real implementation, this would check Razorpay API
      return 'captured';
    } catch (error) {
      console.error('Razorpay payment status error:', error);
      return 'unknown';
    }
  }
};
