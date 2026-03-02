# Requirements Document

## Introduction

This document specifies the requirements for a full-stack MERN Order & Delivery Management System for a local Flour & Spice Grinding Mill business. The system enables customers to place orders for grinding services and raw material purchases, while providing administrators with comprehensive order management, staff coordination, and business analytics capabilities. The application implements role-based authentication, dynamic pricing, and a mobile-first responsive design.

## Glossary

- **System**: The Flour & Spice Grinding Mill Order & Delivery Management System
- **Customer**: A registered user who places orders for grinding services or raw material purchases
- **Admin**: A privileged user who manages orders, products, delivery staff, and views analytics
- **Service Only Order**: An order where the customer provides raw materials and pays only for grinding
- **Buy + Grinding Order**: An order where the customer purchases raw materials and grinding service
- **Order Status**: The current state of an order in the workflow (Pending, In Progress, Ready, Out for Delivery, Delivered, Cancelled)
- **Delivery Staff**: Personnel assigned to deliver completed orders to customers
- **Grind Level**: The coarseness setting for grinding (Fine, Medium, Coarse)
- **JWT Token**: JSON Web Token used for authentication and session management
- **Cart**: A temporary collection of products selected by a customer before order confirmation

## Requirements

### Requirement 1: Customer Authentication

**User Story:** As a customer, I want to login using my phone number so that I can access the ordering system and track my orders.

#### Acceptance Criteria

1. WHEN a customer enters a phone number that exists in the database, THE System SHALL authenticate the customer and issue a JWT token
2. WHEN a customer enters a phone number that does not exist in the database, THE System SHALL create a new customer account automatically and issue a JWT token
3. THE System SHALL store the JWT token in the client browser for subsequent authenticated requests
4. WHEN a customer attempts to access the order placement flow without authentication, THE System SHALL redirect the customer to the login page
5. THE System SHALL validate phone number format before processing authentication

### Requirement 2: Admin Authentication

**User Story:** As an admin, I want to login with secure credentials so that I can manage the entire system with role-based access control.

#### Acceptance Criteria

1. THE System SHALL provide a separate login interface for admin users
2. WHEN an admin submits valid credentials, THE System SHALL authenticate the admin and issue a JWT token with admin role
3. THE System SHALL hash admin passwords using a secure hashing algorithm before storage
4. WHEN a non-admin user attempts to access admin routes, THE System SHALL deny access and return an authorization error
5. THE System SHALL implement rate limiting on admin login attempts to prevent brute force attacks

### Requirement 3: Customer Home Page

**User Story:** As a customer, I want to view information about the mill and its services on the home page so that I can learn about the business before placing an order.

#### Acceptance Criteria

1. THE System SHALL display information about the mill including business description and overview
2. THE System SHALL display available products with descriptions
3. THE System SHALL display current offers and advertisements
4. THE System SHALL display contact phone number, working hours, and Google Maps location
5. THE System SHALL provide an "Order Now" button that navigates authenticated customers to the order flow

### Requirement 4: Order Type Selection

**User Story:** As a customer, I want to select between "Service Only" and "Buy + Grinding" order types so that I can choose whether to provide my own raw materials or purchase them from the mill.

#### Acceptance Criteria

1. WHEN a customer begins the order flow, THE System SHALL present two order type options: "Service Only" and "Buy + Grinding"
2. WHEN a customer switches order type after adding products to cart, THE System SHALL clear the cart and reset all selections
3. THE System SHALL store the selected order type for the current order session
4. THE System SHALL apply pricing logic based on the selected order type throughout the order flow
5. THE System SHALL display clear descriptions for each order type option

### Requirement 5: Product Selection and Cart Management

**User Story:** As a customer, I want to select products with specific quantities and grind levels so that I can customize my order according to my needs.

#### Acceptance Criteria

