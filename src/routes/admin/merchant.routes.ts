import { Router } from 'express';
import {
  addMerchant,
  deleteMerchant,
  updateMerchant,
  listMerchants,
} from '../../controllers/admin.controller';

const merchantRouter = Router();

merchantRouter.post('/add', addMerchant);
merchantRouter.delete('/:id', deleteMerchant);
merchantRouter.patch('/:id', updateMerchant);
merchantRouter.get('/all', listMerchants);

export default merchantRouter;
