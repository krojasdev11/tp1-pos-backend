import { body, param, query } from 'express-validator';

export const listProductsRules = [
  query('category')
    .optional()
    .isString().withMessage('category must be a string.')
    .isLength({ min: 1, max: 60 }).withMessage('category must be between 1 and 60 characters.')
];

export const productIdRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('id must be a positive integer.')
    .toInt()
];

export const createProductRules = [
  body('name')
    .exists().withMessage('name is required.')
    .bail()
    .isString().withMessage('name must be a string.')
    .isLength({ min: 2, max: 120 }).withMessage('name must be between 2 and 120 characters.'),
  body('price')
    .exists().withMessage('price is required.')
    .bail()
    .isFloat({ gt: 0 }).withMessage('price must be greater than 0.')
    .toFloat(),
  body('stock')
    .exists().withMessage('stock is required.')
    .bail()
    .isInt({ min: 0 }).withMessage('stock must be an integer greater than or equal to 0.')
    .toInt(),
  body('category')
    .exists().withMessage('category is required.')
    .bail()
    .isString().withMessage('category must be a string.')
    .isLength({ min: 2, max: 60 }).withMessage('category must be between 2 and 60 characters.')
];

export const updateProductRules = [
  ...productIdRules,
  ...createProductRules
];
