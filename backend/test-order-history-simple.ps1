# Simple test for order history
$baseUrl = "http://localhost:5000/api"

Write-Host "Testing Order History..." -ForegroundColor Cyan

# Login
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body (@{
    phone = "9876543210"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.data.token
Write-Host "Logged in successfully" -ForegroundColor Green

# Get orders
$headers = @{
    "Authorization" = "Bearer $token"
}

$ordersResponse = Invoke-RestMethod -Uri "$baseUrl/customer/orders" -Method Get -Headers $headers
$orders = $ordersResponse.data.orders

Write-Host "Found $($orders.Count) orders" -ForegroundColor Green

if ($orders.Count -gt 0) {
    Write-Host "`nFirst 5 orders:" -ForegroundColor Yellow
    foreach ($order in $orders | Select-Object -First 5) {
        Write-Host "  ID: $($order._id) | Status: $($order.status) | Total: Rs.$($order.totalAmount)" -ForegroundColor White
    }
}

Write-Host "`nTest Complete!" -ForegroundColor Cyan
