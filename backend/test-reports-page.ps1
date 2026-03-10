# Test script for Reports Page functionality
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Reports Page Endpoints ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Admin Login
Write-Host "Step 1: Admin Login..." -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -ContentType "application/json" -Body $loginBody

$token = $loginResponse.data.token
Write-Host "✓ Admin logged in successfully" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Step 2: Get Revenue Analytics
Write-Host "Step 2: Testing Revenue Analytics Endpoint..." -ForegroundColor Yellow
$endDate = Get-Date -Format "yyyy-MM-dd"
$startDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd")

Write-Host "Date Range: $startDate to $endDate" -ForegroundColor Gray

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $analyticsUrl = "{0}/admin/analytics/revenue?startDate={1}`&endDate={2}" -f $baseUrl, $startDate, $endDate
    $analyticsResponse = Invoke-RestMethod -Uri $analyticsUrl -Method Get -Headers $headers
    
    Write-Host "✓ Revenue analytics fetched successfully" -ForegroundColor Green
    Write-Host ""
    
    # Display Most Ordered Products
    Write-Host "Most Ordered Products:" -ForegroundColor Cyan
    if ($analyticsResponse.data.mostOrderedProducts.Count -gt 0) {
        foreach ($product in $analyticsResponse.data.mostOrderedProducts) {
            Write-Host "  - $($product.productName): $($product.totalQuantity) kg ($($product.orderCount) orders)" -ForegroundColor White
        }
    } else {
        Write-Host "  No products found" -ForegroundColor Gray
    }
    Write-Host ""
    
    # Display Pickup vs Delivery
    Write-Host "Pickup vs Delivery:" -ForegroundColor Cyan
    $pvd = $analyticsResponse.data.pickupVsDelivery
    Write-Host "  - Pickup: $($pvd.pickupCount) orders ($($pvd.pickup)%)" -ForegroundColor White
    Write-Host "  - Delivery: $($pvd.deliveryCount) orders ($($pvd.delivery)%)" -ForegroundColor White
    Write-Host "  - Total: $($pvd.total) orders" -ForegroundColor White
    Write-Host ""
    
    # Display Revenue Summary
    Write-Host "Revenue Summary:" -ForegroundColor Cyan
    if ($analyticsResponse.data.revenueData.Count -gt 0) {
        $totalRevenue = 0
        $totalOrders = 0
        foreach ($day in $analyticsResponse.data.revenueData) {
            $totalRevenue += $day.revenue
            $totalOrders += $day.orderCount
        }
        Write-Host "  - Total Revenue: ₹$totalRevenue" -ForegroundColor White
        Write-Host "  - Total Orders: $totalOrders" -ForegroundColor White
        Write-Host "  - Days with data: $($analyticsResponse.data.revenueData.Count)" -ForegroundColor White
    } else {
        Write-Host "  No revenue data found" -ForegroundColor Gray
    }
    Write-Host ""
}
catch {
    Write-Host "✗ Failed to fetch analytics: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Step 3: Test CSV Export
Write-Host "Step 3: Testing CSV Export Endpoint..." -ForegroundColor Yellow

try {
    $exportUrl = "{0}/admin/reports/export?startDate={1}`&endDate={2}" -f $baseUrl, $startDate, $endDate
    $csvResponse = Invoke-WebRequest -Uri $exportUrl -Method Get -Headers $headers
    
    Write-Host "✓ CSV export successful" -ForegroundColor Green
    Write-Host "Content-Type: $($csvResponse.Headers['Content-Type'])" -ForegroundColor Gray
    Write-Host "Content-Disposition: $($csvResponse.Headers['Content-Disposition'])" -ForegroundColor Gray
    Write-Host ""
    Write-Host "CSV Preview (first 10 lines):" -ForegroundColor Cyan
    $csvLines = $csvResponse.Content -split "`n" | Select-Object -First 10
    foreach ($line in $csvLines) {
        Write-Host "  $line" -ForegroundColor White
    }
    Write-Host ""
}
catch {
    Write-Host "✗ Failed to export CSV: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Step 4: Test with invalid date range
Write-Host "Step 4: Testing Error Handling (Invalid Date Range)..." -ForegroundColor Yellow

try {
    $invalidUrl = "{0}/admin/analytics/revenue?startDate=2024-12-31`&endDate=2024-01-01" -f $baseUrl
    $invalidResponse = Invoke-RestMethod -Uri $invalidUrl -Method Get -Headers $headers
    Write-Host "✗ Should have returned an error for invalid date range" -ForegroundColor Red
}
catch {
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorResponse.error.code -eq "VALIDATION_ERROR") {
        Write-Host "✓ Correctly rejected invalid date range" -ForegroundColor Green
        Write-Host "Error message: $($errorResponse.error.message)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Unexpected error: $($errorResponse.error.message)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "=== Reports Page Testing Complete ===" -ForegroundColor Cyan
