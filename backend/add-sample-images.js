/**
 * Script to add sample imageUrl to existing products for testing
 * This simulates what would happen when admin uploads images
 * 
 * Run this script if you have existing products without images
 * and want to test the image functionality
 */

import mongoose from 'mongoose';
import Product from './src/models/Product.js';

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ahamedammar25_db_user:icg0W6dxXGgG7f9H@cluster0.njp9gdv.mongodb.net/flour-spice-mill?retryWrites=true&w=majority&appName=Cluster0');

async function addSampleImages() {
  try {
    console.log('=== Adding Sample Images to Products ===\n');

    // Sample image URLs (these would normally be uploaded files)
    const sampleImages = {
      'Wheat': '/uploads/products/wheat-sample.jpg',
      'Rice': '/uploads/products/rice-sample.jpg', 
      'Turmeric': '/uploads/products/turmeric-sample.jpg',
      'Chili': '/uploads/products/chili-sample.jpg',
      'Coriander': '/uploads/products/coriander-sample.jpg'
    };

    const products = await Product.find();
    console.log(`Found ${products.length} products\n`);

    for (const product of products) {
      // Find matching image for product name
      const imageKey = Object.keys(sampleImages).find(key => 
        product.name.toLowerCase().includes(key.toLowerCase())
      );
      
      if (imageKey && !product.imageUrl) {
        product.imageUrl = sampleImages[imageKey];
        await product.save();
        console.log(`✅ Added image to ${product.name}: ${product.imageUrl}`);
      } else if (product.imageUrl) {
        console.log(`⏭️  ${product.name} already has image: ${product.imageUrl}`);
      } else {
        console.log(`⚠️  No matching image found for ${product.name}`);
      }
    }
    
    console.log('\n=== Sample Images Added Successfully! ===');
    
    // Verify the changes
    console.log('\n=== Verification ===');
    const updatedProducts = await Product.find();
    updatedProducts.forEach(product => {
      console.log(`${product.name}: ${product.imageUrl || 'No image'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

addSampleImages();