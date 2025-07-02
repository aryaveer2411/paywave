import { Customer, CustomerDocument } from '../models/customer.model';
import { User, UserDocument } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

const addPlan = asyncHandler(async (req, res) => {
  const {
    status,
    referenceId,
    customerId,
    paymentId,
  } = req.body;
  console.log(req.body);
  const planDetails: string[] = referenceId.split('-');
  const productId = planDetails[2];
  const planId = planDetails[3];
  console.log(planDetails,"plan");
  if (status !== 'success') {
    return res
      .status(200)
      .json({ message: 'Payment not successful, no action taken.' });
  }
  // Find the customer
  const customer = await Customer.findById(customerId);
  if (!customer) {
    console.log("nocustomer");
    throw new ApiError(404, 'Customer not found');
  }
  // Update subscription details
  customer.productId = new (require('mongoose').Types.ObjectId)(productId);
  customer.planId = planId;
  customer.subscriptionStart = new Date();
  const interval = planDetails[4];
  let subscriptionEnd: Date | undefined = undefined;
  if (interval === 'monthly') {
    subscriptionEnd = new Date(customer.subscriptionStart);
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);
  } else if (interval === 'yearly') {
    subscriptionEnd = new Date(customer.subscriptionStart);
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 365);
  }
  customer.subscriptionEnd = subscriptionEnd;
  customer.planExpiryDate = customer.subscriptionEnd;
  if (paymentId) {
    customer.payments = customer.payments || [];
    customer.payments.push(paymentId);
  }

  await customer.save();
  res
    .status(200)
    .json({ message: 'Plan added to customer after successful payment.' });
});


export { addPlan };