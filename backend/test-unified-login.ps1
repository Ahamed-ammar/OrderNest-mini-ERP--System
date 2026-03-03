# Test Unified Login Page (Customer and Admin)

$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Unified Login Page ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Admin Login through unified endpoint
Write-Host "Test 1: Admin Login (username: admin)" -ForegroundColor Yellow
try {
    $adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -ContentType "application/json" -Body (@{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json)

    Write-Host "  + Admin login successful" -ForegroundColor Green
    Write-Host "  Username: $($adminLoginResponse.data.admin.username)" -ForegroundColor Gray
    Write-Host "  Role: Admin" -ForegroundColor Gray
    Write-Host "  Token: $($adminLoginResponse.data.token.Substring(0, 20))..." -ForegroundColor Gray
    
    $adminToken = $adminLoginResponse.data.token
} catch {
    Write-Host "  - Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Verify admin can access dashboard
Write-Host "Test 2: Admin Dashboard Access" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    $dashboardResponse = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers $headers
    Write-Host "  + Dashboard access successful" -ForegroundColor Green
    Write-Host "  Orders Today: $($dashboardResponse.data.ordersToday)" -ForegroundColor Gray
    Write-Host "  Revenue Today: Rs. $($dashboardResponse.data.revenueToday)" -ForegroundColor Gray
} catch {
    Write-Host "  - Dashboard access failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Customer Login (for comparison)
Write-Host "Test 3: Customer Login (regular user)" -ForegroundColor Yellow
try {
    $customerLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -ContentType "application/json" -Body (@{
        usernameOrEmail = "testuser"
        password = "password123"
    } | ConvertTo-Json)

    Write-Host "  + Customer login successful" -ForegroundColor Green
    Write-Host "  Username: $($customerLoginResponse.data.customer.username)" -ForegroundColor Gray
    Write-Host "  Role: Customer" -ForegroundColor Gray
} catch {
    Write-Host "  - Customer login failed (may not exist): $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Frontend Login Page: http://localhost:5174/login" -ForegroundColor White
Write-Host ""
Write-Host "To login as Admin:" -ForegroundColor Yellow
Write-Host "  1. Go to http://localhost:5174/login" -ForegroundColor White
Write-Host "  2. Enter username: admin" -ForegroundColor White
Write-Host "  3. Enter password: admin123" -ForegroundColor White
Write-Host "  4. You will be redirected to: http://localhost:5174/admin/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "To login as Customer:" -ForegroundColor Yellow
Write-Host "  1. Go to http://localhost:5174/login" -ForegroundColor White
Write-Host "  2. Enter your customer username/email and password" -ForegroundColor White
Write-Host "  3. You will be redirected to: http://localhost:5174/" -ForegroundColor White
Write-Host ""

Write-Host "=== Test Completed ===" -ForegroundColor Cyan
