import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createProductRules,
  listProductsRules,
  productIdRules,
  updateProductRules
} from '../validators/productValidators.js';

export const productRouter = Router();

productRouter.use(authenticate);

productRouter.get('/', authorize('ADMIN', 'USER'), listProductsRules, validate, getProducts);
productRouter.post('/', authorize('ADMIN'), createProductRules, validate, createProduct);
productRouter.put('/:id', authorize('ADMIN'), updateProductRules, validate, updateProduct);
productRouter.delete('/:id', authorize('ADMIN'), productIdRules, validate, deleteProduct);
