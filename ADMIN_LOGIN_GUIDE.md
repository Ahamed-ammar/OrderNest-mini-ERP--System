# Admin Login Guide

## Overview
The regular login page at http://localhost:5174/login now supports both customer and admin login. The system automatically detects if you're logging in as an admin and redirects you to the appropriate dashboard.

## How to Login as Admin

### Step 1: Navigate to Login Page
Open your browser and go to: **http://localhost:5174/login**

### Step 2: Enter Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

### Step 3: Automatic Redirect
After successful login, you will be automatically redirected to the admin dashboard at:
**http://localhost:5174/admin/dashboard**

## How It Works

The login page detects admin login by checking if the username is "admin":
- If username = "admin" → Uses admin login endpoint → Redirects to `/admin/dashboard`
- If username ≠ "admin" → Uses customer login endpoint → Redirects to `/` (home page)

## Admin Dashboard Features

Once logged in, you'll see:
1. **Metric Cards:**
   - Orders Today
   - Revenue Today (in ₹)
   - Pending Orders

2. **Charts:**
   - Orders over the last 7 days (line chart)
   - Revenue over the last 7 days (line chart)

3. **Responsive Design:**
   - Mobile: Single column layout
   - Tablet: 3-column grid for metrics
   - Desktop: Full dashboard with side-by-side charts

## Customer Login (For Reference)

Regular customers can also use the same login page:
- Enter their username/email and password
- They will be redirected to the home page after login

## Troubleshooting

### Can't Access Dashboard
- Make sure you're using username: `admin` (lowercase)
- Verify the backend server is running on port 5000
- Check that the frontend is running on port 5174

### Login Fails
- Verify credentials are correct
- Check browser console for errors
- Ensure backend database is seeded with admin account

## Technical Details

### Modified Files
- `frontend/src/pages/customer/LoginPage.jsx` - Added admin detection logic

### API Endpoints Used
- Customer Login: `POST /api/auth/customer/login`
- Admin Login: `POST /api/auth/admin/login`
- Dashboard Data: `GET /api/admin/dashboard`

### Authentication Flow
1. User enters credentials
2. Frontend checks if username is "admin"
3. Calls appropriate login endpoint (admin or customer)
4. Stores JWT token in localStorage
5. Redirects to appropriate page based on role
