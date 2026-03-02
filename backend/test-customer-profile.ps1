# Test Customer Profile Endpoints
# This script tests the customer profile GET and PUT endpoints

$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Customer Profile Endpoints ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as customer to get token
Write-Host "Step 1: Logging in as customer..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body (@{
    phone = "9876543210"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.data.token
Write-Host "Login successful! Token received." -ForegroundColor Green
Write-Host ""

# Step 2: Get customer profile
Write-Host "Step 2: Getting customer profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$profileResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Get -Headers $headers
Write-Host "Profile retrieved successfully!" -ForegroundColor Green
Write-Host "Customer Data:" -ForegroundColor Cyan
$profileResponse.data | ConvertTo-Json -Depth 3
Write-Host ""

# Step 3: Update customer profile
Write-Host "Step 3: Updating customer profile..." -ForegroundColor Yellow
$updateData = @{
    name = "Updated Customer Name"
    streetType = "Center"
    houseName = "Green Villa"
    doorNo = "42A"
    landmark = "Near City Park"
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Put -Headers $headers -Body $updateData
Write-Host "Profile updated successfully!" -ForegroundColor Green
Write-Host "Updated Data:" -ForegroundColor Cyan
$updateResponse.data | ConvertTo-Json -Depth 3
Write-Host ""

# Step 4: Get customer orders (with recent orders)
Write-Host "Step 4: Getting customer orders..." -ForegroundColor Yellow
$ordersResponse = Invoke-RestMethod -Uri "$baseUrl/orders/customer/orders" -Method Get -Headers $headers
Write-Host "Orders retrieved successfully!" -ForegroundColor Green
Write-Host "Recent Orders Count: $($ordersResponse.data.recentOrders.Count)" -ForegroundColor Cyan
Write-Host "All Orders Count: $($ordersResponse.data.allOrders.Count)" -ForegroundColor Cyan

if ($ordersResponse.data.recentOrders.Count -gt 0) {
    Write-Host "`nSample Recent Order:" -ForegroundColor Cyan
    $ordersResponse.data.recentOrders[0] | ConvertTo-Json -Depth 5
}
Write-Host ""

Write-Host "=== All Tests Completed Successfully ===" -ForegroundColor Green
