import mongoose, { Schema, Types } from 'mongoose';

export interface MerchantDocument {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  payments: Types.ObjectId[];
  planExpiryDate?: Date;
}

const merchantSchema = new Schema<MerchantDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
  ],
  planExpiryDate: { type: Date },
});

export const Merchant = mongoose.model<MerchantDocument>(
  'Merchant',
  merchantSchema,
);
