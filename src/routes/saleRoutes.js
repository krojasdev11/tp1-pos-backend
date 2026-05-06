import { Router } from 'express';
import { createSale, getDailySales, getSales } from '../controllers/saleController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createSaleRules } from '../validators/saleValidators.js';

export const saleRouter = Router();

saleRouter.use(authenticate);

saleRouter.post('/', authorize('ADMIN', 'USER'), createSaleRules, validate, createSale);
saleRouter.get('/', authorize('ADMIN'), getSales);
saleRouter.get('/daily', authorize('ADMIN'), getDailySales);
