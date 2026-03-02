# Simple test script for Order Management endpoints
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Order Management System ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as customer
Write-Host "1. Logging in as customer..." -ForegroundColor Yellow
$loginBody = '{"phone":"9876543210"}'
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body $loginBody -ContentType "application/json"
$customerToken = $loginResponse.data.token
Write-Host "Customer logged in successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Get products
Write-Host "2. Fetching products..." -ForegroundColor Yellow
$productsResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
$productId = $productsResponse.data.products[0]._id
$productName = $productsResponse.data.products[0].name
Write-Host "Found product: $productName (ID: $productId)" -ForegroundColor Green
Write-Host ""

# Step 3: Create order
Write-Host "3. Creating order..." -ForegroundColor Yellow
$orderBody = @"
{
  "orderType": "serviceOnly",
  "items": [
    {
      "productId": "$productId",
      "quantity": 2.5,
      "grindType": "Fine"
    }
  ],
  "deliveryAddress": {
    "name": "Test Customer",
    "phone": "9876543210",
    "streetType": "Center",
    "houseName": "Test House",
    "doorNo": "123",
    "landmark": "Near Temple"
  }
}
"@

$headers = @{
    "Authorization" = "Bearer $customerToken"
    "Content-Type" = "application/json"
}

try {
    $orderResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderBody -Headers $headers
    $orderId = $orderResponse.data.orderId
    Write-Host "Order created successfully!" -ForegroundColor Green
    Write-Host "Order ID: $orderId" -ForegroundColor Green
    Write-Host "Total: $($orderResponse.data.totalAmount)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error creating order: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    Write-Host ""
}

# Step 4: Get customer orders
Write-Host "4. Fetching customer orders..." -ForegroundColor Yellow
try {
    $customerOrdersResponse = Invoke-RestMethod -Uri "$baseUrl/orders/customer/orders" -Method Get -Headers $headers
    Write-Host "Found $($customerOrdersResponse.data.Count) orders" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    Write-Host ""
}

# Step 5: Login as admin
Write-Host "5. Logging in as admin..." -ForegroundColor Yellow
$adminLoginBody = '{"username":"admin","password":"admin123"}'
try {
    $adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
    $adminToken = $adminLoginResponse.data.token
    Write-Host "Admin logged in successfully" -ForegroundColor Green
    Write-Host ""
    
    $adminHeaders = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    
    # Step 6: Get all orders
    Write-Host "6. Fetching all orders (admin)..." -ForegroundColor Yellow
    $allOrdersResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Get -Headers $adminHeaders
    Write-Host "Total orders: $($allOrdersResponse.data.pagination.totalOrders)" -ForegroundColor Green
    Write-Host ""
    
    # Step 7: Update order status
    if ($orderId) {
        Write-Host "7. Updating order status..." -ForegroundColor Yellow
        $statusBody = '{"status":"InProgress"}'
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/status" -Method Put -Body $statusBody -Headers $adminHeaders
        Write-Host "Status updated to: $($updateResponse.data.status)" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== Tests Completed ===" -ForegroundColor Cyan