1. THE System SHALL retrieve and display product information dynamically from the database
2. WHEN displaying a product card, THE System SHALL show product name, price per kg, quantity input field, grind level selector, and add to cart button
3. WHEN the order type is "Service Only", THE System SHALL apply only the grinding charge per kg to the product price
4. WHEN the order type is "Buy + Grinding", THE System SHALL apply both raw material price and grinding charge per kg to the product price
5. THE System SHALL allow customers to add multiple different products to a single order
6. WHEN a customer adds a product to cart, THE System SHALL validate that quantity is greater than zero and grind level is selected
7. THE System SHALL display the current cart contents with the ability to modify quantities or remove items

### Requirement 6: Delivery Address Collection

**User Story:** As a customer, I want to provide my delivery address so that the mill can deliver my completed order to the correct location.

#### Acceptance Criteria

1. THE System SHALL collect the following address fields: name, phone, street type, house name, door number, and landmark
2. THE System SHALL validate that all fields except landmark are provided before allowing order progression
3. THE System SHALL provide a dropdown selector for street type with options: "Center", "Top", "Down side"
4. WHEN a returning customer logs in, THE System SHALL auto-fill the address form with previously saved address information
5. THE System SHALL store the address information with the customer profile for future orders

### Requirement 7: Order Review and Confirmation

**User Story:** As a customer, I want to review my complete order details before confirmation so that I can verify all information is correct.

#### Acceptance Criteria

1. THE System SHALL display all selected products with their quantities, grind types, and individual prices
2. THE System SHALL calculate and display the item total, grinding charge, and raw material cost separately
3. THE System SHALL calculate and display the grand total amount for the order
4. THE System SHALL display an estimated ready date for the order
5. WHEN a customer confirms the order, THE System SHALL create the order record in the database with status "Pending"
6. THE System SHALL display a success page with order ID, order summary, status, and estimated completion time after successful order creation

### Requirement 8: Repeat Customer Features

**User Story:** As a returning customer, I want to quickly reorder previous orders so that I can save time when placing frequent orders.

#### Acceptance Criteria

1. WHEN a customer logs in, THE System SHALL retrieve and display the customer's last 5 orders
2. THE System SHALL provide a "Reorder" button for each previous order
3. WHEN a customer clicks "Reorder", THE System SHALL populate the cart with the products, quantities, and grind levels from the selected previous order
4. THE System SHALL auto-fill the customer's saved address information upon login
5. THE System SHALL allow the customer to modify the reordered items before final confirmation

### Requirement 9: Customer Order History

**User Story:** As a customer, I want to view my order history and manage pending orders so that I can track my orders and cancel if needed.

#### Acceptance Criteria

1. THE System SHALL display all past orders for the authenticated customer
2. THE System SHALL display order status for each order in the history
3. THE System SHALL provide a "Reorder" button for each historical order
4. WHEN an order status is "Pending", THE System SHALL provide a "Cancel" button for that order
5. WHEN a customer cancels a pending order, THE System SHALL update the order status to "Cancelled"

### Requirement 10: Admin Dashboard Overview

**User Story:** As an admin, I want to view key business metrics on the dashboard so that I can monitor daily operations and performance trends.

#### Acceptance Criteria

1. THE System SHALL calculate and display the total number of orders received today
2. THE System SHALL calculate and display the total revenue generated today
3. THE System SHALL calculate and display the count of orders with "Pending" status
4. THE System SHALL generate and display a chart showing the number of orders for the last 7 days
5. THE System SHALL generate and display a chart showing revenue for the last 7 days

### Requirement 11: Admin Order Management

**User Story:** As an admin, I want to view and manage all orders with filtering capabilities so that I can efficiently process orders and update their status.

#### Acceptance Criteria

1. THE System SHALL display all orders in the system to admin users
2. THE System SHALL provide filters for order status, date range, and delivery type
3. WHEN an admin applies filters, THE System SHALL display only orders matching the filter criteria
4. THE System SHALL allow admin users to update order status
5. THE System SHALL enforce the status workflow: Pending → In Progress → Ready → Out for Delivery → Delivered, with Cancelled as an alternative terminal state
6. WHEN an admin attempts an invalid status transition, THE System SHALL reject the update and display an error message

