import { Router } from 'express';

import { verifyJwt } from '../../middlewares/auth.middleware';
import { addPlan } from '../../controllers/merchant.controller';


const merchantRouter = Router();

//merchantRouter.use(verifyJwt);

merchantRouter.post('/add-plan', addPlan);
export default merchantRouter;
