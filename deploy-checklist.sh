#!/bin/bash

# LedgerFlow Deployment Checklist Script
# This script helps verify your deployment configuration

echo "🚀 LedgerFlow Deployment Checklist"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
echo "📋 Checking configuration files..."
echo ""

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env exists"
else
    echo -e "${RED}✗${NC} backend/.env missing - copy from backend/.env.example"
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} frontend .env exists"
else
    echo -e "${YELLOW}⚠${NC} frontend .env missing - will use defaults"
fi

echo ""
echo "🔍 Checking backend environment variables..."
echo ""

if [ -f "backend/.env" ]; then
    # Check for required variables
    if grep -q "MONGODB_URI=" backend/.env; then
        echo -e "${GREEN}✓${NC} MONGODB_URI configured"
    else
        echo -e "${RED}✗${NC} MONGODB_URI missing"
    fi
    
    if grep -q "JWT_SECRET=" backend/.env; then
        echo -e "${GREEN}✓${NC} JWT_SECRET configured"
    else
        echo -e "${RED}✗${NC} JWT_SECRET missing"
    fi
    
    if grep -q "FRONTEND_URL=" backend/.env; then
        echo -e "${GREEN}✓${NC} FRONTEND_URL configured"
    else
        echo -e "${RED}✗${NC} FRONTEND_URL missing"
    fi
fi

echo ""
echo "📦 Checking dependencies..."
echo ""

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${RED}✗${NC} Frontend dependencies missing - run: npm install"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${RED}✗${NC} Backend dependencies missing - run: cd backend && npm install"
fi

echo ""
echo "🔧 Checking Git configuration..."
echo ""

if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✓${NC} Git remote configured"
        git remote -v
    else
        echo -e "${YELLOW}⚠${NC} Git remote not configured"
        echo "   Run: git remote add origin <YOUR_GITHUB_REPO_URL>"
    fi
else
    echo -e "${RED}✗${NC} Git not initialized"
    echo "   Run: git init"
fi

echo ""
echo "📝 Deployment URLs to configure:"
echo ""
echo "Backend (Render):"
echo "  - Will be: https://ledgerflow-backend.onrender.com"
echo "  - Update FRONTEND_URL in Render environment variables"
echo ""
echo "Frontend (Vercel):"
echo "  - Will be: https://ledgerflow-olive.vercel.app (or your custom domain)"
echo "  - Update VITE_API_URL in Vercel environment variables"
echo ""

echo "✅ Next Steps:"
echo ""
echo "1. Push code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push -u origin main"
echo ""
echo "2. Deploy backend on Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect GitHub repo"
echo "   - Set root directory: backend"
echo "   - Add environment variables"
echo ""
echo "3. Deploy frontend on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import GitHub repo"
echo "   - Add VITE_API_URL environment variable"
echo ""
echo "4. Update CORS:"
echo "   - Update FRONTEND_URL on Render with Vercel URL"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
