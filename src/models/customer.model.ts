import mongoose, { Schema, Types } from 'mongoose';
import { User, UserDocument } from './user.model';
import { Roles } from '../constants';

export interface CustomerDocument extends UserDocument {
  productId?: Types.ObjectId;
  planId?: string;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  payments: Types.ObjectId[];
  planExpiryDate?: Date;
  money: number;
}

const customerSchema = new Schema<CustomerDocument>(
  {
    role: { type: String, default: Roles.CUSTOMER },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    planId: { type: String }, // embedded plan ID
    subscriptionStart: Date,
    subscriptionEnd: Date,
    payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    planExpiryDate: Date,
    money: { type: Number, default: 0 },
  },
  { _id: false },
);

export const Customer = User.discriminator<CustomerDocument>(
  'Customer',
  customerSchema,
);
