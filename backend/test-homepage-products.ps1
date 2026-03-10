# Test script for HomePage products display
Write-Host "Testing HomePage Products Display" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get all active products
Write-Host "Test 1: Fetching active products..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get -ContentType "application/json"
    Write-Host "Success: Fetched products" -ForegroundColor Green
    Write-Host "Total products: $($response.Count)" -ForegroundColor Cyan
    Write-Host ""
    
    # Display each product with pricing
    foreach ($product in $response) {
        Write-Host "Product: $($product.name)" -ForegroundColor White
        Write-Host "  Raw Material Price: Rs $($product.rawMaterialPricePerKg)/kg" -ForegroundColor Yellow
        Write-Host "  Grinding Charge: Rs $($product.grindingChargePerKg)/kg" -ForegroundColor Yellow
        Write-Host "  Service Only: Rs $($product.grindingChargePerKg)/kg" -ForegroundColor Green
        $buyAndGrind = $product.rawMaterialPricePerKg + $product.grindingChargePerKg
        Write-Host "  Buy + Grinding: Rs $buyAndGrind/kg" -ForegroundColor Green
        Write-Host "  Status: $(if ($product.isActive) { 'Active' } else { 'Inactive' })" -ForegroundColor $(if ($product.isActive) { 'Green' } else { 'Red' })
        Write-Host ""
    }
} catch {
    Write-Host "Failed to fetch products" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start the frontend" -ForegroundColor White
Write-Host "2. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "3. Scroll down to Our Products section" -ForegroundColor White
Write-Host "4. Verify each product card shows pricing and Order Now button" -ForegroundColor White
