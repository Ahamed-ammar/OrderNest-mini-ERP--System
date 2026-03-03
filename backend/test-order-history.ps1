# Test Order History Page
# This script tests the customer order history and cancel functionality

$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Order History Page ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as customer
Write-Host "Step 1: Login as customer..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body (@{
    phone = "9876543210"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.data.token
Write-Host "✓ Logged in successfully" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Step 2: Get order history
Write-Host "Step 2: Fetching order history..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $ordersResponse = Invoke-RestMethod -Uri "$baseUrl/customer/orders" -Method Get -Headers $headers
    $orders = $ordersResponse.data.orders
    
    Write-Host "✓ Fetched $($orders.Count) orders" -ForegroundColor Green
    Write-Host ""
    
    if ($orders.Count -gt 0) {
        Write-Host "Order Details:" -ForegroundColor Cyan
        foreach ($order in $orders | Select-Object -First 5) {
            Write-Host "  Order ID: $($order._id)" -ForegroundColor White
            Write-Host "  Status: $($order.status)" -ForegroundColor White
            Write-Host "  Total: ₹$($order.totalAmount)" -ForegroundColor White
            Write-Host "  Items: $($order.items.Count)" -ForegroundColor White
            Write-Host "  Date: $($order.createdAt)" -ForegroundColor White
            Write-Host ""
        }
        
        # Step 3: Test cancel order (if there's a pending order)
        $pendingOrder = $orders | Where-Object { $_.status -eq "Pending" } | Select-Object -First 1
        
        if ($pendingOrder) {
            Write-Host "Step 3: Testing cancel order..." -ForegroundColor Yellow
            Write-Host "Cancelling order: $($pendingOrder._id)" -ForegroundColor Gray
            
            try {
                $cancelResponse = Invoke-RestMethod -Uri "$baseUrl/customer/orders/$($pendingOrder._id)/cancel" -Method Put -Headers $headers
                Write-Host "✓ Order cancelled successfully" -ForegroundColor Green
                Write-Host "New status: $($cancelResponse.data.status)" -ForegroundColor White
            } catch {
                Write-Host "✗ Failed to cancel order" -ForegroundColor Red
                Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "Step 3: No pending orders to cancel" -ForegroundColor Yellow
        }
    } else {
        Write-Host "No orders found for this customer" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "✗ Failed to fetch orders" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
