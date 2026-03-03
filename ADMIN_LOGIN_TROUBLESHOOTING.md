# Admin Login Network Error - Troubleshooting Guide

## Current Status ✅

Both servers are running correctly:
- **Backend**: http://localhost:5000 ✅
- **Frontend**: http://localhost:5174 ✅
- **CORS**: Configured for port 5174 ✅
- **API Tests**: All passing ✅

## Admin Login Credentials

```
Username: admin
Password: admin123
```

## If You're Still Getting Network Errors

### Step 1: Clear Browser Cache and Storage

1. Open your browser at http://localhost:5174/admin/login
2. Press `F12` to open DevTools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Clear site data** or manually clear:
   - Local Storage
   - Session Storage
   - Cookies
5. Refresh the page (`Ctrl+F5` or `Cmd+Shift+R`)

### Step 2: Check Network Request

1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Try logging in with admin credentials
4. Look for the request to `/api/auth/admin/login`
5. Check the request details:
   - **Status**: Should be 200 (if successful)
   - **Request URL**: Should be `http://localhost:5000/api/auth/admin/login`
   - **Request Headers**: Should include `Content-Type: application/json`
   - **Request Payload**: Should have username and password

### Step 3: Check Console for Errors

1. In DevTools, go to **Console** tab
2. Look for any error messages
3. Common errors and solutions:

   **CORS Error:**
   ```
   Access to XMLHttpRequest at 'http://localhost:5000/api/auth/admin/login' 
   from origin 'http://localhost:5174' has been blocked by CORS policy
   ```
   **Solution**: Backend has been restarted with correct CORS config. Hard refresh the page.

   **Network Error:**
   ```
   Network Error / Failed to fetch
   ```
   **Solution**: Backend might not be running. Check if http://localhost:5000/health works.

   **401 Unauthorized:**
   ```
   Invalid credentials
   ```
   **Solution**: Double-check username is "admin" and password is "admin123"

### Step 4: Test Backend Directly

Open a new terminal and run:

```powershell
cd backend
./test-admin-login-cors.ps1
```

This should show all tests passing. If any test fails, the backend needs attention.

### Step 5: Check Frontend Environment

1. Verify frontend/.env has:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. If you changed the .env file, restart the frontend:
   ```powershell
   # Stop the frontend (Ctrl+C in the terminal running it)
   # Then restart:
   cd frontend
   npm run dev
   ```

### Step 6: Verify Axios Configuration

The frontend should automatically use the correct API URL. Check the browser console:

```javascript
// In browser console, type:
localStorage.clear()
location.reload()
```

## Quick Fix Commands

If nothing works, restart both servers:

```powershell
# Stop all Node processes
Get-Process node | Stop-Process -Force

# Start backend
cd backend
npm start

# In another terminal, start frontend
cd frontend
npm run dev
```

## Testing the Order Management Page

After successful login:

1. Navigate to http://localhost:5174/admin/dashboard
2. Click on "Orders" in the navigation
3. You should see the Order Management page with:
   - Filter controls (Status, Delivery Type, Date Range)
   - List of orders in table format (desktop) or cards (mobile)
   - "Update Status" and "Assign Staff" buttons

## Current Server Status

Run this to check if servers are running:

```powershell
# Check backend
Invoke-RestMethod -Uri "http://localhost:5000/health"

# Check frontend (should open in browser)
Start-Process "http://localhost:5174"
```

## Need More Help?

If you're still experiencing issues:

1. Take a screenshot of the Network tab showing the failed request
2. Copy any error messages from the Console tab
3. Check if the backend terminal shows any errors when you try to login
4. Verify you're accessing http://localhost:5174/admin/login (not 5173)
