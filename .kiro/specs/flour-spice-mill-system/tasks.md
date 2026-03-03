# Implementation Plan

- [x] 1. Initialize project structure and dependencies







  - Create backend folder with Express.js setup
  - Create frontend folder with Vite + React setup
  - Install and configure Tailwind CSS in frontend
  - Install all required npm packages for both frontend and backend
  - Create folder structure as per design document
  - Set up .env.example files for both projects
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Set up database connection and configuration








  - [x] 2.1 Create database configuration file

    - Write MongoDB connection logic using Mongoose
    - Implement connection error handling and retry logic
    - Create constants file for application-wide constants
    - _Requirements: 17.6_
  - [x] 2.2 Define all Mongoose schemas and models


    - Create Customer model with phone unique index
    - Create Product model with name unique index and isActive index
    - Create Order model with embedded items and address, add indexes for customerId, status, and createdAt
    - Create Admin model with username unique index
    - Create DeliveryStaff model with phone unique index
    - _Requirements: 1.1, 1.2, 5.1, 12.1, 13.1, 18.1, 18.2_

- [x] 3. Implement authentication system











  - [x] 3.1 Create JWT utility functions


    - Write functions to generate JWT tokens with role-based expiration
    - Write function to verify JWT tokens
    - _Requirements: 1.3, 2.2_
  - [x] 3.2 Create authentication middleware


    - Write middleware to verify JWT token from request headers
    - Write middleware to check user role for admin routes
    - Implement error responses for invalid or missing tokens
    - _Requirements: 1.4, 2.4_
  - [x] 3.3 Implement customer authentication endpoints


    - Create customer login/register endpoint that checks phone existence
    - If phone exists, return existing customer with JWT token
    - If phone doesn't exist, create new customer and return JWT token
    - Implement phone number format validation
    - _Requirements: 1.1, 1.2, 1.5_
  - [x] 3.4 Implement admin authentication endpoints


    - Create admin login endpoint with username/password validation
    - Hash admin passwords using bcrypt before storage
    - Return JWT token with admin role on successful login
    - Implement rate limiting on admin login endpoint
    - _Requirements: 2.1, 2.2, 2.3, 2.5_
-

- [x] 4. Create product management system



  - [x] 4.1 Implement product service layer


    - Write functions to create, read, update products
    - Write function to toggle product active status
    - Implement logic to filter only active products for customers
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  - [x] 4.2 Create product API endpoints


    - Create GET /api/products endpoint to fetch all active products
    - Create GET /api/products/:id endpoint for single product
    - Create POST /api/products endpoint for admin to add products
    - Create PUT /api/products/:id endpoint for admin to update products
    - Create PATCH /api/products/:id/toggle endpoint for admin to enable/disable products
    - Apply admin authentication middleware to admin-only endpoints
    - _Requirements: 5.1, 12.1, 12.2, 12.3, 12.4, 12.5_
  - [x] 4.3 Implement input validation for product endpoints


    - Validate product name, rawMaterialPricePerKg, and grindingChargePerKg
    - Ensure prices are non-negative numbers
    - Validate ObjectId format for product ID parameter
    - _Requirements: 17.1_

