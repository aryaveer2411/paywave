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

const productRouter = Router();

productRouter.use(verifyJwt);
productRouter.post('/', createProduct);
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProduct);
productRouter.patch('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);
  
export default productRouter;
