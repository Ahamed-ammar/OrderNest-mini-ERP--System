# Test Product Management API
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Product Management API ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Admin Login
Write-Host "1. Admin Login..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body (@{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.data.token
Write-Host "Success: Admin logged in" -ForegroundColor Green
Write-Host ""

# Step 2: Get all products
Write-Host "2. Fetching all products..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$productsResponse = Invoke-RestMethod -Uri "$baseUrl/products/admin/all" -Method Get -Headers $headers
Write-Host "Success: Found $($productsResponse.data.count) products" -ForegroundColor Green
Write-Host ""

# Display products
Write-Host "Current Products:" -ForegroundColor Cyan
foreach ($product in $productsResponse.data.products) {
    $status = if ($product.isActive) { "Active" } else { "Inactive" }
    Write-Host "  - $($product.name) | Raw: Rs.$($product.rawMaterialPricePerKg)/kg | Grinding: Rs.$($product.grindingChargePerKg)/kg | Status: $status"
}
Write-Host ""

# Step 3: Create a new product
Write-Host "3. Creating new test product..." -ForegroundColor Yellow
$timestamp = Get-Date -Format 'HHmmss'
$newProduct = @{
    name = "Test Product $timestamp"
    rawMaterialPricePerKg = 50
    grindingChargePerKg = 10
    description = "Test product for management page"
}

$createResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Headers $headers -Body ($newProduct | ConvertTo-Json)
$createdProductId = $createResponse.data.product._id
Write-Host "Success: Product created with ID: $createdProductId" -ForegroundColor Green
Write-Host ""

# Step 4: Update the product
Write-Host "4. Updating product..." -ForegroundColor Yellow
$updateData = @{
    name = $newProduct.name
    rawMaterialPricePerKg = 60
    grindingChargePerKg = 15
    description = "Updated test product"
}

$updateResponse = Invoke-RestMethod -Uri "$baseUrl/products/$createdProductId" -Method Put -Headers $headers -Body ($updateData | ConvertTo-Json)
Write-Host "Success: Product updated" -ForegroundColor Green
Write-Host "  New Raw Price: Rs.$($updateResponse.data.product.rawMaterialPricePerKg)/kg"
Write-Host "  New Grinding Charge: Rs.$($updateResponse.data.product.grindingChargePerKg)/kg"
Write-Host ""

# Step 5: Toggle product status
Write-Host "5. Toggling product status..." -ForegroundColor Yellow
$toggleResponse = Invoke-RestMethod -Uri "$baseUrl/products/$createdProductId/toggle" -Method Patch -Headers $headers
$newStatus = if ($toggleResponse.data.product.isActive) { "Active" } else { "Inactive" }
Write-Host "Success: Product status toggled to: $newStatus" -ForegroundColor Green
Write-Host ""

# Step 6: Verify all products again
Write-Host "6. Verifying final product list..." -ForegroundColor Yellow
$finalProductsResponse = Invoke-RestMethod -Uri "$baseUrl/products/admin/all" -Method Get -Headers $headers
Write-Host "Success: Total products: $($finalProductsResponse.data.count)" -ForegroundColor Green
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now test the Product Management page at:" -ForegroundColor Yellow
Write-Host "http://localhost:5174/admin/products" -ForegroundColor Cyan
