import { Router } from 'express';

import { verifyJwt } from '../../middlewares/auth.middleware';


const merchantRouter = Router();

// merchantRouter.post('/initiate', initiatePayment);
export default merchantRouter;
