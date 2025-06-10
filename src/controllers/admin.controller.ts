import mongoose, { isValidObjectId } from 'mongoose';
import { Company, CompanyDocument } from '../models/company.model';
import { User, Merchant, UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { Product } from '../models/product.model';
import { response } from 'express';

interface UpdateMerchant {
  name?: string;
  password?: string;
  email?: string;
  role: 'customer';
}

interface UpdateCompany {
  companyName?: string;
  newAdmin?: string;
}

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

const deleteMerchant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(401, 'Invalid ID');
  }
  if (!id) {
    throw new ApiError(401, 'Merchant ID is required');
  }

  const company = await Company.findOneAndUpdate(
    { users: id },
    { $pull: { users: id } },
    { new: true },
  );

  if (!company) {
    throw new ApiError(404, 'Company not found or user not in company');
  }

  const isUserDeleted: UserDocument | null = await User.findByIdAndDelete(id);

  if (isUserDeleted == null) {
    await Company.findByIdAndUpdate(company._id, { $addToSet: { users: id } });
    throw new ApiError(401, 'Process failed try again');
  }

  res.status(200).json({
    response: new ApiResponse(
      200,
      'Merchant deleted and removed from company',
      isUserDeleted,
    ),
  });
});

const updateMerchant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, password, email }: UpdateMerchant = req.body;
  if (!isValidObjectId(id)) {
    throw new ApiError(401, 'Invalid ID');
  }
  if (!id) {
    throw new ApiError(401, 'Merchant ID is required');
  }
  if (!(name || email || password)) {
    res.status(203).json({
      response: new ApiResponse(203, 'Nothing to update', {}),
    });
  }

  const updateData: UpdateMerchant = { role: 'customer' };
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new ApiError(404, 'Merchant not found');
  }

  res.status(200).json({
    response: new ApiResponse(200, 'Merchant updated', updatedUser),
  });
});

const listMerchants = asyncHandler(async (req, res) => {
  const admin = req.user;
  if (!admin) {
    throw new ApiError(400, 'admin logged out');
  }

  const totalMerchants = await Company.aggregate([
    {
      $match: {
        admin: new mongoose.Types.ObjectId(admin?.id),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'users',
        foreignField: '_id',
        as: 'listMerchants',
      },
    },
    {
      $project: {
        listMerchants: {
          $map: {
            input: '$listMerchants',
            as: 'merchant',
            in: {
              _id: '$$merchant._id',
              name: '$$merchant.name',
              email: '$$merchant.email',
            },
          },
        },
      },
    },
  ]);

  const list = totalMerchants[0]?.listMerchants || [];
  res.status(200).json({
    count: list.length,
    merchants: list,
  });
});

const updateCompanyDetails = asyncHandler(async (req, res) => {
  const company = req.company;
  if (!company) {
    throw new ApiError(401, 'Auth failed re try again');
  }
  if (!company.isAdmin) {
    throw new ApiError(401, 'You are not admin');
  }
  const { companyName, newAdmin }: UpdateCompany = req.body;
  if (!(companyName || newAdmin)) {
    throw new ApiError(401, 'nothing to update');
  }
  if (newAdmin !== '' && !isValidObjectId(newAdmin)) {
    throw new ApiError(401, 'Invalid ID');
  }

  const comapnyDb: CompanyDocument | null = await Company.findById({
    id: company.companyId,
  });

  if (!comapnyDb) {
    throw new ApiError(401, 'Throw company didnt exist');
  }

  if (newAdmin) {
    const user: UserDocument | null = await User.findById(newAdmin);
    if (!user) {
      throw new ApiError(404, 'New admin user not found');
    }
    const userId = user._id as mongoose.Types.ObjectId;
    if (!comapnyDb.users.includes(userId)) {
      throw new ApiError(
        400,
        'User must be part of the company to be set as admin',
      );
    }
    comapnyDb.admin = userId;
  }
  if (companyName) {
    comapnyDb.name = companyName;
  }

  const updatedCompany = await comapnyDb.save();
  res.status(200).json({
    response: new ApiResponse(200, 'Company updated', {
      name: updatedCompany.name,
      admin: comapnyDb.admin,
    }),
  });
});

export const deleteCompanyAndUsers = async (
  companyId: string,
): Promise<boolean> => {
  const session = await mongoose.startSession();
  let isCompanyDeleted = false;
  try {
    session.startTransaction();

    const company = await Company.findById(companyId).session(session);
    if (!company) throw new Error('Company not found');

    const userIds = company.users;

    await User.deleteMany({ _id: { $in: userIds } }).session(session);

    await Product.deleteMany({ createdBy: { $in: userIds } }).session(session);

    await Company.deleteOne({ _id: companyId }).session(session);

    await session.commitTransaction();
    console.log('Company and associated users deleted successfully');
    return true;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting company and users:', error);
    return false;
  } finally {
    session.endSession();
  }
};

const deleteCompany = asyncHandler(async (req, res) => {
  const company = req.company;
  if (!company) {
    throw new ApiError(401, 'Auth failed re try again');
  }
  if (!company.isAdmin) {
    throw new ApiError(401, 'You are not admin');
  }
  const isCompanyDeleted = await deleteCompanyAndUsers(company.companyId);

  if (!isCompanyDeleted) {
    throw new ApiError(401, 'Try again later');
  }

  res.status(201).json({
    response: new ApiResponse(201, 'Company deleted'),
  });
});

export {
  addMerchant,
  deleteMerchant,
  updateMerchant,
  listMerchants,
  updateCompanyDetails,
  deleteCompany,
};
