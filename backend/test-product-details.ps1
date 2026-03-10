# Test script for Product Details API
Write-Host "Testing Product Details API" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# First, get all products to get a valid ID
Write-Host "Step 1: Getting all products..." -ForegroundColor Yellow
try {
    $productsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get -ContentType "application/json"
    $products = $productsResponse.data.products
    
    if ($products.Count -gt 0) {
        $firstProduct = $products[0]
        $productId = $firstProduct._id
        Write-Host "Found product: $($firstProduct.name) (ID: $productId)" -ForegroundColor Green
        Write-Host ""
        
        # Test getting product by ID
        Write-Host "Step 2: Getting product details by ID..." -ForegroundColor Yellow
        $detailsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/products/$productId" -Method Get -ContentType "application/json"
        
        Write-Host "Success! Product details retrieved:" -ForegroundColor Green
        Write-Host "Response structure:" -ForegroundColor Cyan
        Write-Host "  success: $($detailsResponse.success)" -ForegroundColor White
        Write-Host "  data.product.name: $($detailsResponse.data.product.name)" -ForegroundColor White
        Write-Host "  data.product.rawMaterialPricePerKg: $($detailsResponse.data.product.rawMaterialPricePerKg)" -ForegroundColor White
        Write-Host "  data.product.grindingChargePerKg: $($detailsResponse.data.product.grindingChargePerKg)" -ForegroundColor White
        Write-Host ""
        
        Write-Host "Product Details Page URL:" -ForegroundColor Yellow
        Write-Host "  http://localhost:5173/product/$productId" -ForegroundColor Cyan
        
    } else {
        Write-Host "No products found in database" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "===========================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
