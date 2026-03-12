/**
 * Migration script to add missing orderType field to existing orders
 * This script fixes orders that were created before the orderType field was required
 * 
 * Run this script if you encounter validation errors when updating order status:
 * "Order validation failed: items.0.orderType: Path `orderType` is required."
 */

import mongoose from 'mongoose';
import Order from './src/models/Order.js';
import Customer from './src/models/Customer.js';
import { ORDER_TYPES } from './src/config/constants.js';

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ahamedammar25_db_user:icg0W6dxXGgG7f9H@cluster0.njp9gdv.mongodb.net/flour-spice-mill?retryWrites=true&w=majority&appName=Cluster0');

async function migrateOrders() {
  try {
    console.log('=== Migrating Orders ===\n');

    // Find orders that have items without orderType
    const orders = await Order.find({
      'items.orderType': { $exists: false }
    });
    
    console.log(`Found ${orders.length} orders that need migration\n`);
    
    for (const order of orders) {
      console.log(`Migrating order: ${order._id}`);
      
      // Update each item to add orderType field
      order.items.forEach(item => {
        if (!item.orderType) {
          // Default to 'buyAndService' for existing orders
          item.orderType = ORDER_TYPES.BUY_AND_SERVICE;
          console.log(`  - Added orderType: ${item.orderType} to item: ${item.productName}`);
        }
      });
      
      // Save the order (this will trigger validation)
      await order.save();
      console.log(`  ✅ Order ${order._id} migrated successfully\n`);
    }
    
    console.log('=== Migration completed successfully! ===');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    mongoose.disconnect();
  }
}

migrateOrders();