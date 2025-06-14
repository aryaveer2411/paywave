import { Router } from 'express';
import { createPlan, getPlansForProduct, updatePlan, deletePlan } from '../../controllers/admin.controller';
import { verifyJwt } from '../../middlewares/auth.middleware';
// import { createPlan, updatePlan, deletePlan, getPlansForProduct } from '../../controllers/plan.controller';

const planRouter = Router();

planRouter.use(verifyJwt);

planRouter.post('/:productId' , createPlan );
planRouter.get('/:productId' ,getPlansForProduct );
planRouter.patch('/:productId/:planId' ,updatePlan );
planRouter.delete('/:productId/:planId' ,deletePlan);

export default planRouter;
