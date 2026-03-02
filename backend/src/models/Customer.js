import mongoose from 'mongoose';
import { USER_ROLES, STREET_TYPES } from '../config/constants.js';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    streetType: {
      type: String,
      enum: Object.values(STREET_TYPES),
      trim: true
    },
    houseName: {
      type: String,
      trim: true
    },
    doorNo: {
      type: String,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      default: USER_ROLES.CUSTOMER,
      immutable: true
    }
  },
  {
    timestamps: true
  }
);

// Index on phone for faster lookups
customerSchema.index({ phone: 1 });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