- [x] 5. Build order creation and management system




  - [x] 5.1 Create order service layer with pricing logic


    - Write function to calculate item total based on order type (serviceOnly vs buyAndService)
    - Write function to calculate order grand total
    - Write function to create price snapshots from current product prices
    - Write function to calculate estimated ready date (2 business days)
    - _Requirements: 5.3, 5.4, 7.2, 7.4, 18.1, 18.2_
  - [x] 5.2 Implement order creation endpoint


    - Create POST /api/orders endpoint for customers
    - Validate cart has items and all required fields are present
    - Fetch current product prices and create snapshots
    - Calculate totals using order service functions
    - Save order with status "Pending" and estimated ready date
    - Return order ID, summary, and estimated completion time
    - _Requirements: 5.5, 5.6, 6.2, 7.5, 7.6, 18.1, 18.2, 18.3_
  - [x] 5.3 Create order retrieval endpoints

    - Create GET /api/customer/orders endpoint to fetch customer's order history
    - Create GET /api/orders/:id endpoint to fetch single order details
    - Create GET /api/orders endpoint for admin to fetch all orders with filters
    - Implement filtering by status, date range, and delivery type
    - _Requirements: 9.1, 11.1, 11.2, 11.3_
  - [x] 5.4 Implement order status update with workflow validation

    - Create PUT /api/orders/:id/status endpoint for admin
    - Implement status transition validation logic (Pending → InProgress → Ready → OutForDelivery → Delivered)
    - Allow Cancelled from any non-terminal state
    - Return error for invalid transitions
    - _Requirements: 11.4, 11.5, 11.6_
  - [x] 5.5 Create order cancellation endpoint

    - Create PUT /api/customer/orders/:id/cancel endpoint
    - Validate order belongs to authenticated customer
    - Validate order status is "Pending"
    - Update status to "Cancelled"
    - _Requirements: 9.4, 9.5_
  - [x] 5.6 Implement input validation for order endpoints


    - Validate order type is either "serviceOnly" or "buyAndService"
    - Validate each item has productId, quantity > 0, and valid grindType
    - Validate address fields (all required except landmark)
    - Validate status transitions
    - _Requirements: 17.1_

- [x] 6. Implement customer profile and repeat order features




  - [x] 6.1 Create customer profile endpoints


    - Create GET /api/customer/profile endpoint to fetch customer data
    - Create PUT /api/customer/profile endpoint to update address information
    - _Requirements: 6.4, 8.4_
  - [x] 6.2 Implement order history with reorder functionality


    - Modify GET /api/customer/orders to return last 5 orders prominently
    - Include all order details needed for reorder (items, quantities, grind types)
    - _Requirements: 8.1, 8.2, 8.3, 9.2, 9.3_

- [x] 7. Build delivery staff management system




  - [x] 7.1 Create delivery staff service layer


    - Write functions to create, read, update delivery staff
    - Write function to toggle staff active status
    - Write function to count deliveries per staff member
    - _Requirements: 13.1, 13.2, 13.3, 13.5_
  - [x] 7.2 Implement delivery staff API endpoints


    - Create GET /api/delivery-staff endpoint for admin
    - Create POST /api/delivery-staff endpoint to add new staff
    - Create PUT /api/delivery-staff/:id endpoint to update staff
    - Create PATCH /api/delivery-staff/:id/toggle endpoint to activate/deactivate
    - Create GET /api/delivery-staff/:id/deliveries endpoint to get delivery count
    - Apply admin authentication middleware to all endpoints
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  - [x] 7.3 Create staff assignment endpoint


    - Create PUT /api/orders/:id/assign-staff endpoint for admin
    - Validate staff is active before assignment
    - Validate order status is appropriate for delivery assignment
    - Update order with deliveryStaffId
    - _Requirements: 13.4_

- [x] 8. Implement admin dashboard and analytics


  - [x] 8.1 Create analytics service layer
    - Write function to count orders for today
    - Write function to calculate revenue for today
    - Write function to count pending orders
    - Write function to get order counts for last 7 days
    - Write function to get revenue for last 7 days
    - Write function to calculate most ordered products
    - Write function to calculate pickup vs delivery percentage

    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 14.3, 14.4_
  - [x] 8.2 Create admin dashboard endpoint

    - Create GET /api/admin/dashboard endpoint
    - Return all dashboard metrics in single response
    - Apply admin authentication middleware
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 8.3 Implement reporting endpoints

    - Create GET /api/admin/analytics/revenue endpoint with date filtering
    - Create GET /api/admin/reports/export endpoint to generate CSV
    - Implement date range filtering logic
    - _Requirements: 14.1, 14.2, 14.5_

