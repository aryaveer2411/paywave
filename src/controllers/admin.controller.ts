import { Company, CompanyDocument } from '../models/company.model';
import { User, Merchant,  UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';


interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

const options = {
  httpOnly: true,
  secure: true,
};

const addMerchant = asyncHandler(async (req, res) => {
  if (req.user === undefined) {
    throw new ApiError(400, 'Auth failed');
  }
  const { name, email, password } = req.body;
  const role = 'merchant';
  if (!(name && email)) {
    throw new ApiError(401, 'Username and Email both are required');
  }
  const id = req.user._id;
  const company: CompanyDocument | null = await Company.findOne({ admin: id });
  if (!company) {
    throw new ApiError(401, 'You are not authorized to add a merchant');
  }
  const newUser = new Merchant({ name, email, password, role });
  const isCreated: UserDocument | null = await newUser.save();
  if (!isCreated) {
    throw new ApiError(401, 'Merchant creation failed try again');
  }
  company.users.push(isCreated.id);
  const isUsersUpdated = await company.save();
  if (!isUsersUpdated) {
    await User.findByIdAndDelete(isCreated._id);
    throw new ApiError(400, 'Failed try again');
  }
  res.status(201).json({
    response: new ApiResponse(201, 'Merchant created', isCreated),
  });
});

//total merchants

// create ,delete , update plans

// delete ,update merchant

// total sales by merchants

// sales by specific merchant

// total active plans

// revoke user plan

//update company details

//delete company



export { addMerchant };
