import { Payment } from '../models/payment.model';
import { randomUUID } from 'crypto';
import { sendWebhook } from '../utils/paymentWebHook';
import { asyncHandler } from '../utils/asyncHandler';

export const initiatePayment = asyncHandler(async (req, res) => {
  const {
    amount,
    currency,
    paymentMethod,
    webhookUrl,
    referenceId,
    customerId,
    merchantId,
  } = req.body;

  const transactionId = randomUUID(); 

  const payment = await Payment.create({
    amount,
    currency,
    paymentMethod,
    webhookUrl, //url of adding a plan for a customer
    transactionId,
    referenceId,
    customerId,
    merchantId,
  });

  res
    .status(202)
    .json({ message: 'Payment initiated', paymentId: payment._id });

  setTimeout(async () => {
    const shouldFail = paymentMethod.cardNumber === '4000000000000002';
    const status = shouldFail ? 'failed' : 'success';

    payment.status = status;
    if (shouldFail) payment.failureReason = 'Card declined (simulated)';
    await payment.save();
    await sendWebhook(webhookUrl, {
      transactionId,
      status,
      referenceId,
      amount,
      currency,
      paymentId: payment._id,
      customerId,
    });
  }, 3000);
});
