import mongoose from 'mongoose';
import axios from 'axios';
import { Company, CompanyDocument } from '../models/company.model';
import { User, UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { config } from '../config';
import { Product, ProductDocument } from '../models/product.model';
import { Merchant, MerchantDocument } from '../models/merchant.model';

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
  const merchant: MerchantDocument | null = await User.findById(merchantId);
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
    response: new ApiResponse(201, 'Products', {
      products: products,
      merchantId: merchantId,
    }),
  });
});

const freehMerchant = asyncHandler(async (req, res) => {
  const { merchantId } = req.body;

  if (!merchantId) {
    throw new ApiError(400, 'Merchant ID is required');
  }
  const merchant: MerchantDocument | null = await User.findById(merchantId);
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

const selectPlanAndPay = asyncHandler(async (req, res) => {
  const userID = req.user?.id;
  if (!userID) {
    throw new ApiError(401, 'User is logged out');
  }
  const { merchantId, productId, planId, paymentMethod } = req.body;
  if (!merchantId || !productId || !planId || !paymentMethod) {
    throw new ApiError(401, 'PLease select a product');
  }

  const product: ProductDocument | null = await Product.findById(productId);

  if (!product) {
    throw new ApiError(401, 'Please selecta valid product');
  }

  if (planId > product.plans.length || planId < 0) {
    throw new ApiError(401, 'Selecta valid plan');
  }

  const plan = product.plans[planId];

  const duration = plan.interval;

  const paymentPayload = {
    amount: plan.price,
    currency: 'INR',
    paymentMethod,
    customerId: userID,
    merchantId,
    productId,
    planId,
    webhookUrl: `http://localhost:${config.MERCHANT_PORT}/merchant/add-plan`, // need to write a controlle rin merchgant controoler to add plan to user
    referenceId: `${Date.now()}-${userID}-${productId}-${planId}-${duration}`,
  };

  const paymentServiceUrl = `http://localhost:${config.PAYMENT_PORT}/payment/initiate`;

  try {
    const paymentRes = await axios.post(paymentServiceUrl, paymentPayload);
    res.status(paymentRes.status).json(paymentRes.data);
  } catch (error: any) {
    throw new ApiError(
      500,
      'Payment service error',
      error?.response?.data || error.message,
    );
  }
});

export {
  getCompanies,
  getMerchantById,
  getMerchantsByCompany,
  freehMerchant,
  selectPlanAndPay,
};
