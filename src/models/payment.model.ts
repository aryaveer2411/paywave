import mongoose, { Document, Schema } from 'mongoose';

export interface PaymentDocument extends Document {
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  paymentMethod: {
    type: 'card' | 'upi';
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    upiId?: string;
  };
  webhookUrl: string;
  transactionId: string;
  referenceId?: string;
  failureReason?: string;
  customerId?: string;
  merchantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'success', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ['card', 'upi'],
      },
      cardNumber: String,
      expiryMonth: String,
      expiryYear: String,
      cvv: String,
      upiId: String,
    },
    webhookUrl: String,
    transactionId: String,
    referenceId: String,
    failureReason: String,
    customerId: String,
    merchantId: String,
  },
  { timestamps: true },
);

export const Payment = mongoose.model<PaymentDocument>(
  'Payment',
  PaymentSchema,
);
