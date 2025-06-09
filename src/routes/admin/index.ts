import { Router } from 'express';
import merchantRouter from './merchant.routes';
import planRouter from './plan.routes';
import companyRouter from './company.routes';
import analyticsRouter from './analytics.routes';


const adminRouter = Router();

adminRouter.use('/merchant', merchantRouter);
adminRouter.use('/plan', planRouter);
adminRouter.use('/company', companyRouter);
adminRouter.use('/analytics', analyticsRouter);


export default adminRouter;