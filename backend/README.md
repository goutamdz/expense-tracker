# Expense Tracker Backend API

A RESTful API for managing personal expenses with user authentication, category management, and expense tracking.

## 🚀 Features

- **User Authentication** - JWT-based authentication
- **Expense Management** - CRUD operations for expenses
- **Category Management** - Create and manage expense categories
- **Statistics** - Get expense analytics and reports
- **Filtering & Pagination** - Advanced querying capabilities

## 📋 Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)

## 🛠️ Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

---

## 👤 User Management

### Register User
**POST** `/user/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
**POST** `/user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile
**GET** `/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2023-09-06T10:30:00.000Z"
  }
}
```

---

## 📊 Expense Management

### Create Expense
**POST** `/expense`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 85.50,
  "date": "2023-09-06",
  "category": "64f8a1b2c3d4e5f6a7b8c9d0",
  "source": "debit",
  "description": "Weekly groceries from Walmart"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "expense": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Grocery Shopping",
    "amount": 85.5,
    "date": "2023-09-06T00:00:00.000Z",
    "category": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "shopping"
    },
    "source": "debit",
    "description": "Weekly groceries from Walmart",
    "user": "64f8a1b2c3d4e5f6a7b8c9d0",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Get All Expenses
**GET** `/expense`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category ID
- `source` (optional): Filter by source (cash, debit, credit, other)
- `startDate` (optional): Filter from date (ISO format)
- `endDate` (optional): Filter to date (ISO format)
- `sortBy` (optional): Sort field (date, amount, title) (default: date)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)

**Example Request:**
```
GET /expense?page=1&limit=5&source=debit&sortBy=amount&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "expenses": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Grocery Shopping",
      "amount": 85.5,
      "date": "2023-09-06T00:00:00.000Z",
      "category": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "shopping"
      },
      "source": "debit",
      "description": "Weekly groceries from Walmart",
      "user": "64f8a1b2c3d4e5f6a7b8c9d0"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalExpenses": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Single Expense
**GET** `/expense/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "expense": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Grocery Shopping",
    "amount": 85.5,
    "date": "2023-09-06T00:00:00.000Z",
    "category": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "shopping"
    },
    "source": "debit",
    "description": "Weekly groceries from Walmart",
    "user": "64f8a1b2c3d4e5f6a7b8c9d0"
  }
}
```

### Update Expense
**PUT** `/expense/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Grocery Shopping",
  "amount": 95.00,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "expense": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Updated Grocery Shopping",
    "amount": 95,
    "date": "2023-09-06T00:00:00.000Z",
    "category": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "shopping"
    },
    "source": "debit",
    "description": "Updated description",
    "user": "64f8a1b2c3d4e5f6a7b8c9d0"
  }
}
```

### Delete Expense
**DELETE** `/expense/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

### Get Expense Statistics
**GET** `/expense/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date for statistics (ISO format)
- `endDate` (optional): End date for statistics (ISO format)

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalAmount": 1250.75,
    "totalCount": 15,
    "byCategory": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "total": 450.25
      }
    ],
    "bySource": [
      {
        "_id": "debit",
        "total": 800.50
      },
      {
        "_id": "cash",
        "total": 450.25
      }
    ],
    "monthly": [
      {
        "_id": {
          "year": 2023,
          "month": 9
        },
        "total": 1250.75
      }
    ],
    "startDate": "2023-09-01T00:00:00.000Z",
    "endDate": "2023-09-06T23:59:59.999Z"
  }
}
```

---

## 📂 Category Management

### Get All Categories
**GET** `/category`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "shopping",
      "user": ["64f8a1b2c3d4e5f6a7b8c9d0"]
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "entertainment",
      "user": ["64f8a1b2c3d4e5f6a7b8c9d0"]
    }
  ]
}
```

### Create Category
**POST** `/category`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "transportation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully"
}
```

### Delete Category
**DELETE** `/category/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required, 3-20 chars),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Schema
```javascript
{
  title: String (required, max 100 chars),
  amount: Number (required, positive),
  date: Date (required),
  category: ObjectId (ref: 'Category', required),
  source: String (enum: ['cash', 'debit', 'credit', 'other'], required),
  user: ObjectId (ref: 'User', required),
  description: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: String (required),
  user: [ObjectId] (ref: 'User', required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## 🧪 Testing

### Using cURL Examples

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create an expense (with token):**
```bash
curl -X POST http://localhost:3000/api/v1/expense \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Grocery Shopping",
    "amount": 85.50,
    "date": "2023-09-06",
    "category": "CATEGORY_ID_HERE",
    "source": "debit",
    "description": "Weekly groceries"
  }'
```

---

## 📝 Notes

- All dates are handled in ISO format
- Amounts are stored as numbers (not strings)
- JWT tokens expire after 24 hours
- Default categories are automatically created for new users
- Categories cannot be deleted if they have associated expenses
- All responses include a `success` boolean field

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License. 