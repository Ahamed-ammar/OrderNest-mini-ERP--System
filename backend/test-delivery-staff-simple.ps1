# Simple test script for Delivery Staff Management endpoints
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Delivery Staff Management Test ===" -ForegroundColor Cyan
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

# Step 2: Create Delivery Staff
Write-Host "2. Creating delivery staff..." -ForegroundColor Yellow
$createStaffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Post -Headers @{
    "Authorization" = "Bearer $adminToken"
} -Body (@{
    name = "Jane Smith"
    phone = "8765432109"
} | ConvertTo-Json) -ContentType "application/json"

$staffId = $createStaffResponse.data._id
Write-Host "Delivery staff created successfully" -ForegroundColor Green
Write-Host "  Staff ID: $staffId" -ForegroundColor Gray
Write-Host "  Name: $($createStaffResponse.data.name)" -ForegroundColor Gray
Write-Host "  Phone: $($createStaffResponse.data.phone)" -ForegroundColor Gray
Write-Host "  Active: $($createStaffResponse.data.isActive)" -ForegroundColor Gray
Write-Host ""

# Step 3: Get All Delivery Staff
Write-Host "3. Getting all delivery staff..." -ForegroundColor Yellow
$allStaffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Get -Headers @{
    "Authorization" = "Bearer $adminToken"
}

Write-Host "Total staff members: $($allStaffResponse.data.Count)" -ForegroundColor Green
foreach ($staff in $allStaffResponse.data) {
    Write-Host "  - $($staff.name) ($($staff.phone)) - Active: $($staff.isActive)" -ForegroundColor Gray
}
Write-Host ""

# Step 4: Update Delivery Staff
Write-Host "4. Updating delivery staff..." -ForegroundColor Yellow
$updateStaffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$staffId" -Method Put -Headers @{
    "Authorization" = "Bearer $adminToken"
} -Body (@{
    name = "Jane Smith (Updated)"
} | ConvertTo-Json) -ContentType "application/json"

Write-Host "Delivery staff updated successfully" -ForegroundColor Green
Write-Host "  Updated Name: $($updateStaffResponse.data.name)" -ForegroundColor Gray
Write-Host ""

# Step 5: Get Delivery Count
Write-Host "5. Getting delivery count for staff..." -ForegroundColor Yellow
$deliveryCountResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$staffId/deliveries" -Method Get -Headers @{
    "Authorization" = "Bearer $adminToken"
}

Write-Host "Delivery count retrieved successfully" -ForegroundColor Green
Write-Host "  Staff: $($deliveryCountResponse.data.staffName)" -ForegroundColor Gray
Write-Host "  Delivery Count: $($deliveryCountResponse.data.deliveryCount)" -ForegroundColor Gray
Write-Host ""

# Step 6: Toggle Staff Status (Deactivate)
Write-Host "6. Toggling staff status (deactivate)..." -ForegroundColor Yellow
$toggleResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$staffId/toggle" -Method Patch -Headers @{
    "Authorization" = "Bearer $adminToken"
}

Write-Host "Staff status toggled successfully" -ForegroundColor Green
Write-Host "  Active: $($toggleResponse.data.isActive)" -ForegroundColor Gray
Write-Host ""

# Step 7: Toggle Staff Status (Activate)
Write-Host "7. Toggling staff status (activate)..." -ForegroundColor Yellow
$toggleResponse2 = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$staffId/toggle" -Method Patch -Headers @{
    "Authorization" = "Bearer $adminToken"
}

Write-Host "Staff status toggled successfully" -ForegroundColor Green
Write-Host "  Active: $($toggleResponse2.data.isActive)" -ForegroundColor Gray
Write-Host ""

Write-Host "=== All Tests Completed ===" -ForegroundColor Green
