import mongoose, { Schema, Document, Model } from 'mongoose';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config';

export interface UserDocument extends Document {
  name: string;
  email: string;
  profileImage: {
    url: string;
    public_id: string;
  };
  password: string;
  refreshToken?: string;
  isAdmin: boolean;
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
    },
    profileImage: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.createdAt = Math.floor(new Date(ret.createdAt).getTime() / 1000);
        ret.updatedAt = Math.floor(new Date(ret.updatedAt).getTime() / 1000);
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
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

export const User: Model<UserDocument> = mongoose.model<UserDocument>(
  'User',
  userSchema,
);
