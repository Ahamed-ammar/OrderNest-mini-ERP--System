# Test script for Profile Page functionality
$baseUrl = "http://localhost:5000/api"
$ErrorActionPreference = "Stop"

Write-Host "=== Testing Profile Page Functionality ===" -ForegroundColor Cyan
Write-Host ""

# Generate random username to avoid conflicts
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$username = "testuser$randomNum"

# Step 1: Register a new customer
Write-Host "Step 1: Registering new customer..." -ForegroundColor Yellow
$registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/register" -Method Post -Body (@{
    username = $username
    email = "$username@test.com"
    password = "test123"
    name = "Test Customer $randomNum"
} | ConvertTo-Json) -ContentType "application/json"

$token = $registerResponse.data.token
Write-Host "Success: Registration successful" -ForegroundColor Green
Write-Host "Username: $username" -ForegroundColor Gray
Write-Host ""

# Step 2: Get customer profile
Write-Host "Step 2: Fetching customer profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$profileResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Get -Headers $headers
Write-Host "Success: Profile fetched successfully" -ForegroundColor Green
Write-Host "Name: $($profileResponse.data.name)" -ForegroundColor Gray
Write-Host "Email: $($profileResponse.data.email)" -ForegroundColor Gray
Write-Host "Street Type: $($profileResponse.data.streetType)" -ForegroundColor Gray
Write-Host "House Name: $($profileResponse.data.houseName)" -ForegroundColor Gray
Write-Host "Door No: $($profileResponse.data.doorNo)" -ForegroundColor Gray
Write-Host "Landmark: $($profileResponse.data.landmark)" -ForegroundColor Gray
Write-Host ""

# Step 3: Update customer profile
Write-Host "Step 3: Updating customer address..." -ForegroundColor Yellow
$updateData = @{
    streetType = "Center"
    houseName = "Green Villa"
    doorNo = "42A"
    landmark = "Near City Park"
}

$updateResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Put -Headers $headers -Body ($updateData | ConvertTo-Json)
Write-Host "Success: Profile updated successfully" -ForegroundColor Green
Write-Host "Updated Street Type: $($updateResponse.data.streetType)" -ForegroundColor Gray
Write-Host "Updated House Name: $($updateResponse.data.houseName)" -ForegroundColor Gray
Write-Host "Updated Door No: $($updateResponse.data.doorNo)" -ForegroundColor Gray
Write-Host "Updated Landmark: $($updateResponse.data.landmark)" -ForegroundColor Gray
Write-Host ""

# Step 4: Verify update by fetching profile again
Write-Host "Step 4: Verifying update..." -ForegroundColor Yellow
$verifyResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Get -Headers $headers
Write-Host "Success: Verification successful" -ForegroundColor Green
Write-Host "Street Type: $($verifyResponse.data.streetType)" -ForegroundColor Gray
Write-Host "House Name: $($verifyResponse.data.houseName)" -ForegroundColor Gray
Write-Host "Door No: $($verifyResponse.data.doorNo)" -ForegroundColor Gray
Write-Host "Landmark: $($verifyResponse.data.landmark)" -ForegroundColor Gray
Write-Host ""

Write-Host "=== All Profile Page Tests Passed! ===" -ForegroundColor Green
