# Test script for Staff Management Page functionality
$baseUrl = "http://localhost:5000/api"

Write-Host "=== Testing Staff Management Functionality ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Admin Login
Write-Host "Step 1: Admin Login" -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body (@{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.data.token
Write-Host "Success: Admin logged in successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Get all delivery staff
Write-Host "Step 2: Get all delivery staff" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

$staffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Get -Headers $headers
Write-Host "Success: Retrieved delivery staff: $($staffResponse.data.staff.Count) staff members" -ForegroundColor Green

if ($staffResponse.data.staff.Count -gt 0) {
    Write-Host "  Staff members:" -ForegroundColor Cyan
    foreach ($staff in $staffResponse.data.staff) {
        $status = if($staff.isActive){'Active'}else{'Inactive'}
        Write-Host "    - $($staff.name) ($($staff.phone)) - Status: $status" -ForegroundColor White
    }
}
Write-Host ""

# Step 3: Add new delivery staff
Write-Host "Step 3: Add new delivery staff" -ForegroundColor Yellow
$newStaff = @{
    name = "Test Staff Member"
    phone = "9876543210"
}

$createResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Post -Body ($newStaff | ConvertTo-Json) -ContentType "application/json" -Headers $headers
$newStaffId = $createResponse.data.staff._id
Write-Host "Success: Created new staff member: $($createResponse.data.staff.name)" -ForegroundColor Green
Write-Host "  Staff ID: $newStaffId" -ForegroundColor Cyan
Write-Host ""

# Step 4: Get delivery count for staff
Write-Host "Step 4: Get delivery count for staff" -ForegroundColor Yellow
$countResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$newStaffId/deliveries" -Method Get -Headers $headers
Write-Host "Success: Delivery count: $($countResponse.data.deliveryCount)" -ForegroundColor Green
Write-Host ""

# Step 5: Update staff member
Write-Host "Step 5: Update staff member" -ForegroundColor Yellow
$updateData = @{
    name = "Updated Staff Member"
    phone = "9876543210"
}

$updateResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$newStaffId" -Method Put -Body ($updateData | ConvertTo-Json) -ContentType "application/json" -Headers $headers
Write-Host "Success: Updated staff member: $($updateResponse.data.staff.name)" -ForegroundColor Green
Write-Host ""

# Step 6: Toggle staff status (deactivate)
Write-Host "Step 6: Toggle staff status (deactivate)" -ForegroundColor Yellow
$toggleResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$newStaffId/toggle" -Method Patch -Headers $headers
$status = if($toggleResponse.data.staff.isActive){'Active'}else{'Inactive'}
Write-Host "Success: Toggled staff status: $status" -ForegroundColor Green
Write-Host ""

# Step 7: Toggle staff status again (activate)
Write-Host "Step 7: Toggle staff status again (activate)" -ForegroundColor Yellow
$toggleResponse2 = Invoke-RestMethod -Uri "$baseUrl/delivery-staff/$newStaffId/toggle" -Method Patch -Headers $headers
$status2 = if($toggleResponse2.data.staff.isActive){'Active'}else{'Inactive'}
Write-Host "Success: Toggled staff status: $status2" -ForegroundColor Green
Write-Host ""

# Step 8: Get all staff again to verify changes
Write-Host "Step 8: Get all staff again to verify changes" -ForegroundColor Yellow
$finalStaffResponse = Invoke-RestMethod -Uri "$baseUrl/delivery-staff" -Method Get -Headers $headers
Write-Host "Success: Retrieved delivery staff: $($finalStaffResponse.data.staff.Count) staff members" -ForegroundColor Green

if ($finalStaffResponse.data.staff.Count -gt 0) {
    Write-Host "  Staff members:" -ForegroundColor Cyan
    foreach ($staff in $finalStaffResponse.data.staff) {
        $status = if($staff.isActive){'Active'}else{'Inactive'}
        Write-Host "    - $($staff.name) ($($staff.phone)) - Status: $status" -ForegroundColor White
    }
}
Write-Host ""

Write-Host "=== Staff Management Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Test staff member 'Updated Staff Member' was created during testing." -ForegroundColor Yellow
Write-Host "You can delete it manually from the admin panel if needed." -ForegroundColor Yellow
