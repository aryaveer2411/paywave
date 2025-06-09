import { User, UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

const options = {
  httpOnly: true,
  secure: true,
};

const generateJWTTokens = async (user: UserDocument) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(404, 'jwt token generation failed', [], 'Not Found');
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, userName, password } = req.body;
  if ((!userEmail || !userName) && !password) {
    throw new ApiError(
      404,
      'Send username or useremail and password',
      [],
      'Not Found',
    );
  }
  const user = await User.findOne({
    $or: [{ userName: userName }, { userEmail: userEmail }],
  });
  if (!user) {
    throw new ApiError(404, 'No user exist', [], 'Not Found');
  }
  const isCorrectPassword = await user.isPasswordCorrect(password);
  if (!isCorrectPassword) {
    throw new ApiError(404, 'Incorrect Password', [], 'Not Found');
  }
  const { accessToken, refreshToken } = await generateJWTTokens(user);
  res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      response: new ApiResponse(200, 'user logged in successfully', {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
    });
});

const logOutUser = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, 'User not authenticated');
    }
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        refreshToken: undefined,
      },
    });

    res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new ApiResponse(201, 'Logout SucessFul', {}));
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message);
    }
    throw new ApiError(401, 'Logout Failed');
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingToken =
      req.cookies?.refreshToken || req.header('refreshToken');
    if (!incomingToken) {
      throw new ApiError(400, 'refresh token missing');
    }

    const decodedToken: JwtPayload | string = jwt.verify(
      incomingToken,
      config.ACCESS_TOKEN_SECRET,
    );
    if (typeof decodedToken === 'string') {
      throw new ApiError(401, 'Invalid format of jwt payload');
    }

    const userID = decodedToken._id;

    const user = await User.findById(userID).select('-password');

    if (!user) {
      throw new ApiError(400, 'Invalid Refreshtoken');
    }
    if (user.refreshToken !== incomingToken) {
      throw new ApiError(400, 'Token Expired or Used');
    }
    const { refreshToken, accessToken } = await generateJWTTokens(user);

    res
      .status(201)
      .cookie('refreshToken', refreshToken, options)
      .cookie('accessToken', accessToken, options)
      .json(
        new ApiResponse(200, 'Tokens Refreshed', {
          refreshToken: refreshToken,
          accessToken: accessToken,
        }),
      );
  } catch (error) {
    console.error('Refresh token error:', error);
    throw new ApiError(
      401,
      error instanceof Error ? error.message : 'Invalid refresh token',
    );
  }
});

const changePassword = asyncHandler(async (req, res) => { 
  const incomingAccessToken =
    req.cookies?.accessToken || req.header('accessToken');
  const { currentPassword, newPassword } = req.body;
  if (!incomingAccessToken) {
    throw new ApiError(401, 'Invalid request');
    // logOutUser();
  }
  if (!req.user || !req.user._id) {
    throw new ApiError(401, 'User not authenticated');
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, 'User doesnt exist');
  }
  const isPasswordMatch = user.isPasswordCorrect(currentPassword);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Incorrect Password');
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    response: new ApiResponse(201, 'Password changed'),
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (req.user === undefined) {
    throw new ApiError(400, 'Auth failed');
  }
  const user: UserDocument = req.user;
  res.status(200).json({
    response: new ApiResponse(200, 'Current user info', user),
  });
});

export {
  logOutUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  changePassword,
};