- [x] 9. Add error handling and security middleware






  - [x] 9.1 Create global error handler middleware

    - Write centralized error handling middleware
    - Map error types to appropriate HTTP status codes
    - Return consistent error response format
    - Avoid exposing sensitive information in error messages
    - _Requirements: 17.4_


  - [x] 9.2 Implement rate limiting middleware

    - Configure rate limiter for login endpoints (5 requests per 15 minutes)
    - Configure rate limiter for general API (100 requests per 15 minutes)
    - Configure rate limiter for admin endpoints (50 requests per 15 minutes)
    - _Requirements: 2.5, 17.2_
  - [x] 9.3 Configure CORS and security headers


    - Set up CORS with frontend URL from environment variable
    - Enable credentials for CORS
    - _Requirements: 17.5_

- [x] 10. Build frontend authentication and routing




  - [x] 10.1 Set up Axios configuration with interceptors


    - Create axios instance with base URL from environment
    - Add request interceptor to attach JWT token to headers
    - Add response interceptor to handle 401 errors and redirect to login
    - Add response interceptor for global error toast notifications
    - _Requirements: 1.3, 16.2, 16.3_
  - [x] 10.2 Create authentication context and hooks


    - Create AuthContext to manage user state and JWT token
    - Implement login function that stores token in localStorage
    - Implement logout function that clears token and redirects
    - Create useAuth hook for components to access auth state
    - _Requirements: 1.3, 1.4_
  - [x] 10.3 Implement protected route components


    - Create ProtectedRoute component that checks authentication
    - Create AdminRoute component that checks admin role
    - Redirect unauthenticated users to login page
    - _Requirements: 1.4, 2.4_
  - [x] 10.4 Set up React Router with all routes


    - Configure routes for customer pages (home, login, order flow, history)
    - Configure routes for admin pages (login, dashboard, management pages)
    - Apply ProtectedRoute to customer routes
    - Apply AdminRoute to admin routes
    - _Requirements: 1.4, 2.4_

- [x] 11. Create customer authentication pages






  - [x] 11.1 Build customer login page

    - Create form with phone number input
    - Implement phone number validation (10 digits)
    - Call customer login API endpoint
    - Store JWT token and redirect to home page on success
    - Display error toast on failure
    - _Requirements: 1.1, 1.2, 1.5, 16.2, 16.3_

  - [x] 11.2 Build admin login page

    - Create form with username and password inputs
    - Call admin login API endpoint
    - Store JWT token and redirect to admin dashboard on success
    - Display error toast on failure
    - _Requirements: 2.1, 2.2, 16.2, 16.3_

- [x] 12. Build customer home page




  - [x] 12.1 Create home page layout and content


    - Display mill information and about section
    - Display products overview section
    - Display offers and advertisements section
    - Display contact number, working hours, and Google Maps embed
    - Create "Order Now" button that navigates to order flow
    - Ensure mobile-first responsive design
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 15.1, 15.2, 15.3, 15.4_

- [x] 13. Implement order flow - order type selection and cart management





  - [x] 13.1 Create API service files for frontend


    - Create productApi.js with functions to fetch products
    - Create orderApi.js with functions to create, fetch, update, and cancel orders
    - Create customerApi.js with functions to get/update profile
    - Create adminApi.js with functions for dashboard, analytics, and reports
    - Create deliveryStaffApi.js with functions to manage staff
    - _Requirements: All requirements depend on API communication_

  - [x] 13.2 Create cart context and hooks

    - Create CartContext to manage cart state (orderType, items, totalAmount)
    - Implement addToCart function with pricing calculation
    - Implement removeFromCart function
    - Implement updateQuantity function
    - Implement clearCart function
    - Implement resetCartOnTypeChange function
    - Create useCart hook for components
    - _Requirements: 4.3, 4.4, 5.5, 5.7_

  - [x] 13.3 Build order type selection page

    - Create two large buttons for "Service Only" and "Buy + Grinding"
    - Display clear descriptions for each option
    - On selection, set orderType in cart context
    - If cart has items and type changes, show confirmation modal before clearing
    - Navigate to product selection page after type selection
    - Ensure mobile-friendly touch targets
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 15.2_

- [x] 14. Implement order flow - product selection





  - [x] 14.1 Build product selection page with product cards

    - Fetch active products from API on page load with loading state
    - Display product cards in responsive grid with product name and price per kg based on order type
    - Add quantity input field (numeric keyboard on mobile) and grind level selector (Fine/Medium/Coarse)
    - Implement "Add to Cart" button with validation (quantity > 0 and grind level selected)
    - Display current cart summary at bottom (sticky on mobile) with item count and total amount
    - Add "Continue" button to proceed to address page with cart validation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 12.5, 15.2, 15.4, 16.1_

