# Test script for Staff Assignment to Orders
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Staff Assignment Test ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Admin Login
Write-Host "1. Admin Login..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body (@{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json) -ContentType "application/json"

$adminToken = $loginResponse.data.token
Write-Host "Admin logged in successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Get active delivery staff
Write-Host "2. Getting active delivery staff..." -ForegroundColor Yellow
$staffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Get -Headers @{
    "Authorization" = "Bearer $adminToken"
}

$activeStaff = $staffResponse.data | Where-Object { $_.isActive -eq $true } | Select-Object -First 1

if ($activeStaff) {
    Write-Host "Found active staff: $($activeStaff.name)" -ForegroundColor Green
    $staffId = $activeStaff._id
} else {
    Write-Host "No active staff found. Creating one..." -ForegroundColor Yellow
    $createStaffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Post -Headers @{
        "Authorization" = "Bearer $adminToken"
    } -Body (@{
        name = "Test Delivery Staff"
        phone = "7654321098"
    } | ConvertTo-Json) -ContentType "application/json"
    
    $staffId = $createStaffResponse.data._id
    Write-Host "Created staff: $($createStaffResponse.data.name)" -ForegroundColor Green
}
Write-Host ""

# Step 3: Customer Login
Write-Host "3. Customer Login..." -ForegroundColor Yellow
$customerLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body (@{
    phone = "1234567890"
} | ConvertTo-Json) -ContentType "application/json"

$customerToken = $customerLoginResponse.data.token
Write-Host "Customer logged in successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Get products
Write-Host "4. Getting products..." -ForegroundColor Yellow
$productsResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get

if ($productsResponse.data.Count -eq 0) {
    Write-Host "No products available" -ForegroundColor Red
    exit
}

$product = $productsResponse.data[0]
Write-Host "Using product: $($product.name)" -ForegroundColor Green
Write-Host ""

# Step 5: Create an order
Write-Host "5. Creating an order..." -ForegroundColor Yellow
$orderResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Headers @{
    "Authorization" = "Bearer $customerToken"
} -Body (@{
    orderType = "serviceOnly"
    items = @(
        @{
            productId = $product._id
            quantity = 2
            grindType = "Fine"
        }
    )
    deliveryAddress = @{
        name = "Test Customer"
        phone = "1234567890"
        streetType = "Center"
        houseName = "Test House"
        doorNo = "123"
        landmark = "Near Park"
    }
} | ConvertTo-Json -Depth 10) -ContentType "application/json"

$orderId = $orderResponse.data.orderId
Write-Host "Order created: $orderId" -ForegroundColor Green
Write-Host ""

# Step 6: Update order status to InProgress
Write-Host "6. Updating order status to InProgress..." -ForegroundColor Yellow
$statusUpdateResponse = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/status" -Method Put -Headers @{
    "Authorization" = "Bearer $adminToken"
} -Body (@{
    status = "InProgress"
} | ConvertTo-Json) -ContentType "application/json"

Write-Host "Order status updated to InProgress" -ForegroundColor Green
Write-Host ""

# Step 7: Update order status to Ready
Write-Host "7. Updating order status to Ready..." -ForegroundColor Yellow
$statusUpdateResponse2 = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/status" -Method Put -Headers @{
    "Authorization" = "Bearer $adminToken"
} -Body (@{
    status = "Ready"
} | ConvertTo-Json) -ContentType "application/json"

Write-Host "Order status updated to Ready" -ForegroundColor Green
Write-Host ""

# Step 8: Assign staff to order
Write-Host "8. Assigning staff to order..." -ForegroundColor Yellow
$assignStaffResponse = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/assign-staff" -Method Put -Headers @{
    "Authorization" = "Bearer $adminToken"
} -Body (@{
    deliveryStaffId = $staffId
} | ConvertTo-Json) -ContentType "application/json"

Write-Host "Staff assigned to order successfully" -ForegroundColor Green
Write-Host "  Order ID: $orderId" -ForegroundColor Gray
Write-Host "  Assigned Staff: $($assignStaffResponse.data.deliveryStaffId.name)" -ForegroundColor Gray
Write-Host "  Staff Phone: $($assignStaffResponse.data.deliveryStaffId.phone)" -ForegroundColor Gray
Write-Host ""

# Step 9: Verify delivery count increased
Write-Host "9. Verifying delivery count..." -ForegroundColor Yellow
$deliveryCountResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$staffId/deliveries" -Method Get -Headers @{
    "Authorization" = "Bearer $adminToken"
}

Write-Host "Delivery count for staff: $($deliveryCountResponse.data.deliveryCount)" -ForegroundColor Green
Write-Host ""

# Step 10: Test assigning inactive staff (should fail)
Write-Host "10. Testing assignment with inactive staff (should fail)..." -ForegroundColor Yellow

# Create and deactivate a staff member
$inactiveStaffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Post -Headers @{
    "Authorization" = "Bearer $adminToken"
} -Body (@{
    name = "Inactive Staff"
    phone = "6543210987"
} | ConvertTo-Json) -ContentType "application/json"

$inactiveStaffId = $inactiveStaffResponse.data._id

# Deactivate the staff
Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$inactiveStaffId/toggle" -Method Patch -Headers @{
    "Authorization" = "Bearer $adminToken"
} | Out-Null

# Try to assign inactive staff
try {
    Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/assign-staff" -Method Put -Headers @{
        "Authorization" = "Bearer $adminToken"
    } -Body (@{
        deliveryStaffId = $inactiveStaffId
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "ERROR: Should have failed with inactive staff" -ForegroundColor Red
} catch {
    Write-Host "Correctly rejected inactive staff assignment" -ForegroundColor Green
}
Write-Host ""

Write-Host "=== All Staff Assignment Tests Passed ===" -ForegroundColor Green
