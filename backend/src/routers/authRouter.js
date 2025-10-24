import express from 'express';
import multer from 'multer';
import AuthController from '../controllers/authController.js';
import UserService from '../services/userService.js';
import validateUser from '../middlewares/validation/validateUser.js';
import isAuthenticated from '../middlewares/auth/isAuthenticated.js';

const userService = new UserService();
const authController = new AuthController(userService);
const authRouter = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

authRouter.post('/signup', validateUser, authController.signup);
authRouter.post('/login', validateUser, authController.login);
authRouter.post('/verify', authController.verify);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.get('/refresh-token', isAuthenticated, authController.refreshToken);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.get('/user', isAuthenticated, authController.getUser);
authRouter.put(
  '/user',
  isAuthenticated,
  upload.single('profile_image'),
  authController.updateUser
);

export default authRouter;