- [x] 15. Implement order flow - address form
  - [x] 15.1 Build address form page
    - Create form with fields: name, phone, street type dropdown (Center/Top/Down side), house name, door number, landmark
    - Pre-fill name and phone from customer profile using customer API
    - Pre-fill address fields if customer has saved address
    - Implement client-side validation for required fields (all except landmark)
    - Display validation errors inline with fields
    - Add "Continue to Review" button that validates and navigates to review page
    - Ensure large input fields (16px minimum) for mobile to prevent zoom
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 8.4, 15.2, 16.5_

- [x] 16. Implement order flow - review and confirmation






  - [x] 16.1 Build order review and submission page

    - Display all cart items with product name, quantity, grind type, and price
    - Display price breakdown: item total, grinding charge, raw material cost (if applicable)
    - Display grand total prominently
    - Display estimated ready date (2 business days)
    - Display delivery address from localStorage
    - Add "Confirm Order" button with loading spinner during submission
    - Call POST /api/orders endpoint with cart data and address
    - Handle success by clearing cart and navigating to success page with order details
    - Handle errors by displaying toast notification
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 16.1, 16.2, 16.3, 16.4_

  - [x] 16.2 Build order success page

    - Display order ID prominently
    - Display order summary (items, total)
    - Display status as "Pending"
    - Display estimated completion time
    - Add "View Order History" button that navigates to order history page
    - Add "Place Another Order" button that navigates to order type page
    - _Requirements: 7.6_

- [x] 17. Build customer order history page






  - [x] 17.1 Build order history page with reorder and cancel functionality




    - Fetch customer orders from GET /api/customer/orders endpoint with loading state
    - Display last 5 orders prominently at top
    - Display all orders below in reverse chronological order with order ID, date, status, total, and items summary
    - Add "Reorder" button for each order that populates cart with order items and navigates to product selection page
    - Add "Cancel" button for orders with "Pending" status that calls cancel endpoint
    - Display success/error toasts for reorder and cancel actions
    - Ensure mobile-friendly card layout
    - _Requirements: 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5, 16.1, 16.2, 16.3_

- [x] 18. Build admin dashboard page




  - [x] 18.1 Build admin dashboard page with metrics and charts


    - Fetch dashboard data from GET /api/admin/dashboard endpoint with loading state
    - Create metric cards displaying total orders today, total revenue today, and pending orders count
    - Implement charts using Recharts for orders and revenue over last 7 days
    - Ensure responsive layout for mobile and desktop (cards in grid, charts stacked on mobile)
    - Handle errors with toast notifications
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 15.1, 16.1, 16.2, 16.3_

- [ ] 19. Build admin order management page
  - [ ] 19.1 Build order management page with filtering and status updates
    - Fetch all orders from GET /api/orders endpoint with loading state
    - Display orders in responsive table/card layout with columns: Order ID, Customer, Date, Status, Total, Actions
    - Create status badge component with color coding for different statuses
    - Implement filter controls for status, date range, and delivery type that refetch orders
    - Create status update modal with dropdown showing valid next statuses based on current status
    - Call PUT /api/orders/:id/status endpoint on status update and refresh order list
    - Create staff assignment modal that calls PUT /api/orders/:id/assign-staff endpoint
    - Display error toast for invalid status transitions
    - Make table responsive with card layout on mobile
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 1 1.6, 15.1, 16.1, 16.2, 16.3_

- [ ] 20. Build admin product management page
  - [ ] 20.1 Build product management page with CRUD operations
    - Fetch all products from GET /api/products endpoint with loading state
    - Display products in responsive table/card layout with columns: Product Name, Raw Material Price, Grinding Charge, Status, Actions
    - Create product form modal for adding new products
    - Create product form modal for editing existing products with pre-filled data
    - Implement form validation for product name, prices (non-negative numbers)
    - Call POST /api/products endpoint to create new products
    - Call PUT /api/products/:id endpoint to update existing products
    - Add toggle button to enable/disable products using PATCH /api/products/:id/toggle endpoint
    - Display success/error toast for all operations
    - Make table responsive with card layout on mobile
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 15.1, 16.1, 16.2, 16.3_

