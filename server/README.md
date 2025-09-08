# Payment Aggregator Backend

A robust payment aggregator backend built with Node.js, Express, TypeScript, and Sequelize with MySQL.

## Features

- **Multi-Gateway Support**: Stripe, PayPal, and Razorpay integration
- **User Authentication**: JWT-based authentication with role-based access control
- **Transaction Management**: Complete transaction lifecycle management
- **Webhook Handling**: Secure webhook processing for payment status updates
- **Rate Limiting**: Built-in rate limiting for API protection
- **Input Validation**: Comprehensive request validation using express-validator
- **Database**: MySQL with Sequelize ORM
- **Security**: Helmet, CORS, and other security middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payment-aggregator-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=payment_aggregator
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Payment Gateway Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

5. Create the MySQL database:
```sql
CREATE DATABASE payment_aggregator;
```

6. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## API Documentation

Swagger UI has been removed. Use the Postman collection included in the repo:

- Import `postman_collection.json` into Postman
- Create an environment with:
  - `baseUrl` e.g. `http://localhost:3000/api/v1`
  - `authToken` for the Bearer token (optional)
- Run requests in the Auth and Payments folders

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Payments
- `POST /api/v1/payments` - Create payment (protected)
- `GET /api/v1/payments/transactions` - Get user transactions (protected)
- `GET /api/v1/payments/transactions/:id` - Get specific transaction (protected)
- `POST /api/v1/payments/webhooks/:gateway` - Webhook endpoint

### System
- `GET /api/v1/health` - API health status

## Realtime updates (Socket.IO)

Server exposes a Socket.IO endpoint on the same origin as the API. CORS for sockets is controlled via `SOCKET_ORIGINS` (comma-separated).

Connect example (client):

```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000', { auth: { userId: '<currentUserId>' } });
socket.on('connect', () => console.log('connected'));
socket.on('payout:created', (payload) => console.log('payout created', payload));
```

Events:
- `payout:created` payload:
```json
{
  "id": "<payoutId>",
  "userId": "<userId>",
  "amount": 100.5,
  "currency": "INR",
  "status": "INITIATED",
  "url": "http://.../payouts/<token>",
  "token": "<token>",
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Sequelize models
├── routes/          # Express routes
├── services/        # Business logic services
├── types/           # TypeScript type definitions
└── server.ts        # Application entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Database Migrations

The application uses Sequelize's `sync` method for development. For production, consider using proper migrations.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- SQL injection protection (Sequelize)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
