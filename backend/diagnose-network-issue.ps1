# Comprehensive Network Diagnostics
Write-Host "=== Network Diagnostics for Admin Login ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Backend Server
Write-Host "1. Checking Backend Server..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 3
    Write-Host "   [OK] Backend is running" -ForegroundColor Green
    Write-Host "   Response: $($health.message)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Backend is NOT running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Solution: Start the backend server" -ForegroundColor Yellow
    Write-Host "   Command: cd backend && npm start" -ForegroundColor White
    exit 1
}

Write-Host ""

# Step 2: Check Frontend Server
Write-Host "2. Checking Frontend Server..." -ForegroundColor Yellow
$frontendPort = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "   [OK] Frontend is running on port 5174" -ForegroundColor Green
} else {
    $frontendPort5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($frontendPort5173) {
        Write-Host "   [WARNING] Frontend is running on port 5173 (not 5174)" -ForegroundColor Yellow
        Write-Host "   This might cause CORS issues" -ForegroundColor Yellow
    } else {
        Write-Host "   [FAIL] Frontend is NOT running" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Solution: Start the frontend server" -ForegroundColor Yellow
        Write-Host "   Command: cd frontend && npm run dev" -ForegroundColor White
        exit 1
    }
}

Write-Host ""

# Step 3: Test Admin Login API
Write-Host "3. Testing Admin Login API..." -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json" -TimeoutSec 3
    Write-Host "   [OK] Admin login API is working" -ForegroundColor Green
    Write-Host "   Token received: $($loginResponse.data.token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Admin login API failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Check CORS Configuration
Write-Host "4. Checking CORS Configuration..." -ForegroundColor Yellow
$envContent = Get-Content "backend/.env" -Raw
if ($envContent -match "FRONTEND_URL=(.+)") {
    $frontendUrl = $matches[1].Trim()
    Write-Host "   FRONTEND_URL in .env: $frontendUrl" -ForegroundColor Gray
    
    if ($frontendUrl -eq "http://localhost:5174") {
        Write-Host "   [OK] CORS configured for port 5174" -ForegroundColor Green
    } elseif ($frontendUrl -eq "http://localhost:5173") {
        Write-Host "   [WARNING] CORS configured for port 5173" -ForegroundColor Yellow
        Write-Host "   But frontend might be on 5174" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [WARNING] FRONTEND_URL not found in .env" -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Check if ports are accessible
Write-Host "5. Checking Port Accessibility..." -ForegroundColor Yellow
$backendListening = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
if ($backendListening) {
    Write-Host "   [OK] Backend listening on port 5000" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Backend not listening on port 5000" -ForegroundColor Red
}

Write-Host ""

# Step 6: Test from browser perspective (using WebRequest)
Write-Host "6. Testing CORS from Browser Perspective..." -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = "http://localhost:5174"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/admin/login" `
        -Method Post `
        -Body $loginBody `
        -Headers $headers `
        -UseBasicParsing
    
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader) {
        Write-Host "   [OK] CORS headers present" -ForegroundColor Green
        Write-Host "   Access-Control-Allow-Origin: $corsHeader" -ForegroundColor Gray
    } else {
        Write-Host "   [WARNING] No CORS headers in response" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   [INFO] Could not test CORS headers" -ForegroundColor Gray
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Diagnostics Complete ===" -ForegroundColor Cyan
Write-Host ""

# Recommendations
Write-Host "Recommendations:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache and localStorage" -ForegroundColor White
Write-Host "   - Press F12 in browser" -ForegroundColor Gray
Write-Host "   - Go to Application > Storage > Clear site data" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Check browser console for errors" -ForegroundColor White
Write-Host "   - Press F12 > Console tab" -ForegroundColor Gray
Write-Host "   - Look for CORS or network errors" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Try the test page" -ForegroundColor White
Write-Host "   - Open: backend/test-admin-login.html in browser" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Check Network tab in DevTools" -ForegroundColor White
Write-Host "   - Press F12 > Network tab" -ForegroundColor Gray
Write-Host "   - Try logging in and check the request details" -ForegroundColor Gray
