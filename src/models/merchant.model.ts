import mongoose, { Schema, Types } from 'mongoose';
import { User, UserDocument } from './user.model';
import { Roles } from '../constants';

export interface MerchantDocument extends UserDocument {
  products: Types.ObjectId[];
  payments: Types.ObjectId[];
  planExpiryDate?: Date;
}

const merchantSchema = new Schema<MerchantDocument>(
  {
    role: { type: String, default: Roles.MERCHANT },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    planExpiryDate: Date,
  },
  { _id: false },
);

export const Merchant = User.discriminator<MerchantDocument>(
  'Merchant',
  merchantSchema,
);
