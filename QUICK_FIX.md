# Quick Fix for Network Error

## The Issue
All backend tests pass, but you're getting a network error in the browser when trying to login as admin.

## Diagnostics Show
✅ Backend running on port 5000
✅ Frontend running on port 5174  
✅ Admin login API working
✅ CORS configured correctly for port 5174

## Most Likely Causes

### 1. Browser Cache Issue
The browser might be caching old CORS settings or API configurations.

**Solution:**
1. Open http://localhost:5174/admin/login
2. Press `F12` to open DevTools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **"Clear site data"** button
5. Close and reopen the browser
6. Try logging in again

### 2. Service Worker or Cache
Sometimes Vite's HMR or service workers can cause issues.

**Solution:**
```powershell
# Stop frontend (Ctrl+C in the terminal)
# Then clear Vite cache and restart:
cd frontend
Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue
npm run dev
```

### 3. Wrong API URL
The frontend might be trying to connect to the wrong URL.

**Check in Browser Console:**
1. Press `F12`
2. Go to **Console** tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Type: `location.reload()`
6. Press Enter

### 4. Firewall or Antivirus
Windows Firewall or antivirus might be blocking localhost connections.

**Solution:**
- Temporarily disable Windows Firewall
- Or add an exception for Node.js

## Step-by-Step Fix

### Option A: Complete Reset (Recommended)

```powershell
# 1. Stop all processes
Get-Process node | Stop-Process -Force

# 2. Clear all caches
cd frontend
Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue

# 3. Start backend
cd ../backend
npm start

# 4. In another terminal, start frontend
cd frontend
npm run dev

# 5. Open browser in incognito/private mode
# Go to: http://localhost:5174/admin/login
# Login with: admin / admin123
```

### Option B: Browser-Only Fix

1. Open browser in **Incognito/Private mode**
2. Go to http://localhost:5174/admin/login
3. Try logging in with admin/admin123

If it works in incognito mode, the issue is browser cache.

### Option C: Use the Test Page

1. Open `backend/test-admin-login.html` directly in your browser
2. Click "Test Login" button
3. If this works, the issue is with the React app configuration

## What to Check in Browser DevTools

### Network Tab
1. Press `F12`
2. Go to **Network** tab
3. Try logging in
4. Look for the request to `/api/auth/admin/login`
5. Check:
   - **Status**: Should be 200
   - **Request URL**: Should be `http://localhost:5000/api/auth/admin/login`
   - **Response**: Should contain token

### Console Tab
Look for errors like:
- `CORS policy` - CORS issue (but we fixed this)
- `ERR_CONNECTION_REFUSED` - Backend not running
- `ERR_NAME_NOT_RESOLVED` - DNS issue
- `Network Error` - Generic connection issue

## Still Not Working?

If none of the above works, please provide:

1. **Exact error message** from browser console
2. **Network tab screenshot** showing the failed request
3. **Response from this command:**
   ```powershell
   cd backend
   ./diagnose-network-issue.ps1
   ```

## Alternative: Use Different Port

If port 5174 is causing issues, you can force Vite to use 5173:

```powershell
# Stop frontend
# Edit frontend/vite.config.js and add:
server: {
  port: 5173,
  strictPort: true
}

# Restart frontend
npm run dev
```

Then the CORS will work with the default 5173 port.
