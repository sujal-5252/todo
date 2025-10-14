import express from 'express';
import AuthController from '../controllers/authController.js';
import UserService from '../services/userService.js';
import validateUser from '../middlewares/validation/validateUser.js';

const userService = new UserService();
const authController = new AuthController(userService);
const authRouter = express.Router();

authRouter.post('/signup', validateUser, authController.signup);
authRouter.post('/login', validateUser, authController.login);
authRouter.post('/verify', authController.verify);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/reset-password', authController.resetPassword);

export default authRouter;
