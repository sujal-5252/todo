import { generateTokenFromUserId } from '../utils/tokenUtil.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  signup = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userService.createUser(email, hashedPassword);
      console.log(user);

      console.log(
        'Generated verification token: ' + generateTokenFromUserId(user._id)
      );

      res.json({
        success: true,
      });
    } catch (err) {
      res.status(400);
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.getUserByEmail(email);
      const userVerified = user.verified;
      const isPasswordVerified = await bcrypt.compare(password, user.password);
      console.log({ user });

      if (!userVerified) {
        res.status(400);
        return next(new Error('User not verified'));
      }

      if (!isPasswordVerified) {
        res.status(401);
        return next(new Error('Wrong password'));
      }

      res.json({
        success: true,
        accessToken: generateTokenFromUserId(user._id, 'access'),
        refreshToken: generateTokenFromUserId(user._id, 'refresh'),
      });
    } catch (err) {
      res.status(404);
      next(err);
    }
  };

  verify = async (req, res, next) => {
    try {
      const token = req.params.token;

      if (!token) {
        res.status(400);
        return next(new Error('Token not provided'));
      }

      const payload = jwt.verify(token, process.env.SECRET);
      const userId = payload.userId;

      await this.userService.verifyUser(userId);
      res.send({ success: true });
    } catch (err) {
      res.status(401);
      next(err);
    }
  };
}

export default AuthController;
