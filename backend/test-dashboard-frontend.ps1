# Test Frontend Dashboard Page Access

$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Frontend Dashboard Access ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Admin Login
Write-Host "Step 1: Admin Login" -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -ContentType "application/json" -Body (@{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json)

$adminToken = $loginResponse.data.token
Write-Host "Admin logged in successfully" -ForegroundColor Green
Write-Host "Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Step 2: Verify Dashboard Data Structure
Write-Host "Step 2: Verify Dashboard Data Structure" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $adminToken"
}

$dashboardResponse = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers $headers

Write-Host "Checking data structure..." -ForegroundColor White
$requiredFields = @("ordersToday", "revenueToday", "pendingOrders", "orderCountsLast7Days", "revenueLast7Days")
$allFieldsPresent = $true

foreach ($field in $requiredFields) {
    if ($dashboardResponse.data.PSObject.Properties.Name -contains $field) {
        Write-Host "  + $field present" -ForegroundColor Green
    } else {
        Write-Host "  - $field missing" -ForegroundColor Red
        $allFieldsPresent = $false
    }
}

Write-Host ""

if ($allFieldsPresent) {
    Write-Host "+ All required fields present for dashboard" -ForegroundColor Green
    Write-Host ""
    Write-Host "Dashboard is ready to display:" -ForegroundColor Cyan
    Write-Host "  - Metric Cards: Orders Today ($($dashboardResponse.data.ordersToday)), Revenue Today (Rs $($dashboardResponse.data.revenueToday)), Pending Orders ($($dashboardResponse.data.pendingOrders))" -ForegroundColor White
    Write-Host "  - Orders Chart: $($dashboardResponse.data.orderCountsLast7Days.Count) data points" -ForegroundColor White
    Write-Host "  - Revenue Chart: $($dashboardResponse.data.revenueLast7Days.Count) data points" -ForegroundColor White
    Write-Host ""
    Write-Host "Frontend URL: http://localhost:5174/admin/dashboard" -ForegroundColor Yellow
    Write-Host "Note: You need to login as admin first at http://localhost:5174/admin/login" -ForegroundColor Gray
} else {
    Write-Host "- Dashboard data structure incomplete" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Completed ===" -ForegroundColor Cyan
