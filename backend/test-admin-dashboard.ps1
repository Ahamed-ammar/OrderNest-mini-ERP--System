# Test Admin Dashboard and Analytics Endpoints

$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Admin Dashboard and Analytics ===" -ForegroundColor Cyan
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

# Step 2: Get Dashboard Metrics
Write-Host "Step 2: Get Dashboard Metrics" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $adminToken"
}

$dashboardResponse = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" -Method Get -Headers $headers
Write-Host "Dashboard Metrics:" -ForegroundColor Green
Write-Host "  Orders Today: $($dashboardResponse.data.ordersToday)" -ForegroundColor White
Write-Host "  Revenue Today: Rs. $($dashboardResponse.data.revenueToday)" -ForegroundColor White
Write-Host "  Pending Orders: $($dashboardResponse.data.pendingOrders)" -ForegroundColor White
Write-Host ""
Write-Host "  Order Counts (Last 7 Days):" -ForegroundColor White
$dashboardResponse.data.orderCountsLast7Days | ForEach-Object {
    Write-Host "    $($_.date): $($_.count) orders" -ForegroundColor Gray
}
Write-Host ""
Write-Host "  Revenue (Last 7 Days):" -ForegroundColor White
$dashboardResponse.data.revenueLast7Days | ForEach-Object {
    Write-Host "    $($_.date): Rs. $($_.revenue)" -ForegroundColor Gray
}
Write-Host ""

# Step 3: Get Revenue Analytics
Write-Host "Step 3: Get Revenue Analytics (Last 30 Days)" -ForegroundColor Yellow
$endDate = Get-Date -Format "yyyy-MM-dd"
$startDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd")

$analyticsResponse = Invoke-RestMethod -Uri "$baseUrl/admin/analytics/revenue?startDate=$startDate&endDate=$endDate" -Method Get -Headers $headers
Write-Host "Revenue Analytics:" -ForegroundColor Green
Write-Host "  Date Range: $startDate to $endDate" -ForegroundColor White
Write-Host "  Total Days with Orders: $($analyticsResponse.data.revenueData.Count)" -ForegroundColor White
Write-Host ""
Write-Host "  Most Ordered Products:" -ForegroundColor White
$analyticsResponse.data.mostOrderedProducts | ForEach-Object {
    Write-Host "    $($_.productName): $($_.totalQuantity) kg ($($_.orderCount) orders)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "  Pickup vs Delivery:" -ForegroundColor White
Write-Host "    Pickup: $($analyticsResponse.data.pickupVsDelivery.pickup)% ($($analyticsResponse.data.pickupVsDelivery.pickupCount) orders)" -ForegroundColor Gray
Write-Host "    Delivery: $($analyticsResponse.data.pickupVsDelivery.delivery)% ($($analyticsResponse.data.pickupVsDelivery.deliveryCount) orders)" -ForegroundColor Gray
Write-Host "    Total: $($analyticsResponse.data.pickupVsDelivery.total) orders" -ForegroundColor Gray
Write-Host ""

# Step 4: Export CSV Report
Write-Host "Step 4: Export CSV Report" -ForegroundColor Yellow
$csvUrl = "$baseUrl/admin/reports/export?startDate=$startDate&endDate=$endDate"
$csvFile = "revenue-report-$startDate-to-$endDate.csv"

try {
    Invoke-WebRequest -Uri $csvUrl -Method Get -Headers $headers -OutFile $csvFile
    Write-Host "CSV report exported successfully: $csvFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "CSV Content Preview:" -ForegroundColor White
    Get-Content $csvFile -Head 10 | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Gray
    }
} catch {
    Write-Host "Failed to export CSV: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== All Tests Completed ===" -ForegroundColor Cyan