### Requirement 12: Admin Product Management

**User Story:** As an admin, I want to manage product information and pricing so that I can keep the product catalog current and accurate.

#### Acceptance Criteria

1. THE System SHALL allow admin users to add new products with name, raw material price per kg, and grinding charge per kg
2. THE System SHALL allow admin users to edit existing product information and pricing
3. THE System SHALL allow admin users to enable or disable products without deleting them
4. WHEN a product is disabled, THE System SHALL exclude it from customer product selection views
5. THE System SHALL retrieve all pricing information from the database without hardcoded values in the frontend

### Requirement 13: Admin Delivery Staff Management

**User Story:** As an admin, I want to manage delivery staff and assign them to orders so that I can coordinate order deliveries efficiently.

#### Acceptance Criteria

1. THE System SHALL allow admin users to add new delivery staff with name and phone number
2. THE System SHALL allow admin users to activate or deactivate delivery staff members
3. WHEN a delivery staff member is deactivated, THE System SHALL exclude them from assignment options
4. THE System SHALL allow admin users to assign active delivery staff to orders with status "Out for Delivery"
5. THE System SHALL track and display the number of deliveries assigned to each staff member

### Requirement 14: Admin Reporting and Analytics

**User Story:** As an admin, I want to generate reports and view analytics so that I can make informed business decisions.

#### Acceptance Criteria

1. THE System SHALL allow admin users to filter revenue data by date range
2. THE System SHALL provide an export function that generates CSV reports of filtered data
3. THE System SHALL calculate and display the most frequently ordered products
4. THE System SHALL calculate and display the percentage of pickup orders versus delivery orders
5. THE System SHALL present analytics data in a clear, readable format

### Requirement 15: Mobile-First Responsive Design

**User Story:** As a customer using a mobile device, I want the application to be fully functional and easy to use on my phone so that I can place orders conveniently.

#### Acceptance Criteria

1. THE System SHALL render all pages with a mobile-first responsive design
2. THE System SHALL provide large input fields suitable for touch interaction on mobile devices
3. THE System SHALL use clear fonts with high contrast for readability
4. THE System SHALL display a sticky cart button on mobile views for easy access
5. THE System SHALL adapt layout and navigation for tablet and desktop screen sizes

### Requirement 16: User Feedback and Loading States

**User Story:** As a user, I want to receive clear feedback on my actions and system status so that I understand what is happening during my interaction.

#### Acceptance Criteria

1. WHEN the System is processing a request, THE System SHALL display a loading spinner
2. WHEN an operation completes successfully, THE System SHALL display a toast notification with success message
3. WHEN an operation fails, THE System SHALL display a toast notification with error message
4. THE System SHALL provide visual feedback for button clicks and form submissions
5. THE System SHALL display validation errors inline with form fields

### Requirement 17: Data Validation and Security

**User Story:** As a system administrator, I want the application to validate all inputs and implement security best practices so that the system remains secure and data integrity is maintained.

#### Acceptance Criteria

1. THE System SHALL validate all user inputs on the backend using a validation library
2. THE System SHALL implement rate limiting on API endpoints to prevent abuse
3. THE System SHALL hash all admin passwords before storing them in the database
4. THE System SHALL handle errors gracefully and return appropriate error messages without exposing sensitive information
5. THE System SHALL configure CORS to allow requests only from authorized origins
6. THE System SHALL store sensitive configuration values in environment variables

### Requirement 18: Order Price Snapshot

**User Story:** As an admin, I want order prices to remain consistent even if product prices change so that historical orders reflect the prices at the time of purchase.

#### Acceptance Criteria

1. WHEN an order is created, THE System SHALL store a snapshot of the raw material price per kg for each product in the order
2. WHEN an order is created, THE System SHALL store a snapshot of the grinding charge per kg for each product in the order
3. THE System SHALL use the stored price snapshots when displaying order details and calculating totals
4. WHEN product prices are updated, THE System SHALL not affect the pricing of existing orders
5. THE System SHALL display both current prices and historical snapshot prices in admin order views
