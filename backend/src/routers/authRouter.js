import express from 'express';
import AuthController from '../controllers/authController.js';
import UserService from '../services/userService.js';

const userService = new UserService();
const authController = new AuthController(userService);
const authRouter = express.Router();

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.get('/verify/:token', authController.verify);

export default authRouter;
