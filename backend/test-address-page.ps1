# Test Address Page Functionality
$baseUrl = "http://localhost:5000/api"

Write-Host "`n=== Testing Address Page Functionality ===" -ForegroundColor Cyan

# Step 1: Login as customer
Write-Host "`n1. Logging in as customer..." -ForegroundColor Yellow
$loginBody = @{
    usernameOrEmail = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Login successful!" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Step 2: Get customer profile (pre-fill data)
Write-Host "`n2. Getting customer profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Get -Headers $headers
    Write-Host "Profile retrieved successfully!" -ForegroundColor Green
    Write-Host "Name: $($profileResponse.data.name)" -ForegroundColor Cyan
    Write-Host "Phone: $($profileResponse.data.phone)" -ForegroundColor Cyan
    Write-Host "Street Type: $($profileResponse.data.streetType)" -ForegroundColor Cyan
    Write-Host "House Name: $($profileResponse.data.houseName)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to get profile: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Update customer profile with address
Write-Host "`n3. Updating customer profile with address..." -ForegroundColor Yellow
$updateBody = @{
    name = "Test User Updated"
    streetType = "Center"
    houseName = "Green Villa"
    doorNo = "42A"
    landmark = "Near City Park"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Put -Headers $headers -Body $updateBody
    Write-Host "Profile updated successfully!" -ForegroundColor Green
    Write-Host "Updated Name: $($updateResponse.data.name)" -ForegroundColor Cyan
    Write-Host "Updated Street Type: $($updateResponse.data.streetType)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to update profile: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Verify updated profile
Write-Host "`n4. Verifying updated profile..." -ForegroundColor Yellow
try {
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/customer/profile" -Method Get -Headers $headers
    Write-Host "Profile verified!" -ForegroundColor Green
    Write-Host "Name: $($verifyResponse.data.name)" -ForegroundColor Cyan
    Write-Host "Street Type: $($verifyResponse.data.streetType)" -ForegroundColor Cyan
    Write-Host "House Name: $($verifyResponse.data.houseName)" -ForegroundColor Cyan
    Write-Host "Door No: $($verifyResponse.data.doorNo)" -ForegroundColor Cyan
    Write-Host "Landmark: $($verifyResponse.data.landmark)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to verify profile: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Cyan
