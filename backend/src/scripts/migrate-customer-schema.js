import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flour-spice-mill';

async function migrateCustomerSchema() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the customers collection to apply new schema
    console.log('\nDropping customers collection...');
    await mongoose.connection.db.dropCollection('customers').catch(() => {
      console.log('Customers collection does not exist, skipping drop');
    });
    console.log('Customers collection dropped successfully');

    console.log('\n✅ Migration completed successfully!');
    console.log('\nNote: All existing customer data has been removed.');
    console.log('Users will need to sign up again with the new authentication system.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run migration
migrateCustomerSchema();
