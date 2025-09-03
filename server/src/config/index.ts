import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    name: process.env.DB_NAME || 'payment_aggregator',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  } as const,
  
  paymentGateways: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
      mode: process.env.PAYPAL_MODE || 'sandbox'
    }
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
