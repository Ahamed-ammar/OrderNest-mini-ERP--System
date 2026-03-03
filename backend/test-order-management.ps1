# Test Order Management Page Functionality
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Order Management Page Functionality ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Admin Login
Write-Host "Step 1: Admin Login" -ForegroundColor Yellow
$adminLoginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
    $adminToken = $adminLoginResponse.data.token
    Write-Host "Admin logged in successfully" -ForegroundColor Green
    Write-Host "Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Get All Orders (No Filters)
Write-Host "Step 2: Get All Orders (No Filters)" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $adminToken"
}

try {
    $allOrdersResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Get -Headers $headers
    $totalOrders = $allOrdersResponse.data.orders.Count
    Write-Host "Fetched all orders: $totalOrders orders" -ForegroundColor Green
    
    if ($totalOrders -gt 0) {
        $firstOrder = $allOrdersResponse.data.orders[0]
        Write-Host "  First Order ID: $($firstOrder._id)" -ForegroundColor Gray
        Write-Host "  Status: $($firstOrder.status)" -ForegroundColor Gray
        Write-Host "  Total: Rs $($firstOrder.totalAmount)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Failed to fetch orders: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Filter Orders by Status (Pending)
Write-Host "Step 3: Filter Orders by Status (Pending)" -ForegroundColor Yellow
try {
    $pendingOrdersResponse = Invoke-RestMethod -Uri "$baseUrl/orders?status=Pending" -Method Get -Headers $headers
    $pendingCount = $pendingOrdersResponse.data.orders.Count
    Write-Host "Fetched pending orders: $pendingCount orders" -ForegroundColor Green
} catch {
    Write-Host "Failed to fetch pending orders: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 4: Filter Orders by Delivery Type
Write-Host "Step 4: Filter Orders by Delivery Type (Delivery)" -ForegroundColor Yellow
try {
    $deliveryOrdersResponse = Invoke-RestMethod -Uri "$baseUrl/orders?deliveryType=Delivery" -Method Get -Headers $headers
    $deliveryCount = $deliveryOrdersResponse.data.orders.Count
    Write-Host "Fetched delivery orders: $deliveryCount orders" -ForegroundColor Green
} catch {
    Write-Host "Failed to fetch delivery orders: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 5: Update Order Status (if there's a pending order)
if ($pendingCount -gt 0) {
    Write-Host "Step 5: Update Order Status (Pending to InProgress)" -ForegroundColor Yellow
    $pendingOrder = $pendingOrdersResponse.data.orders[0]
    $updateStatusBody = @{
        status = "InProgress"
    } | ConvertTo-Json
    
    try {
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/orders/$($pendingOrder._id)/status" -Method Put -Body $updateStatusBody -ContentType "application/json" -Headers $headers
        Write-Host "Order status updated successfully" -ForegroundColor Green
        Write-Host "  Order ID: $($pendingOrder._id)" -ForegroundColor Gray
        Write-Host "  New Status: $($updateResponse.data.status)" -ForegroundColor Gray
        
        # Revert back to Pending for future tests
        Start-Sleep -Seconds 1
        $revertBody = @{
            status = "Pending"
        } | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/orders/$($pendingOrder._id)/status" -Method Put -Body $revertBody -ContentType "application/json" -Headers $headers | Out-Null
        Write-Host "  (Reverted back to Pending for testing)" -ForegroundColor Gray
    } catch {
        Write-Host "Failed to update order status: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Step 5: Skipped (No pending orders to update)" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Get Delivery Staff
Write-Host "Step 6: Get Delivery Staff" -ForegroundColor Yellow
try {
    $staffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Get -Headers $headers
    $staffCount = $staffResponse.data.Count
    Write-Host "Fetched delivery staff: $staffCount staff members" -ForegroundColor Green
    
    if ($staffCount -gt 0) {
        $firstStaff = $staffResponse.data[0]
        Write-Host "  First Staff: $($firstStaff.name) - $($firstStaff.phone)" -ForegroundColor Gray
        Write-Host "  Active: $($firstStaff.isActive)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Failed to fetch delivery staff: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 7: Test Invalid Status Transition
Write-Host "Step 7: Test Invalid Status Transition (Pending to Delivered)" -ForegroundColor Yellow
if ($pendingCount -gt 0) {
    $pendingOrder = $pendingOrdersResponse.data.orders[0]
    $invalidStatusBody = @{
        status = "Delivered"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/orders/$($pendingOrder._id)/status" -Method Put -Body $invalidStatusBody -ContentType "application/json" -Headers $headers
        Write-Host "Invalid transition was allowed (should have failed)" -ForegroundColor Red
    } catch {
        Write-Host "Invalid status transition correctly rejected" -ForegroundColor Green
        $errorMsg = $_.Exception.Message
        Write-Host "  Error: $errorMsg" -ForegroundColor Gray
    }
} else {
    Write-Host "Skipped (No pending orders)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Order Management Page Tests Complete ===" -ForegroundColor Cyan
