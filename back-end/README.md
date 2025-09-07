# E-commerce Backend API

A Node.js/Express backend API for the e-commerce application with JSON file storage.

## Features

- RESTful API with Express.js
- JWT Authentication
- JSON file-based data storage
- Product catalog management
- User registration and authentication
- Order management
- Image serving
- CORS enabled

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Running the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/gender/:gender` - Get products by gender

### Orders (Authenticated)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get single order
- `PATCH /api/orders/:orderId/status` - Update order status

### Users (Authenticated)
- `PUT /api/users/profile` - Update user profile

### Static Files
- `GET /images/*` - Serve product images

## Data Storage

Data is stored in JSON files in the `/data` directory:
- `products.json` - Product catalog
- `users.json` - User accounts
- `orders.json` - Order history

## Sample API Calls

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Order (requires auth token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"items":[{"sku":"PROD-001","name":"Test Product","price":29.99,"quantity":1}],"total":29.99}'
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Health Check

Check if the API is running:
```bash
curl http://localhost:5000/api/health
```
