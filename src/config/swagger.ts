import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Aggregator API',
      version: '1.0.0',
      description: 'A comprehensive payment aggregator backend API supporting multiple payment gateways',
      contact: {
        name: 'API Support',
        email: 'support@paymentaggregator.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server'
      },
      {
        url: 'https://api.paymentaggregator.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'username'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            username: {
              type: 'string',
              description: 'Username',
              maxLength: 50
            },
            role: {
              type: 'string',
              enum: ['admin', 'merchant', 'user'],
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              description: 'User account status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Transaction: {
          type: 'object',
          required: ['amount', 'currency', 'description', 'gateway'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Transaction unique identifier'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User who initiated the transaction'
            },
            amount: {
              type: 'number',
              format: 'decimal',
              minimum: 0.01,
              description: 'Transaction amount'
            },
            currency: {
              type: 'string',
              pattern: '^[A-Z]{3}$',
              description: 'Currency code (ISO 4217)',
              example: 'USD'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed', 'cancelled'],
              description: 'Transaction status'
            },
            gateway: {
              type: 'string',
              enum: ['stripe', 'paypal', 'razorpay'],
              description: 'Payment gateway used'
            },
            gatewayTransactionId: {
              type: 'string',
              description: 'Gateway-specific transaction ID'
            },
            description: {
              type: 'string',
              description: 'Transaction description',
              maxLength: 500
            },
            metadata: {
              type: 'object',
              description: 'Additional transaction metadata'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        PaymentRequest: {
          type: 'object',
          required: ['amount', 'currency', 'description', 'customerEmail', 'gateway'],
          properties: {
            amount: {
              type: 'number',
              format: 'decimal',
              minimum: 0.01,
              description: 'Payment amount'
            },
            currency: {
              type: 'string',
              pattern: '^[A-Z]{3}$',
              description: 'Currency code (ISO 4217)',
              example: 'USD'
            },
            description: {
              type: 'string',
              description: 'Payment description',
              maxLength: 500
            },
            customerEmail: {
              type: 'string',
              format: 'email',
              description: 'Customer email address'
            },
            customerName: {
              type: 'string',
              description: 'Customer name (optional)'
            },
            gateway: {
              type: 'string',
              enum: ['stripe', 'paypal', 'razorpay'],
              description: 'Payment gateway to use'
            },
            metadata: {
              type: 'object',
              description: 'Additional payment metadata'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data (if any)'
            },
            error: {
              type: 'string',
              description: 'Error message (if any)'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'username'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password'
            },
            username: {
              type: 'string',
              description: 'Username',
              maxLength: 50
            },
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT authentication token'
                }
              }
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
