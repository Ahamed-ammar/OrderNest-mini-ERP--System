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

- [-] 12. Build customer home page


  - [-] 12.1 Create home page layout and content

    - Display mill information and about section
    - Display products overview section
    - Display offers and advertisements section
    - Display contact number, working hours, and Google Maps embed
    - Create "Order Now" button that navigates to order flow
    - Ensure mobile-first responsive design
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 15.1, 15.2, 15.3, 15.4_

- [ ] 13. Implement order flow - order type selection
  - [ ] 13.1 Create cart context and hooks
    - Create CartContext to manage cart state (orderType, items, totalAmount)
    - Implement addToCart function with pricing calculation
    - Implement removeFromCart function
    - Implement updateQuantity function
    - Implement clearCart function
    - Implement resetCartOnTypeChange function
    - Create useCart hook for components
    - _Requirements: 4.3, 4.4, 5.5, 5.7_
  - [ ] 13.2 Build order type selection page
    - Create two large buttons for "Service Only" and "Buy + Grinding"
    - Display clear descriptions for each option
    - On selection, set orderType in cart context
    - If cart has items and type changes, show confirmation modal before clearing
    - Navigate to product selection page after type selection
    - Ensure mobile-friendly touch targets
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 15.2_

- [ ] 14. Implement order flow - product selection
  - [ ] 14.1 Create product card component
    - Display product name
    - Display price per kg based on order type (grinding only or raw material + grinding)
    - Create quantity input field (numeric keyboard on mobile)
    - Create grind level selector (Fine/Medium/Coarse)
    - Create "Add to Cart" button
    - Validate quantity > 0 and grind level selected before adding
    - _Requirements: 5.2, 5.3, 5.4, 5.6, 15.2_
  - [ ] 14.2 Build product selection page
    - Fetch active products from API on page load
    - Display loading spinner while fetching
    - Render product cards in responsive grid
    - Display current cart summary at bottom (sticky on mobile)
    - Show cart item count and total amount
    - Create "Continue" button to proceed to address page
    - Validate cart is not empty before allowing continuation
    - _Requirements: 5.1, 5.2, 5.5, 5.7, 12.5, 15.4, 16.1_

- [ ] 15. Implement order flow - address form
  - [ ] 15.1 Build address form page
    - Create form with fields: name, phone, street type dropdown, house name, door number, landmark
    - Pre-fill name and phone from customer profile
    - Pre-fill address fields if customer has saved address
    - Implement client-side validation for required fields
    - Display validation errors inline with fields
    - Create "Continue to Review" button
    - Ensure large input fields for mobile
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 8.4, 15.2, 16.5_

- [ ] 16. Implement order flow - review and confirmation
  - [ ] 16.1 Build order review page
    - Display all cart items with product name, quantity, grind type, and price
    - Display price breakdown: item total, grinding charge, raw material cost (if applicable)
    - Display grand total prominently
    - Display estimated ready date
    - Display delivery address
    - Create "Confirm Order" button
    - Show loading spinner during order submission
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 16.1, 16.4_
  - [ ] 16.2 Implement order submission logic
    - Call POST /api/orders endpoint with cart data and address
    - Handle success by clearing cart and navigating to success page
    - Handle errors by displaying toast notification
    - _Requirements: 7.5, 16.2, 16.3_
  - [ ] 16.3 Build order success page
    - Display order ID prominently
    - Display order summary (items, total)
    - Display status as "Pending"
    - Display estimated completion time
    - Create "View Order History" button
    - Create "Place Another Order" button
    - _Requirements: 7.6_

- [ ] 17. Build customer order history page
  - [ ] 17.1 Create order history card component
    - Display order ID, date, status, and total amount
    - Display order items summary
    - Create "Reorder" button
    - Create "Cancel" button (only for Pending status)
    - _Requirements: 8.2, 9.1, 9.2, 9.3, 9.4_
  - [ ] 17.2 Build order history page
    - Fetch customer orders from API
    - Display last 5 orders prominently at top
    - Display all orders below in reverse chronological order
    - Show loading spinner while fetching
    - Implement reorder functionality that populates cart with order items
    - Implement cancel functionality for pending orders
    - Display success/error toasts for actions
    - _Requirements: 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5, 16.1, 16.2, 16.3_

- [ ] 18. Build admin dashboard page
  - [ ] 18.1 Create dashboard metric cards
    - Create card component for displaying single metric (title, value, icon)
    - Display total orders today
    - Display total revenue today
    - Display pending orders count
    - Ensure responsive layout for mobile and desktop
    - _Requirements: 10.1, 10.2, 10.3, 15.1_
  - [ ] 18.2 Create dashboard charts
    - Implement chart component using Recharts or Chart.js
    - Create orders chart for last 7 days (bar or line chart)
    - Create revenue chart for last 7 days (bar or line chart)
    - Ensure charts are responsive and mobile-friendly
    - _Requirements: 10.4, 10.5, 15.1_
  - [ ] 18.3 Build admin dashboard page layout
    - Fetch dashboard data from API on page load
    - Display loading spinner while fetching
    - Render metric cards in grid layout
    - Render charts below metrics
    - Handle errors with toast notifications
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 16.1, 16.2, 16.3_

