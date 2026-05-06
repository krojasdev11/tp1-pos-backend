import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { loginRules } from '../validators/authValidators.js';
import { validate } from '../middlewares/validate.js';

export const authRouter = Router();

authRouter.post('/login', loginRules, validate, login);
