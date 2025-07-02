import { Roles } from '../constants';
import { Company, CompanyDocument } from '../models/company.model';
import { Customer } from '../models/customer.model';
import { Merchant } from '../models/merchant.model';
import { User, UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  companyName?: string;
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, companyName }: RegisterUserBody = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }
  let isMerchant=false;
  if (companyName && companyName !== '') {
    isMerchant = true;
  }
  const role = isMerchant ? Roles.MERCHANT : Roles.CUSTOMER;

  if (![Roles.MERCHANT, Roles.CUSTOMER].includes(role)) {
    throw new ApiError(400, 'Invalid role assignment');
  }

  let newUser: UserDocument;

  // Merchant flow
  if (role === Roles.MERCHANT) {
    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      throw new ApiError(400, 'Company with this name already exists');
    }

    const merchant = new Merchant({ name, email, password });
    newUser = await merchant.save();

    const newCompany = new Company({
      name: companyName,
      users: [newUser._id],
      admin: newUser._id,
    });

    const createdCompany = await newCompany.save();
    if (!createdCompany) {
      await User.findByIdAndDelete(newUser._id);
      throw new ApiError(500, 'Company creation failed, try again');
    }

    newUser.companyId = createdCompany._id as typeof newUser.companyId;
    await newUser.save();

    return res.status(201).json({
      response: new ApiResponse(201, 'Merchant and Company created', {
        user: newUser,
        company: createdCompany,
      }),
    });
  }

  // Customer flow
  const customer = new Customer({ name, email, password });
  newUser = await customer.save();

  return res.status(201).json({
    response: new ApiResponse(201, 'Customer created successfully', newUser),
  });
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
  const { userEmail, userName } = req.body;
  if (!userEmail || !userName) {
    res.status(201).json({
      response: new ApiResponse(201, 'Nothing to update'),
    });
  }
  if (req.user === undefined) {
    throw new ApiError(400, 'Auth failed');
  }
  const user = req.user;
  if (userEmail) user.email = userEmail;
  if (userName) user.name = userName;
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    response: new ApiResponse(201, 'Update Complete', {
      userEmail: userEmail,
      fullName: userName,
    }),
  });
});

export { registerUser, updateAccountDetails, getAllUSers };
