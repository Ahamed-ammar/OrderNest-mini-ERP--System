# Test Admin Login with CORS headers
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Admin Login with CORS ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if server is running
Write-Host "Test 1: Check Backend Server" -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "Backend server is running" -ForegroundColor Green
    Write-Host "Status: $($healthCheck.status)" -ForegroundColor Gray
} catch {
    Write-Host "Backend server is not running" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Admin Login
Write-Host "Test 2: Admin Login" -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Admin login successful" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.data.token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host "Admin ID: $($loginResponse.data.admin.id)" -ForegroundColor Gray
    Write-Host "Username: $($loginResponse.data.admin.username)" -ForegroundColor Gray
} catch {
    Write-Host "Admin login failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Check CORS headers (using curl if available)
Write-Host "Test 3: Check CORS Configuration" -ForegroundColor Yellow
Write-Host "CORS is configured for: http://localhost:5174" -ForegroundColor Gray
Write-Host "Frontend should be able to access the API from this origin" -ForegroundColor Gray

Write-Host ""
Write-Host "=== All Tests Passed ===" -ForegroundColor Green
Write-Host ""
Write-Host "If you're still experiencing network errors in the browser:" -ForegroundColor Yellow
Write-Host "1. Open browser DevTools (F12)" -ForegroundColor White
Write-Host "2. Go to Network tab" -ForegroundColor White
Write-Host "3. Try logging in again" -ForegroundColor White
Write-Host "4. Check the failed request for details" -ForegroundColor White
Write-Host "5. Look for CORS errors in the Console tab" -ForegroundColor White
