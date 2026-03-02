# Test new customer authentication system

$baseUrl = "http://localhost:5000/api"

Write-Host "`n=== Testing New Customer Authentication ===" -ForegroundColor Cyan

# Test 1: Register new customer
Write-Host "`n1. Testing customer registration..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser"
    email = "testuser@example.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host "Customer: $($registerResponse.data.customer.username)" -ForegroundColor Green
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login with username
Write-Host "`n2. Testing login with username..." -ForegroundColor Yellow
$loginBody = @{
    usernameOrEmail = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/customer/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Customer: $($loginResponse.data.customer.name)" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Tests completed ===" -ForegroundColor Cyan
