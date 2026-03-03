# Manual Test Guide: Order Review and Confirmation

## Prerequisites
- Backend server running on http://localhost:5000
- Frontend server running on http://localhost:5173
- At least one product in the database (run `npm run seed` in backend if needed)

## Test Steps

### 1. Register/Login as Customer
1. Navigate to http://localhost:5173
2. Click "Order Now" or navigate to login page
3. Register a new account or login with existing credentials

### 2. Create an Order
1. Select order type (Service Only or Buy + Grinding)
2. Add products to cart:
   - Select a product
   - Enter quantity (e.g., 2 kg)
   - Select grind type (Fine/Medium/Coarse)
   - Click "Add to Cart"
3. Click "Continue" to proceed to address page

### 3. Enter Delivery Address
1. Fill in all required fields:
   - Name
   - Phone (10 digits)
   - Street Type (dropdown)
   - House Name
   - Door Number
   - Landmark (optional)
2. Click "Continue to Review"

### 4. Review Order (NEW - Task 16.1)
You should see the Review Page with:
- **Order Items Section**:
  - Each item showing: product name, quantity, grind type, and price
- **Price Breakdown Section**:
  - Raw Material Cost (if Buy + Grinding)
  - Grinding Charge
  - Grand Total (prominently displayed)
- **Estimated Ready Date**:
  - Shows date 2 business days from today (skips Sundays)
  - Displayed in a blue info box with calendar icon
- **Delivery Address Section**:
  - Shows all address details entered
- **Confirm Order Button**:
  - Green button at bottom
  - Shows loading spinner when clicked
  - Fixed at bottom on mobile

### 5. Confirm Order
1. Review all details carefully
2. Click "Confirm Order" button
3. Wait for processing (loading spinner appears)

### 6. Order Success Page (NEW - Task 16.2)
After successful order creation, you should see:
- **Success Icon**: Green checkmark in circle
- **Success Message**: "Order Placed Successfully!"
- **Order Details Card** showing:
  - Order ID (prominently displayed)
  - Order Status: "Pending" (yellow badge)
  - Estimated Ready Date (with calendar icon)
  - Order Summary with all items
  - Total Amount (in green, large font)
- **Action Buttons**:
  - "View Order History" (blue button) - navigates to /orders
  - "Place Another Order" (white button with blue border) - navigates to /order/type
- **Info Message**: Blue box explaining what happens next

## Expected Behavior

### Review Page
- ✅ Cart data loaded from CartContext
- ✅ Address loaded from localStorage
- ✅ Price breakdown calculated correctly based on order type
- ✅ Estimated ready date calculated (2 business days, skipping Sundays)
- ✅ Loading spinner shown during order submission
- ✅ Success toast shown on successful order
- ✅ Error toast shown if order fails
- ✅ Cart cleared after successful order
- ✅ Address removed from localStorage after successful order
- ✅ Redirects to success page with order data

### Success Page
- ✅ Order data received via navigation state
- ✅ All order details displayed correctly
- ✅ Buttons navigate to correct pages
- ✅ Redirects to home if no order data found

## Error Cases to Test

### Review Page
1. **Empty Cart**: Should redirect to product selection page
2. **No Address**: Should redirect to address page
3. **API Error**: Should show error toast and stay on review page
4. **Network Error**: Should show error toast

### Success Page
1. **No Order Data**: Should redirect to home page with error toast

## Mobile Responsiveness
- Test on mobile viewport (< 768px)
- Confirm button should be fixed at bottom on mobile
- All sections should stack vertically
- Touch targets should be at least 44x44px
- Text should be readable (16px minimum)

## API Integration
The review page calls:
- `POST /api/orders` with order data
- Request includes:
  - orderType
  - items array with snapshots
  - deliveryAddress object
- Response includes:
  - Order ID
  - Status
  - Total amount
  - Estimated ready date
  - Items array

## Notes
- The implementation follows the design document specifications
- Price snapshots are captured at order creation time
- Estimated ready date calculation skips Sundays
- Cart is cleared only after successful order creation
- Order data is passed to success page via React Router state
