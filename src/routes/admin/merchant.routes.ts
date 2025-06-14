import { Router } from 'express';
import {
  addMerchant,
  deleteMerchant,
  updateMerchant,
  listMerchants,
} from '../../controllers/admin.controller';
import { verifyJwt } from '../../middlewares/auth.middleware';

const merchantRouter = Router();

merchantRouter.use(verifyJwt);

merchantRouter.post('/add', addMerchant);
merchantRouter.delete('/:id', deleteMerchant);
merchantRouter.patch('/:id', updateMerchant);
merchantRouter.get('/all', listMerchants);

export default merchantRouter;
