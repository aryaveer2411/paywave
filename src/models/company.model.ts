import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CompanyDocument extends Document { 
  name: string;
  users: Types.ObjectId[];
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<CompanyDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

companySchema.pre<CompanyDocument>('save', function (next) {
  if (this.isNew && this.users.length == 1 && !this.admin) {
    this.admin = this.users[0];
  }
  next();
});

export const Company = mongoose.model<CompanyDocument>(
  'Company',
  companySchema,
);
