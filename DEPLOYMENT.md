# LedgerFlow Deployment Guide

Complete guide to deploy LedgerFlow frontend on Vercel and backend on Render.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- MongoDB Atlas account (already set up)

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

The backend is already configured for production. Verify these files:

**backend/.env** (for local development only - DO NOT commit):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://khatabook:khatabook%4001@cluster0.braymvj.mongodb.net/ledger-magic?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ledger-magic-super-secret-key-2024-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=https://ledgerflow-olive.vercel.app
```

### Step 2: Push Code to GitHub

```bash
cd ledger-magic-main
git init
git add .
git commit -m "Initial commit - LedgerFlow"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to [https://render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- Name: `ledgerflow-backend`
- Region: Choose closest to you
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables** (Click "Add Environment Variable"):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://khatabook:khatabook%4001@cluster0.braymvj.mongodb.net/ledger-magic?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ledger-magic-super-secret-key-2024-change-in-production-CHANGE-THIS
JWT_EXPIRE=7d
FRONTEND_URL=https://ledgerflow-olive.vercel.app
```

**Important:** Change the JWT_SECRET to a strong random string!

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL (e.g., `https://ledgerflow-backend.onrender.com`)

### Step 4: Test Backend

Visit: `https://your-backend-url.onrender.com/`

You should see:
```json
{"message": "LedgerFlow API is running"}
```

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Update Frontend Environment Variables

Create/update `.env` file in the root directory:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Replace** `your-backend-url.onrender.com` with your actual Render backend URL!

### Step 2: Deploy on Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
cd ledger-magic-main
vercel login
vercel
```

**Option B: Using Vercel Dashboard**
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`

6. Click "Deploy"

### Step 3: Update Backend CORS

After getting your Vercel URL, update the backend CORS settings:

1. Go to Render Dashboard → Your Service → Environment
2. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Save and wait for auto-redeploy

---

## Part 3: Verification & Testing

### Test Backend Endpoints

```bash
# Test API is running
curl https://your-backend-url.onrender.com/

# Test registration
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Test login
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to register a new account
3. Try to login
4. Add a customer
5. Add a transaction
6. Check if data persists after refresh

---

## Part 4: Common Issues & Solutions

### Issue 1: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check backend CORS configuration in `backend/src/server.js`
2. Ensure your Vercel URL is in the allowed origins
3. Update `FRONTEND_URL` environment variable on Render
4. Redeploy backend

### Issue 2: API Not Found (404)

**Error:** `GET https://your-app.vercel.app/api/... 404`

**Solution:**
1. Check `VITE_API_URL` environment variable on Vercel
2. Should be: `https://your-backend-url.onrender.com/api` (with `/api` at the end)
3. Redeploy frontend

### Issue 3: MongoDB Connection Failed

**Error:** `MongoServerError: Authentication failed`

**Solution:**
1. Check MongoDB Atlas credentials
2. Ensure IP whitelist includes `0.0.0.0/0` (allow all) in MongoDB Atlas
3. Verify `MONGODB_URI` environment variable on Render
4. Check if password has special characters (URL encode them: `@` → `%40`)

### Issue 4: Render Free Tier Sleep

**Issue:** Backend takes 30+ seconds to respond on first request

**Solution:**
- This is normal for Render free tier (spins down after 15 min of inactivity)
- Upgrade to paid plan for always-on service
- Or use a cron job to ping your backend every 10 minutes

### Issue 5: Environment Variables Not Working

**Solution:**
1. Vercel: Redeploy after adding environment variables
2. Render: Environment variables auto-redeploy
3. Check variable names (case-sensitive)
4. For Vite, variables must start with `VITE_`

---

## Part 5: Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables set correctly
- [ ] CORS configured with production URLs
- [ ] JWT_SECRET changed from default
- [ ] Registration works
- [ ] Login works
- [ ] Data persists after refresh
- [ ] All API endpoints working
- [ ] Mobile responsive (test on phone)
- [ ] PWA manifest configured
- [ ] SSL/HTTPS working (automatic on Vercel/Render)

---

## Part 6: Monitoring & Maintenance

### Render Dashboard
- Monitor backend logs
- Check deployment status
- View resource usage

### Vercel Dashboard
- Monitor frontend deployments
- Check build logs
- View analytics

### MongoDB Atlas
- Monitor database connections
- Check storage usage
- View query performance

---

## Part 7: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### For Render (Backend)
1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Update DNS records
4. Update `FRONTEND_URL` and CORS settings

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Logs
2. Check Vercel logs: Dashboard → Deployments → View Function Logs
3. Check browser console for frontend errors
4. Check MongoDB Atlas logs

---

## Quick Reference

**Backend URL:** `https://your-backend-url.onrender.com`
**Frontend URL:** `https://your-app.vercel.app`
**MongoDB:** `mongodb+srv://khatabook:***@cluster0.braymvj.mongodb.net/`

**Environment Variables:**
- Backend: `NODE_ENV`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `FRONTEND_URL`
- Frontend: `VITE_API_URL`

---

## Next Steps

1. Set up custom domain
2. Configure email notifications (future feature)
3. Set up automated backups for MongoDB
4. Add monitoring/alerting (e.g., UptimeRobot)
5. Implement CI/CD pipeline
