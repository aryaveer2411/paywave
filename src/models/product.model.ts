import mongoose, { Schema, Types } from 'mongoose';

export interface Plan {
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export interface ProductDocument {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  plans: Plan[];
  createdAt: Date;
}

const PlanSchema = new Schema<Plan>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  interval: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true,
  },
  features: [String],
});

const productSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: true,
  },
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plans: {
    type: [PlanSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model<ProductDocument>(
  'Product',
  productSchema,
);
