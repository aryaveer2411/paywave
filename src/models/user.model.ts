// import mongoose, { Schema, Document, Model } from 'mongoose';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config';

// export interface UserDocument extends Document {
//   name: string;
//   email: string;
//   password: string;
//   refreshToken?: string;
// createdAt: Date;
// updatedAt: Date;
// isPasswordCorrect(password: string): Promise<boolean>;
// generateAccessToken(): string;
// generateRefreshToken(): string;
// }

// const userSchema = new Schema<UserDocument>(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//     },
//     refreshToken: {
//       type: String,
//     }
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       transform: (_doc, ret) => {
//         ret.createdAt = Math.floor(new Date(ret.createdAt).getTime() / 1000);
//         ret.updatedAt = Math.floor(new Date(ret.updatedAt).getTime() / 1000);
//         delete ret.__v;
//         delete ret.password;
//         return ret;
//       },
//     },
//   },
// );

// userSchema.pre<UserDocument>('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.isPasswordCorrect = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };

// userSchema.methods.generateAccessToken = function (): string {
//   const secret = config.ACCESS_TOKEN_SECRET;
//   const expiry = config.ACCESS_TOKEN_EXPIRY;

//   if (!secret || !expiry) {
//     throw new Error(
//       'ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY is not defined',
//     );
//   }

//   const payload = { _id: this._id };
//   const options: SignOptions = {
//     expiresIn: expiry as SignOptions['expiresIn'],
//   };

//   return jwt.sign(payload, secret, options);
// };

// userSchema.methods.generateRefreshToken = function (): string {
//   const secret = config.REFRESH_TOKEN_SECRET;
//   const expiry = config.REFRESH_TOKEN_EXPIRY;

//   if (!secret || !expiry) {
//     throw new Error(
//       'REFRESH_TOKEN_SECRET or REFRESH_TOKEN_EXPIRY is not defined',
//     );
//   }

//   const payload = { _id: this._id };
//   const options: SignOptions = {
//     expiresIn: expiry as SignOptions['expiresIn'],
//   };

//   return jwt.sign(payload, secret, options);
// };

// export const User: Model<UserDocument> = mongoose.model<UserDocument>(
//   'User',
//   userSchema,
// );

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'merchant' | 'customer';
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['merchant', 'customer'],
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const secret = config.ACCESS_TOKEN_SECRET;
  const expiry = config.ACCESS_TOKEN_EXPIRY;

  if (!secret || !expiry) {
    throw new Error(
      'ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY is not defined',
    );
  }

  const payload = { _id: this._id };
  const options: SignOptions = {
    expiresIn: expiry as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function (): string {
  const secret = config.REFRESH_TOKEN_SECRET;
  const expiry = config.REFRESH_TOKEN_EXPIRY;

  if (!secret || !expiry) {
    throw new Error(
      'REFRESH_TOKEN_SECRET or REFRESH_TOKEN_EXPIRY is not defined',
    );
  }

  const payload = { _id: this._id };
  const options: SignOptions = {
    expiresIn: expiry as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

export const User = mongoose.model<UserDocument>('User', userSchema);

// Merchant discriminator schema
interface MerchantDocument extends UserDocument {
  products: mongoose.Types.ObjectId[];
  payments: mongoose.Types.ObjectId[];
}

const merchantSchema = new Schema<MerchantDocument>({
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
});

export const Merchant = User.discriminator<MerchantDocument>(
  'Merchant',
  merchantSchema,
);

// Customer discriminator schema
interface CustomerDocument extends UserDocument {
  productId?: mongoose.Types.ObjectId;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  payments: mongoose.Types.ObjectId[];
  money: number;
}

const customerSchema = new Schema<CustomerDocument>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  subscriptionStart: Date,
  subscriptionEnd: Date,
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  money: { type: Number, default: 0 },
});

export const Customer = User.discriminator<CustomerDocument>(
  'Customer',
  customerSchema,
);
