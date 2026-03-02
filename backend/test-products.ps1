# Test script for product API endpoints
Write-Host "Testing Product API Endpoints..." -ForegroundColor Green

$baseUrl = "http://localhost:5000"

# Test 1: Get all active products (should be empty initially)
Write-Host "`n1. Testing GET /api/products (public)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Try to create product without authentication (should fail)
Write-Host "`n2. Testing POST /api/products without auth (should fail)" -ForegroundColor Yellow
try {
    $productBody = @{
        name = "Test Rice"
        rawMaterialPricePerKg = 50
        grindingChargePerKg = 10
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products" -Method POST -Body $productBody -ContentType 'application/json'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Expected Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

# Test 3: Login as admin and create product
Write-Host "`n3. Testing admin login and product creation" -ForegroundColor Yellow
try {
    # Login
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/admin/login" -Method POST -Body $loginBody -ContentType 'application/json'
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.data.token
    
    Write-Host "Login successful! Token received." -ForegroundColor Green
    
    # Create product
    $productBody = @{
        name = "Rice"
        rawMaterialPricePerKg = 50
        grindingChargePerKg = 10
        description = "Premium quality rice"
    } | ConvertTo-Json
    
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $createResponse = Invoke-WebRequest -Uri "$baseUrl/api/products" -Method POST -Body $productBody -ContentType 'application/json' -Headers $headers
    Write-Host "Product created successfully!" -ForegroundColor Green
    Write-Host "Response: $($createResponse.Content)" -ForegroundColor Cyan
    
    $productData = $createResponse.Content | ConvertFrom-Json
    $productId = $productData.data.product._id
    
    # Test 4: Get all products again (should have 1 product)
    Write-Host "`n4. Testing GET /api/products (should show 1 product)" -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products" -Method GET
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    
    # Test 5: Get single product
    Write-Host "`n5. Testing GET /api/products/$productId" -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products/$productId" -Method GET
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    
    # Test 6: Update product
    Write-Host "`n6. Testing PUT /api/products/$productId" -ForegroundColor Yellow
    $updateBody = @{
        rawMaterialPricePerKg = 55
        grindingChargePerKg = 12
    } | ConvertTo-Json
    
    $updateResponse = Invoke-WebRequest -Uri "$baseUrl/api/products/$productId" -Method PUT -Body $updateBody -ContentType 'application/json' -Headers $headers
    Write-Host "Product updated successfully!" -ForegroundColor Green
    Write-Host "Response: $($updateResponse.Content)" -ForegroundColor Cyan
    
    # Test 7: Toggle product status
    Write-Host "`n7. Testing PATCH /api/products/$productId/toggle" -ForegroundColor Yellow
    $toggleResponse = Invoke-WebRequest -Uri "$baseUrl/api/products/$productId/toggle" -Method PATCH -Headers $headers
    Write-Host "Product status toggled!" -ForegroundColor Green
    Write-Host "Response: $($toggleResponse.Content)" -ForegroundColor Cyan
    
    # Test 8: Get all products (should be empty since product is now inactive)
    Write-Host "`n8. Testing GET /api/products (should be empty - product is inactive)" -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products" -Method GET
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`nTests completed!" -ForegroundColor Green
