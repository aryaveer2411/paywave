import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../../controllers/admin.controller';
import { verifyJwt } from '../../middlewares/auth.middleware';
// import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById } from '../../controllers/product.controller';

const adminProductRouter = Router();

adminProductRouter.use(verifyJwt);
adminProductRouter.post('/', createProduct);
adminProductRouter.get('/', getAllProducts);
adminProductRouter.get('/:id' ,getProduct);
adminProductRouter.patch('/:id' ,updateProduct);
adminProductRouter.delete('/:id', deleteProduct);
  
export default adminProductRouter;
