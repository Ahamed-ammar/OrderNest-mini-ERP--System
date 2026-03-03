# Simple test for order review and confirmation
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Order Flow ===" -ForegroundColor Cyan

# Register a new customer
Write-Host "`n1. Registering customer..." -ForegroundColor Yellow
$registerBody = @{
    username = "ordertestuser"
    email = "ordertest@example.com"
    password = "password123"
    name = "Order Test User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $registerResponse.data.token
    Write-Host "Success: Customer registered" -ForegroundColor Green
} catch {
    # Try to login if already exists
    Write-Host "Customer exists, logging in..." -ForegroundColor Gray
    $loginBody = @{
        usernameOrEmail = "ordertestuser"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Success: Customer logged in" -ForegroundColor Green
}

# Get products
Write-Host "`n2. Fetching products..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
$product = $products.data[0]
Write-Host "Success: Using product '$($product.name)'" -ForegroundColor Green

# Create order
Write-Host "`n3. Creating order..." -ForegroundColor Yellow
$orderBody = @{
    orderType = "buyAndService"
    items = @(
        @{
            productId = $product._id
            productName = $product.name
            quantity = 2.5
            grindType = "Medium"
            rawMaterialPriceSnapshot = $product.rawMaterialPricePerKg
            grindingChargeSnapshot = $product.grindingChargePerKg
        }
    )
    deliveryAddress = @{
        name = "Order Test User"
        phone = "9876543210"
        streetType = "Center"
        houseName = "Test House"
        doorNo = "123"
        landmark = "Near Park"
    }
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $orderResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderBody -Headers $headers
    Write-Host "Success: Order created!" -ForegroundColor Green
    Write-Host "`nOrder Details:" -ForegroundColor Cyan
    Write-Host "  ID: $($orderResponse.data._id)"
    Write-Host "  Status: $($orderResponse.data.status)"
    Write-Host "  Total: Rs.$($orderResponse.data.totalAmount)"
    Write-Host "  Ready Date: $($orderResponse.data.estimatedReadyDate)"
    Write-Host "`n=== Test Passed! ===" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}
