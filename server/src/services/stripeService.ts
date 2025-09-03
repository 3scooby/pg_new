import { PaymentRequest, PaymentResponse } from '../types';

export const stripeService = {
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock Stripe payment creation with static values
      const mockPaymentIntentId = `pi_stripe_${Date.now()}`;
      const mockPaymentUrl = `https://checkout.stripe.com/pay/${mockPaymentIntentId}`;

      console.log('Mock Stripe Payment Created:', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        customerEmail: paymentData.customerEmail
      });

      return {
        success: true,
        transactionId: mockPaymentIntentId,
        paymentUrl: mockPaymentUrl,
        gatewayResponse: {
          id: mockPaymentIntentId,
          amount: Math.round(paymentData.amount * 100),
          currency: paymentData.currency.toLowerCase(),
          status: 'requires_payment_method',
          client_secret: `pi_${mockPaymentIntentId}_secret_mock`
        }
      };
    } catch (error) {
      console.error('Stripe payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async handleWebhook(payload: any): Promise<string | null> {
    try {
      console.log('Mock Stripe Webhook Received:', payload);
      
      // Mock webhook processing
      const event = payload;
      
      if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
        return event.data?.object?.id || 'mock_transaction_id';
      }
      
      return null;
    } catch (error) {
      console.error('Stripe webhook error:', error);
      return null;
    }
  },

  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      console.log('Mock Stripe Payment Status Check:', paymentIntentId);
      // Mock status - in real implementation, this would check Stripe API
      return 'succeeded';
    } catch (error) {
      console.error('Stripe payment status error:', error);
      return 'unknown';
    }
  }
};