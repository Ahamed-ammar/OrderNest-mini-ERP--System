# Test Order Review and Confirmation Flow
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Order Review and Confirmation Flow ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as customer (or register if doesn't exist)
Write-Host "Step 1: Customer Login/Register..." -ForegroundColor Yellow

$token = $null
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body (@{
        usernameOrEmail = "testcustomer"
        password = "password123"
    } | ConvertTo-Json) -ContentType "application/json"
    
    $token = $loginResponse.data.token
    Write-Host "Success: Customer logged in" -ForegroundColor Green
} catch {
    Write-Host "Customer not found, registering..." -ForegroundColor Gray
    try {
        $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/register" -Method Post -Body (@{
            username = "testcustomer"
            email = "testcustomer@example.com"
            password = "password123"
            name = "Test Customer"
        } | ConvertTo-Json) -ContentType "application/json"
        
        $token = $registerResponse.data.token
        Write-Host "Success: Customer registered" -ForegroundColor Green
    } catch {
        Write-Host "Error: Failed to register customer" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Step 2: Get active products
Write-Host "Step 2: Fetching active products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
    Write-Host "Success: Found $($products.data.Count) active products" -ForegroundColor Green
    
    if ($products.data.Count -eq 0) {
        Write-Host "Error: No products found" -ForegroundColor Red
        exit 1
    }
    
    $product = $products.data[0]
    Write-Host "Using product: $($product.name) (ID: $($product._id))" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "Error: Failed to fetch products" -ForegroundColor Red
    exit 1
}

# Step 3: Create an order (simulating the review page submission)
Write-Host "Step 3: Creating order..." -ForegroundColor Yellow
$orderData = @{
    orderType = "buyAndService"
    items = @(
        @{
            productId = $product._id.ToString()
            productName = $product.name
            quantity = 2
            grindType = "Medium"
            rawMaterialPriceSnapshot = $product.rawMaterialPricePerKg
            grindingChargeSnapshot = $product.grindingChargePerKg
        }
    )
    deliveryAddress = @{
        name = "Test Customer"
        phone = "9876543210"
        streetType = "Center"
        houseName = "Test House"
        doorNo = "123"
        landmark = "Near Test Landmark"
    }
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $orderResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body ($orderData | ConvertTo-Json -Depth 10) -Headers $headers
    Write-Host "Success: Order created!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Order Details:" -ForegroundColor Cyan
    Write-Host "  Order ID: $($orderResponse.data._id)" -ForegroundColor White
    Write-Host "  Status: $($orderResponse.data.status)" -ForegroundColor White
    Write-Host "  Total Amount: Rs.$($orderResponse.data.totalAmount)" -ForegroundColor White
    Write-Host "  Estimated Ready Date: $($orderResponse.data.estimatedReadyDate)" -ForegroundColor White
    Write-Host "  Items Count: $($orderResponse.data.items.Count)" -ForegroundColor White
    Write-Host ""
    
    # Step 4: Verify order was created
    Write-Host "Step 4: Verifying order..." -ForegroundColor Yellow
    $verifyOrder = Invoke-RestMethod -Uri "$baseUrl/orders/$($orderResponse.data._id)" -Method Get -Headers $headers
    Write-Host "Success: Order verified!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "=== All Tests Passed! ===" -ForegroundColor Green
    
} catch {
    Write-Host "Error: Failed to create order" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}
