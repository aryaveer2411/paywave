import { Company, CompanyDocument } from '../models/company.model';
import { User, Merchant, Customer, UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, companyName }: RegisterUserBody = req.body;
  console.log(name, email, password, companyName);
  const role = companyName?.trim() ? 'merchant' : 'customer';
  if (!(name && email && password)) {
    throw new ApiError(400, 'All fields are required');
  }
  const user: UserDocument | null = await User.findOne({ email: email });
  if (user) {
    throw new ApiError(400, 'User already exist');
  }
  let newUser;
  if (role === 'merchant') {
    newUser = new Merchant({ name, email, password, role });
  } else if (role === 'customer') {
    newUser = new Customer({ name, email, password, role });
  } else {
    throw new ApiError(400, 'Role must be merchant or customer');
  }
  const isUserCreated = await newUser.save();
  if (!isUserCreated) {
    throw new ApiError(400, 'User creation failed');
  }
  if (companyName !== '') {
    const company = new Company({
      name: companyName,
      users: [isUserCreated._id],
      admin: isUserCreated._id,
    });
    const isCompanyCreated = await company.save();
    if (!isCompanyCreated) {
      await User.findByIdAndDelete(isUserCreated._id);
      throw new ApiError(400, 'Failed try again');
    }
    res.status(201).json({
      response: new ApiResponse(
        201,
        'Merchant created successfully',
        isCompanyCreated,
      ),
    });
  } else {
    res.status(201).json({
      response: new ApiResponse(201, 'User created successfully', newUser),
    });
  }
});

// const deleteUser = asyncHandler(async (req, res) => {
//   const { userID } = req.query;
//   const isUserExist: UserDocument | null = await User.findById(userID);
//   if (!isUserExist) {
//     throw new ApiError(400, 'user doesnt exist');
//   }
//   const company: CompanyDocument | null = await Company.findOne({
//     admin: userID,
//   });
//   if (company?.users.length !== 0) {
//     throw new ApiError(
//       401,
//       'You are admin , transfer your admin status to someone else',
//     );
//   }
//   const userDeleted = await User.findByIdAndDelete(userID).lean();
//   if (!userDeleted) {
//     throw new ApiError(400, 'Cant fullfill opertaion');
//   }
//   // Convert the deleted user to a plain object to avoid circular references
//   // const userDeletedPlain = userDeleted.toObject();
//   res.status(201).json({
//     response: new ApiResponse(200, 'User Deleted', userDeleted),
//   });
// });

const getAllUSers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshToken');

  if (!users || users.length === 0) {
    throw new ApiError(404, 'No users found', [], 'Not Found');
  }

  res.status(200).json({
    response: new ApiResponse(200, 'Users fetched successfully', users),
  });
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { userEmail, fullName } = req.body;
  if (!userEmail || !fullName) {
    res.status(200).json({
      response: new ApiResponse(201, 'Nothing to update'),
    });
  }
  if (req.user === undefined) {
    throw new ApiError(400, 'Auth failed');
  }
  const user = req.user;
  if (userEmail) user.email = userEmail;
  if (fullName) user.name = fullName;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    response: new ApiResponse(201, 'Update Complete', {
      userEmail: userEmail,
      fullName: fullName,
    }),
  });
});

export { registerUser, updateAccountDetails,  getAllUSers };
