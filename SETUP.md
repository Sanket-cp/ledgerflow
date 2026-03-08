# Ledger Magic - Complete Setup Guide

## Prerequisites

Before starting, make sure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager

## Step-by-Step Setup

### 1. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/ledger-magic`)

### 2. Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/ledger-magic
   
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ledger-magic
   
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running in development mode on port 5000
   MongoDB Connected: localhost
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to project root:
   ```bash
   cd ..  # if you're in backend folder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the frontend:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

### 4. Test the Application

1. Open browser and go to: `http://localhost:5173`

2. Register a new account:
   - Click "Register" or go to `/register`
   - Fill in your details
   - Submit

3. You should be logged in and see the dashboard

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Make sure MongoDB is running

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Change PORT in backend/.env to another port (e.g., 5001)

### Frontend Issues

**API Connection Error:**
- Check if backend is running on port 5000
- Verify VITE_API_URL in .env matches backend URL
- Check browser console for CORS errors

**Module Not Found:**
```
Error: Cannot find module 'axios'
```
Solution: Run `npm install` again

## Production Deployment

### Backend Deployment (Example: Railway/Render)

1. Set environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=<your-production-mongodb-uri>
   JWT_SECRET=<strong-random-secret>
   FRONTEND_URL=<your-frontend-url>
   ```

2. Deploy backend code

### Frontend Deployment (Example: Vercel/Netlify)

1. Set environment variable:
   ```
   VITE_API_URL=<your-backend-api-url>
   ```

2. Build command: `npm run build`
3. Output directory: `dist`

## Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev` (in root)
3. Make changes
4. Both servers auto-reload on file changes

## Testing API with Postman

1. Register user:
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. Copy the token from response

3. Test protected endpoint:
   ```
   GET http://localhost:5000/api/customers
   Headers: {
     "Authorization": "Bearer <your-token>"
   }
   ```

## Next Steps

- Customize the application for your needs
- Add more features
- Deploy to production
- Set up proper backup for MongoDB

## Support

For issues or questions:
1. Check the error logs in terminal
2. Review this setup guide
3. Check MongoDB connection
4. Verify all environment variables are set correctly
