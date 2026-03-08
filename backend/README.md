# LedgerFlow Backend API

Backend API for LedgerFlow - A comprehensive ledger and accounting management system.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ledgerflow
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8080
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For Windows (if installed as service)
net start MongoDB

# For macOS/Linux
mongod
```

### 4. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Customers
- `GET /api/customers` - Get all customers (Protected)
- `GET /api/customers/:id` - Get single customer (Protected)
- `POST /api/customers` - Create customer (Protected)
- `PUT /api/customers/:id` - Update customer (Protected)
- `DELETE /api/customers/:id` - Delete customer (Protected)
- `PATCH /api/customers/:id/toggle-status` - Toggle customer status (Protected)

### Transactions
- `GET /api/transactions` - Get all transactions (Protected)
- `GET /api/transactions/:id` - Get single transaction (Protected)
- `POST /api/transactions` - Create transaction (Protected)
- `PUT /api/transactions/:id` - Update transaction (Protected)
- `DELETE /api/transactions/:id` - Delete transaction (Protected)

### Products
- `GET /api/products` - Get all products (Protected)
- `GET /api/products/:id` - Get single product (Protected)
- `POST /api/products` - Create product (Protected)
- `PUT /api/products/:id` - Update product (Protected)
- `DELETE /api/products/:id` - Delete product (Protected)

### Sales
- `GET /api/sales` - Get all sales (Protected)
- `GET /api/sales/:id` - Get single sale (Protected)
- `POST /api/sales` - Create sale (Protected)
- `PUT /api/sales/:id` - Update sale (Protected)
- `DELETE /api/sales/:id` - Delete sale (Protected)

### Activity Logs
- `GET /api/activity-logs` - Get activity logs (Protected)
- `DELETE /api/activity-logs/:id` - Delete single log (Protected)
- `DELETE /api/activity-logs` - Clear all logs (Protected)

### Reminders
- `GET /api/reminders` - Get all reminders (Protected)
- `GET /api/reminders/pending` - Get pending reminders (Protected)
- `POST /api/reminders` - Create reminder (Protected)
- `POST /api/reminders/generate-daily` - Generate daily reminders (Protected)
- `PUT /api/reminders/:id` - Update reminder (Protected)
- `PATCH /api/reminders/:id/mark-sent` - Mark reminder as sent (Protected)
- `DELETE /api/reminders/:id` - Delete reminder (Protected)

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Testing with Postman/Thunder Client

1. Register a new user: `POST /api/auth/register`
2. Login: `POST /api/auth/login` (returns token)
3. Use the token in Authorization header for protected routes

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   └── server.js              # Entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Notes

- All dates are stored in ISO format
- Customer balance is automatically calculated from transactions
- Product stock is automatically updated from sales
- Activity logs are created automatically for major actions
