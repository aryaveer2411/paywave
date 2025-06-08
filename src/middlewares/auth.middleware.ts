import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, UserDocument } from '../models/user.model.js';
import { config } from '../config';


declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument;
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
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );

    if (!token) {
      throw new ApiError(401, 'Invalid Access Token');
    }
    if (!user) {
      throw new ApiError(401, 'User not found');
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
