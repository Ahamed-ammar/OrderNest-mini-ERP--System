# Test script to verify products API is working
Write-Host "Testing Products API..." -ForegroundColor Cyan

# Test getting all products (public endpoint)
Write-Host "`nGetting all products..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get -ContentType "application/json"
    Write-Host "Success! Found $($response.data.Count) products:" -ForegroundColor Green
    $response.data | ForEach-Object {
        Write-Host "  - $($_.name): Raw Material Rs.$($_.rawMaterialPricePerKg)/kg, Grinding Rs.$($_.grindingChargePerKg)/kg" -ForegroundColor White
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nMake sure:" -ForegroundColor Yellow
    Write-Host "1. Backend server is running (npm start in backend folder)" -ForegroundColor White
    Write-Host "2. Database is seeded (npm run seed in backend folder)" -ForegroundColor White
}

Write-Host "`nTest completed." -ForegroundColor Cyan
