import mongoose from 'mongoose';
import { Company, CompanyDocument } from '../models/company.model';
import { User, UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { response } from 'express';
import { Product, ProductDocument } from '../models/product.model';

const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({});
  if (!companies) {
    throw new ApiError(401, 'Error fetching companies');
  }
  return res.status(201).json({
    response: new ApiResponse(201, 'Comapnies fetched', companies),
  });
});

const getMerchantsByCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  if (!companyId) {
    throw new ApiError(401, 'Send company ID');
  }
  const merchants = await User.aggregate([
    {
      $match: {
        companyId: new mongoose.Types.ObjectId(companyId),
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);

  return res.status(201).json({
    response: new ApiResponse(201, 'merchants fetched', {
      count: merchants.length,
      merchants,
    }),
  });
});

const getMerchantById = asyncHandler(async (req, res) => {
  const { companyId, merchantId } = req.params;
  if (!(merchantId && companyId)) {
    throw new ApiError(401, 'Send Merchant and Company ID');
  }
  const merchant: UserDocument | null = await User.findById(merchantId);
  if (!merchant) {
    throw new ApiError(401, 'Merchant not found');
  }

  const company: CompanyDocument | null = await Company.findById(companyId);

  if (!company) {
    throw new ApiError(401, 'company not found');
  }
  merchant.isAvl = false;
  merchant.save();
  const products: ProductDocument[] = await Product.find({ owner: companyId });
  if (!products || products.length === 0) {
    throw new ApiError(401, 'product not found');
  }
  return res.status(201).json({
    response: new ApiResponse(201, 'Products', products),
  });
});

const freehMerchant = asyncHandler(async (req, res) => {
  const { merchantId } = req.body;

  if (!merchantId) {
    throw new ApiError(400, 'Merchant ID is required');
  }
  const merchant: UserDocument | null = await User.findById(merchantId);
  if (!merchant) {
    throw new ApiError(401, 'Merchant not found');
  }
  merchant.isAvl = true;
  merchant.save();

  res.status(200).json({
    message: 'Conversation cancelled successfully',
    merchant,
  });
});

// hit payments pending needs to be done

export { getCompanies, getMerchantById, getMerchantsByCompany, freehMerchant };
