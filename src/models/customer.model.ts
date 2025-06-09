import mongoose, { Schema, Types } from 'mongoose';

export interface CustomerDocument {
  user: Types.ObjectId;
  productId?: Types.ObjectId;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  payments: Types.ObjectId[];
  planExpiryDate?: Date;
  money: number;
}

const customerSchema = new Schema<CustomerDocument>({
  user: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date },
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
  ],
  planExpiryDate: { type: Date },
  money: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const Customer = mongoose.model<CustomerDocument>(
  'Customer',
  customerSchema,
);
