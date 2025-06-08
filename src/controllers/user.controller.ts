import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const registerUser = asyncHandler(async (req, res) => {
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
    });
});

export { registerUser };
