import { body } from 'express-validator';

export const loginRules = [
  body('username')
    .exists().withMessage('username is required.')
    .bail()
    .isString().withMessage('username must be a string.')
    .isLength({ min: 3, max: 50 }).withMessage('username must be between 3 and 50 characters.'),
  body('password')
    .exists().withMessage('password is required.')
    .bail()
    .isString().withMessage('password must be a string.')
    .isLength({ min: 6, max: 100 }).withMessage('password must be between 6 and 100 characters.')
];
