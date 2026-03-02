# Test script for Order Management endpoints
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Order Management System ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as customer to get token
Write-Host "1. Logging in as customer..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body (@{
    phone = "9876543210"
} | ConvertTo-Json) -ContentType "application/json"

$customerToken = $loginResponse.data.token
$customerId = $loginResponse.data.customer._id
Write-Host "Customer logged in successfully. Token: $($customerToken.Substring(0,20))..." -ForegroundColor Green
Write-Host ""

# Step 2: Get active products
Write-Host "2. Fetching active products..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
$product1 = $products.data[0]
$product2 = $products.data[1]
Write-Host "Found $($products.data.Count) products" -ForegroundColor Green
Write-Host "Product 1: $($product1.name) - ID: $($product1._id)" -ForegroundColor Green
if ($product2) {
    Write-Host "Product 2: $($product2.name) - ID: $($product2._id)" -ForegroundColor Green
}
Write-Host ""

# Step 3: Create an order (Service Only)
Write-Host "3. Creating a Service Only order..." -ForegroundColor Yellow
$orderData = @{
    orderType = "serviceOnly"
    items = @(
        @{
            productId = $product1._id
            quantity = 2.5
            grindType = "Fine"
        }
    )
    deliveryAddress = @{
        name = "Test Customer"
        phone = "9876543210"
        streetType = "Center"
        houseName = "Test House"
        doorNo = "123"
        landmark = "Near Temple"
    }
}

$headers = @{
    "Authorization" = "Bearer $customerToken"
    "Content-Type" = "application/json"
}

$createOrderResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body ($orderData | ConvertTo-Json -Depth 10) -Headers $headers
$orderId = $createOrderResponse.data.orderId
Write-Host "Order created successfully!" -ForegroundColor Green
Write-Host "Order ID: $orderId" -ForegroundColor Green
Write-Host "Total Amount: $($createOrderResponse.data.totalAmount)" -ForegroundColor Green
Write-Host "Status: $($createOrderResponse.data.status)" -ForegroundColor Green
Write-Host "Estimated Ready Date: $($createOrderResponse.data.estimatedReadyDate)" -ForegroundColor Green
Write-Host ""

# Step 4: Get customer orders
Write-Host "4. Fetching customer order history..." -ForegroundColor Yellow
$customerOrders = Invoke-RestMethod -Uri "$baseUrl/customer/orders" -Method Get -Headers $headers
Write-Host "Found $($customerOrders.data.Count) orders for customer" -ForegroundColor Green
Write-Host ""

# Step 5: Get single order by ID
Write-Host "5. Fetching order details by ID..." -ForegroundColor Yellow
$orderDetails = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId" -Method Get -Headers $headers
Write-Host "Order Type: $($orderDetails.data.orderType)" -ForegroundColor Green
Write-Host "Items Count: $($orderDetails.data.items.Count)" -ForegroundColor Green
Write-Host "Status: $($orderDetails.data.status)" -ForegroundColor Green
Write-Host ""

# Step 6: Login as admin
Write-Host "6. Logging in as admin..." -ForegroundColor Yellow
$adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body (@{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json) -ContentType "application/json"

$adminToken = $adminLoginResponse.data.token
Write-Host "Admin logged in successfully" -ForegroundColor Green
Write-Host ""

$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

# Step 7: Get all orders (admin)
Write-Host "7. Fetching all orders (admin)..." -ForegroundColor Yellow
$allOrders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Get -Headers $adminHeaders
Write-Host "Total orders: $($allOrders.data.pagination.totalOrders)" -ForegroundColor Green
Write-Host "Current page: $($allOrders.data.pagination.currentPage)" -ForegroundColor Green
Write-Host ""

# Step 8: Update order status (admin)
Write-Host "8. Updating order status to InProgress..." -ForegroundColor Yellow
$updateStatusResponse = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/status" -Method Put -Body (@{
    status = "InProgress"
} | ConvertTo-Json) -Headers $adminHeaders
Write-Host "Order status updated to: $($updateStatusResponse.data.status)" -ForegroundColor Green
Write-Host ""

# Step 9: Try invalid status transition
Write-Host "9. Testing invalid status transition (InProgress -> Delivered)..." -ForegroundColor Yellow
try {
    $invalidTransition = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/status" -Method Put -Body (@{
        status = "Delivered"
    } | ConvertTo-Json) -Headers $adminHeaders
    Write-Host "ERROR: Invalid transition was allowed!" -ForegroundColor Red
} catch {
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Correctly rejected: $($errorResponse.error.message)" -ForegroundColor Green
}
Write-Host ""

# Step 10: Create another order and cancel it
Write-Host "10. Creating another order to test cancellation..." -ForegroundColor Yellow
$orderData2 = @{
    orderType = "buyAndService"
    items = @(
        @{
            productId = $product1._id
            quantity = 1.0
            grindType = "Medium"
        }
    )
    deliveryAddress = @{
        name = "Test Customer"
        phone = "9876543210"
        streetType = "Top"
        houseName = "Test House 2"
        doorNo = "456"
        landmark = ""
    }
}

$createOrder2Response = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body ($orderData2 | ConvertTo-Json -Depth 10) -Headers $headers
$order2Id = $createOrder2Response.data.orderId
Write-Host "Second order created: $order2Id" -ForegroundColor Green
Write-Host ""

# Step 11: Cancel the pending order
Write-Host "11. Cancelling the pending order..." -ForegroundColor Yellow
$cancelResponse = Invoke-RestMethod -Uri "$baseUrl/customer/orders/$order2Id/cancel" -Method Put -Headers $headers
Write-Host "Order cancelled successfully. Status: $($cancelResponse.data.status)" -ForegroundColor Green
Write-Host ""

# Step 12: Try to cancel non-pending order
Write-Host "12. Testing cancellation of non-pending order..." -ForegroundColor Yellow
try {
    $invalidCancel = Invoke-RestMethod -Uri "$baseUrl/customer/orders/$orderId/cancel" -Method Put -Headers $headers
    Write-Host "ERROR: Non-pending order cancellation was allowed!" -ForegroundColor Red
} catch {
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Correctly rejected: $($errorResponse.error.message)" -ForegroundColor Green
}
Write-Host ""

# Step 13: Test order filtering (admin)
Write-Host "13. Testing order filtering by status..." -ForegroundColor Yellow
$filteredOrders = Invoke-RestMethod -Uri "$baseUrl/orders?status=Pending" -Method Get -Headers $adminHeaders
Write-Host "Pending orders: $($filteredOrders.data.orders.Count)" -ForegroundColor Green
Write-Host ""

Write-Host "=== All Order Management Tests Completed ===" -ForegroundColor Cyan
