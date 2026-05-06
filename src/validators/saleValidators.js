import { body } from 'express-validator';

export const createSaleRules = [
  body('items')
    .exists().withMessage('items is required.')
    .bail()
    .isArray({ min: 1 }).withMessage('items must be a non-empty array.'),
  body('items.*.product_id')
    .exists().withMessage('product_id is required.')
    .bail()
    .isInt({ min: 1 }).withMessage('product_id must be a positive integer.')
    .toInt(),
  body('items.*.quantity')
    .exists().withMessage('quantity is required.')
    .bail()
    .isInt({ min: 1 }).withMessage('quantity must be a positive integer.')
    .toInt(),
  body('payment')
    .exists().withMessage('payment is required.')
    .bail()
    .isFloat({ gt: 0 }).withMessage('payment must be greater than 0.')
    .toFloat()
];
