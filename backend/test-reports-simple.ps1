# Simple test for Reports Page endpoints
Write-Host "Testing Reports Page Endpoints" -ForegroundColor Cyan
Write-Host ""

# Login
Write-Host "1. Logging in as admin..." -ForegroundColor Yellow
$loginBody = '{"username":"admin","password":"admin123"}'
$loginResp = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/admin/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $loginResp.data.token
Write-Host "✓ Logged in" -ForegroundColor Green
Write-Host ""

# Test analytics endpoint
Write-Host "2. Testing analytics endpoint..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $token" }
$endDate = Get-Date -Format "yyyy-MM-dd"
$startDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd")

$url = "http://localhost:5000/api/admin/analytics/revenue?startDate=$startDate`&endDate=$endDate"
try {
    $analytics = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    Write-Host "✓ Analytics fetched" -ForegroundColor Green
    Write-Host "  Most Ordered Products: $($analytics.data.mostOrderedProducts.Count)" -ForegroundColor Gray
    Write-Host "  Pickup/Delivery Total: $($analytics.data.pickupVsDelivery.total)" -ForegroundColor Gray
    Write-Host "  Revenue Days: $($analytics.data.revenueData.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test CSV export
Write-Host "3. Testing CSV export..." -ForegroundColor Yellow
$exportUrl = "http://localhost:5000/api/admin/reports/export?startDate=$startDate`&endDate=$endDate"
try {
    $csv = Invoke-WebRequest -Uri $exportUrl -Method Get -Headers $headers
    Write-Host "✓ CSV exported" -ForegroundColor Green
    Write-Host "  Content-Type: $($csv.Headers['Content-Type'])" -ForegroundColor Gray
    $lines = ($csv.Content -split "`n").Count
    Write-Host "  Lines: $lines" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "Testing Complete!" -ForegroundColor Cyan
