import { Router } from 'express';

import { verifyJwt } from '../../middlewares/auth.middleware';
import {
  getCompanies,
  getMerchantById,
  getMerchantsByCompany,
} from '../../controllers/customer.controller';


const customerRouter = Router();

customerRouter.use(verifyJwt);

customerRouter.get('/companies', getCompanies);
customerRouter.get('/merchants/:companyId', getMerchantsByCompany); 
customerRouter.get('/avl-merchant/:companyId/:merchantId', getMerchantById); // will send plans as well
// customerRouter.get('/avl-merchant', getMerchants); // will send plans as well

// to pay go on payment service

export default customerRouter;
