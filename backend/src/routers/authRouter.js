import express from 'express';
import AuthController from '../controllers/authController.js';
import UserService from '../services/userService.js';
import validateUser from '../middlewares/validation/validateUser.js';

const userService = new UserService();
const authController = new AuthController(userService);
const authRouter = express.Router();

authRouter.post('/signup', validateUser, authController.signup);
authRouter.post('/login', validateUser, authController.login);
authRouter.post('/verify/', authController.verify);
authRouter.post('/resend-otp', authController.resendOtp);

export default authRouter;