- [ ] 19. Build admin order management page
  - [ ] 19.1 Create order table component
    - Display orders in table format with columns: Order ID, Customer, Date, Status, Total, Actions
    - Make table responsive (card layout on mobile)
    - Create status badge component with color coding
    - Create action buttons for status update and staff assignment
    - _Requirements: 11.1, 15.1_
  - [ ] 19.2 Implement order filtering
    - Create filter controls for status, date range, and delivery type
    - Fetch filtered orders from API when filters change
    - Display loading spinner during fetch
    - _Requirements: 11.2, 11.3, 16.1_
  - [ ] 19.3 Implement order status update modal
    - Create modal with status dropdown
    - Populate dropdown with valid next statuses based on current status
    - Call status update API endpoint on submit
    - Refresh order list on success
    - Display error toast for invalid transitions
    - _Requirements: 11.4, 11.5, 11.6, 16.2, 16.3_
  - [ ] 19.4 Build complete order management page
    - Integrate order table, filters, and modals
    - Fetch all orders on page load
    - Handle loading and error states
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 20. Build admin product management page
  - [ ] 20.1 Create product form component
    - Create form with fields: name, raw material price, grinding charge
    - Implement validation for required fields and positive numbers
    - Support both create and edit modes
    - _Requirements: 12.1, 12.2, 17.1_
  - [ ] 20.2 Create product table component
    - Display products in table with columns: Name, Raw Material Price, Grinding Charge, Status, Actions
    - Create toggle switch for active/inactive status
    - Create edit and delete buttons
    - Make table responsive for mobile
    - _Requirements: 12.3, 12.4, 15.1_
  - [ ] 20.3 Build product management page
    - Display "Add Product" button that opens form modal
    - Display product table
    - Implement add product functionality
    - Implement edit product functionality
    - Implement toggle active status functionality
    - Fetch products on page load and after mutations
    - Handle loading and error states with spinners and toasts
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 16.1, 16.2, 16.3_

- [ ] 21. Build admin delivery staff management page
  - [ ] 21.1 Create staff form component
    - Create form with fields: name, phone
    - Implement validation for required fields and phone format
    - Support both create and edit modes
    - _Requirements: 13.1, 17.1_
  - [ ] 21.2 Create staff table component
    - Display staff in table with columns: Name, Phone, Status, Deliveries, Actions
    - Create toggle switch for active/inactive status
    - Create edit button
    - Display delivery count for each staff member
    - Make table responsive for mobile
    - _Requirements: 13.2, 13.3, 13.5, 15.1_
  - [ ] 21.3 Build staff management page
    - Display "Add Staff" button that opens form modal
    - Display staff table
    - Implement add staff functionality
    - Implement edit staff functionality
    - Implement toggle active status functionality
    - Fetch staff on page load and after mutations
    - Handle loading and error states
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 16.1, 16.2, 16.3_

- [ ] 22. Build admin reports page
  - [ ] 22.1 Create report filters component
    - Create date range picker for filtering
    - Create "Export CSV" button
    - _Requirements: 14.1, 14.2_
  - [ ] 22.2 Create analytics display components
    - Create component to display most ordered products
    - Create component to display pickup vs delivery percentage with visual representation
    - _Requirements: 14.3, 14.4_
  - [ ] 22.3 Implement CSV export functionality
    - Call export API endpoint with date filters
    - Trigger browser download of CSV file
    - Display success/error toast
    - _Requirements: 14.2, 16.2, 16.3_
  - [ ] 22.4 Build complete reports page
    - Integrate filters and analytics components
    - Fetch analytics data based on selected filters
    - Handle loading and error states
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 16.1_

- [ ] 23. Create reusable UI components
  - [ ] 23.1 Build common components
    - Create Button component with variants (primary, secondary, danger)
    - Create Input component with validation error display
    - Create Loader/Spinner component
    - Create Modal component
    - Create Toast notification system
    - Ensure all components follow mobile-first design principles
    - _Requirements: 15.2, 15.3, 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 24. Implement mobile-specific optimizations
  - [ ] 24.1 Add mobile navigation and UI enhancements
    - Create bottom navigation bar for customer app
    - Implement hamburger menu for secondary navigation
    - Add sticky cart button with item count badge on mobile
    - Ensure all touch targets are minimum 44x44px
    - Test and adjust spacing between interactive elements
    - _Requirements: 15.2, 15.4_
  - [ ] 24.2 Optimize forms for mobile
    - Set input type="tel" for phone number fields
    - Set input type="number" for quantity fields
    - Ensure font size is 16px minimum to prevent zoom
    - Implement progressive disclosure for multi-step forms
    - Add clear progress indicators
    - _Requirements: 15.2_

- [ ] 25. Set up environment configuration and deployment preparation
  - [ ] 25.1 Configure environment variables
    - Create .env.example files for both frontend and backend
    - Document all required environment variables
    - Set up environment-specific configurations
    - _Requirements: 17.6_
  - [ ] 25.2 Prepare backend for deployment
    - Configure production MongoDB connection
    - Set up CORS for production frontend URL
    - Configure rate limiting for production
    - Add compression middleware
    - Create production start script
    - _Requirements: 17.5, 17.6_
  - [ ] 25.3 Prepare frontend for deployment
    - Configure production API URL
    - Optimize build configuration in vite.config.js
    - Set up code splitting for lazy loading
    - Configure production environment variables
    - _Requirements: 17.6_
  - [ ] 25.4 Create deployment documentation
    - Document deployment steps for Render (backend)
    - Document deployment steps for Vercel (frontend)
    - Document MongoDB Atlas setup steps
    - Create production checklist
    - _Requirements: All requirements depend on successful deployment_

- [ ] 26. Create initial admin user and seed data
  - [ ] 26.1 Create database seeding script
    - Write script to create initial admin user with hashed password
    - Write script to create sample products
    - Add script to package.json
    - _Requirements: 2.3, 12.1_
  - [ ] 26.2 Run seeding script
    - Execute seeding script to populate initial data
    - Verify admin can login
    - Verify products appear in customer view
    - _Requirements: 2.1, 12.5_