- [ ] 21. Build admin delivery staff management page
  - [ ] 21.1 Build staff management page with CRUD operations
    - Fetch all delivery staff from GET /api/delivery-staff endpoint with loading state
    - Display staff in responsive table/card layout with columns: Name, Phone, Status, Delivery Count, Actions
    - Create staff form modal for adding new staff members
    - Create staff form modal for editing existing staff with pre-filled data
    - Implement form validation for name and phone number
    - Call POST /api/delivery-staff endpoint to create new staff
    - Call PUT /api/delivery-staff/:id endpoint to update existing staff
    - Add toggle button to activate/deactivate staff using PATCH /api/delivery-staff/:id/toggle endpoint
    - Fetch and display delivery count for each staff member from GET /api/delivery-staff/:id/deliveries endpoint
    - Display success/error toast for all operations
    - Make table responsive with card layout on mobile
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 15.1, 16.1, 16.2, 16.3_

- [ ] 22. Build admin reports page
  - [ ] 22.1 Build reports page with analytics and CSV export
    - Create date range picker for filtering analytics data
    - Fetch analytics data from GET /api/admin/analytics/revenue endpoint based on selected date range
    - Display most ordered products with visual representation (list or chart)
    - Display pickup vs delivery percentage with visual representation (pie chart or progress bars)
    - Add "Export CSV" button that calls GET /api/admin/reports/export endpoint with date filters
    - Trigger browser download of CSV file on successful export
    - Display success/error toast for export action
    - Handle loading states while fetching analytics
    - Ensure responsive layout for mobile
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 16.1, 16.2, 16.3_

- [x] 23. Create reusable UI components and implement toast notifications
  - [x] 23.1 Set up toast notification system
    - Install and configure react-toastify
    - Create toast configuration in main.jsx
    - Add ToastContainer to main.jsx
    - Configure axios interceptors to show toast on errors
    - _Requirements: 16.2, 16.3_
  - [x] 23.2 Build Modal component
    - Create Modal component with title, content, confirm, and cancel actions
    - Ensure mobile-friendly design
    - _Requirements: 15.2, 15.3, 16.1, 16.4, 16.5_
  - [x] 23.3 Build additional common components





    - Create Button component with variants (primary, secondary, danger) for consistent styling
    - Create Input component with validation error display for forms
    - Create Loader/Spinner component for loading states
    - Ensure all components follow mobile-first design principles with large touch targets
    - _Requirements: 15.2, 15.3, 16.1, 16.4, 16.5_

- [x] 24. Implement mobile-specific optimizations






  - [x] 24.1 Add mobile navigation and UI enhancements

    - Create bottom navigation bar for customer app with icons for Home, Orders, Profile
    - Implement hamburger menu for admin secondary navigation
    - Ensure all touch targets are minimum 44x44px
    - Test and adjust spacing between interactive elements (minimum 8px)
    - Add sticky cart summary on product selection page for mobile
    - _Requirements: 15.2, 15.4_


  - [ ] 24.2 Optimize forms for mobile
    - Set input type="tel" for phone number fields to trigger numeric keyboard
    - Set input type="number" for quantity fields
    - Ensure font size is 16px minimum on all inputs to prevent iOS zoom
    - Add clear progress indicators for multi-step order flow
    - Test form usability on mobile devices
    - _Requirements: 15.2_

- [x] 26. Create initial admin user and seed data
  - [x] 26.1 Create database seeding script
    - Write script to create initial admin user with hashed password
    - Write script to create sample products
    - Add script to package.json
    - _Requirements: 2.3, 12.1_
  - [x] 26.2 Run seeding script
    - Execute seeding script to populate initial data
    - Verify admin can login
    - Verify products appear in customer view
    - _Requirements: 2.1, 12.5_
