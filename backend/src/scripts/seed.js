import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import { connectDB } from '../config/database.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Admin.deleteMany({});
    await Product.deleteMany({});
    
    // Create admin user
    console.log('Creating admin user...');
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123', // Will be hashed by the pre-save hook
      role: 'admin'
    });
    console.log(`Admin created: ${admin.username}`);
    
    // Create sample products
    console.log('Creating sample products...');
    const products = [
      {
        name: 'Wheat',
        rawMaterialPricePerKg: 40,
        grindingChargePerKg: 5,
        isActive: true,
        description: 'Premium quality wheat for flour'
      },
      {
        name: 'Rice',
        rawMaterialPricePerKg: 50,
        grindingChargePerKg: 6,
        isActive: true,
        description: 'High-quality rice for flour'
      },
      {
        name: 'Turmeric',
        rawMaterialPricePerKg: 200,
        grindingChargePerKg: 10,
        isActive: true,
        description: 'Fresh turmeric for powder'
      },
      {
        name: 'Coriander',
        rawMaterialPricePerKg: 150,
        grindingChargePerKg: 8,
        isActive: true,
        description: 'Aromatic coriander seeds'
      },
      {
        name: 'Chili',
        rawMaterialPricePerKg: 180,
        grindingChargePerKg: 12,
        isActive: true,
        description: 'Spicy red chili'
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);
    
    console.log('\n=== Seeding completed successfully! ===');
    console.log('\nAdmin Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nProducts created:');
    createdProducts.forEach(product => {
      console.log(`- ${product.name}: Raw Material ₹${product.rawMaterialPricePerKg}/kg, Grinding ₹${product.grindingChargePerKg}/kg`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
