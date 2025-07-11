import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, UserDocument } from '../models/user.model';
import { config } from '../config';
import { Company, CompanyDocument } from '../models/company.model';
import mongoose from 'mongoose';

interface Company {
  companyName: string;
  companyId: string;
  isAdmin: boolean;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument;
    company?: Company;
  }
}

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(401, 'Unauth request');
    }
    const decodedToken: JwtPayload | string = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET,
    );
    if (typeof decodedToken === 'string') {
      throw new ApiError(401, 'Invalid format of jwt payload');
    }

    const user: UserDocument | null = await User.findById(
      decodedToken?._id,
    ).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    const companyDoc: CompanyDocument | null = await Company.findOne({
      $or: [{ admin: user._id }, { users: user._id }],
    }).select('-users');
    if (companyDoc) {
      const companyData: Company = {
        companyId: companyDoc.id,
        companyName: companyDoc.name,
        isAdmin: (companyDoc.admin as mongoose.Types.ObjectId).equals(
          user._id as mongoose.Types.ObjectId,
        ),
      };
      req.company = companyData;
    }
    if (req.baseUrl.includes('/customer') && user.role === 'merchant') {
      throw new ApiError(401,"Can not access customer routes")
    }
   
    if (req.baseUrl.includes('/merchant') && user.role === 'customer') {
      throw new ApiError(401, 'Can not access merchant routes');
    }
    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message || 'Invalid Access Token');
    }
    throw new ApiError(401, 'Invalid Access Token');
  }
});

export { verifyJwt };
