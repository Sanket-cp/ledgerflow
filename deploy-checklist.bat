@echo off
REM LedgerFlow Deployment Checklist Script for Windows
REM This script helps verify your deployment configuration

echo.
echo ================================
echo LedgerFlow Deployment Checklist
echo ================================
echo.

echo Checking configuration files...
echo.

if exist "backend\.env" (
    echo [OK] backend\.env exists
) else (
    echo [MISSING] backend\.env - copy from backend\.env.example
)

if exist ".env" (
    echo [OK] frontend .env exists
) else (
    echo [WARNING] frontend .env missing - will use defaults
)

echo.
echo Checking dependencies...
echo.

if exist "node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [MISSING] Frontend dependencies - run: npm install
)

if exist "backend\node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [MISSING] Backend dependencies - run: cd backend ^&^& npm install
)

echo.
echo Checking Git configuration...
echo.

if exist ".git" (
    echo [OK] Git repository initialized
    git remote -v 2>nul
    if errorlevel 1 (
        echo [WARNING] Git remote not configured
        echo    Run: git remote add origin ^<YOUR_GITHUB_REPO_URL^>
    ) else (
        echo [OK] Git remote configured
    )
) else (
    echo [MISSING] Git not initialized
    echo    Run: git init
)

echo.
echo ================================
echo Deployment URLs to configure:
echo ================================
echo.
echo Backend (Render):
echo   - Will be: https://ledgerflow-backend.onrender.com
echo   - Update FRONTEND_URL in Render environment variables
echo.
echo Frontend (Vercel):
echo   - Will be: https://ledgerflow-olive.vercel.app
echo   - Update VITE_API_URL in Vercel environment variables
echo.

echo ================================
echo Next Steps:
echo ================================
echo.
echo 1. Push code to GitHub:
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git push -u origin main
echo.
echo 2. Deploy backend on Render:
echo    - Go to https://render.com
echo    - Create new Web Service
echo    - Connect GitHub repo
echo    - Set root directory: backend
echo    - Add environment variables
echo.
echo 3. Deploy frontend on Vercel:
echo    - Go to https://vercel.com
echo    - Import GitHub repo
echo    - Add VITE_API_URL environment variable
echo.
echo 4. Update CORS:
echo    - Update FRONTEND_URL on Render with Vercel URL
echo.
echo See DEPLOYMENT.md for detailed instructions
echo.
pause
