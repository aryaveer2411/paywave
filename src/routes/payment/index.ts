import { Router } from 'express';

import { verifyJwt } from '../../middlewares/auth.middleware';
import { initiatePayment } from '../../controllers/payment.controller';

const paymentRouter = Router();



paymentRouter.post('/initiate', initiatePayment);
export default paymentRouter;
