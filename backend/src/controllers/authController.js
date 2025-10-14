import { generateTokenFromUserId } from '../utils/tokenUtil.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

class AuthController {
  constructor(userService) {
    this.userService = userService;
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  signup = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      let user;

      try {
        user = await this.userService.getUserByEmail(email);
        if (user.verified) {
          return next(new Error('User with the given email already exist'));
        }

        this.userService.updatePassword(email, hashedPassword);
      } catch {
        user = await this.userService.createUser(email, hashedPassword);
      }

      this.sendVerificationLink(
        email,
        await this.userService.generateOtp(user._id)
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

      if (!user) {
        return next(new Error('Account not found'));
      }

      if (!userVerified) {
        res.status(400);
        return next(new Error('Account not found'));
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
      const { email, otp } = req.body;

      if (!otp || !email) {
        res.status(400);
        return next(new Error('Email or Otp is missing'));
      }

      await this.userService.verifyUser(email, otp);

      res.send({ success: true, messsage: 'User Verified' });
    } catch (err) {
      res.status(401);
      next(err);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401);
        return next(new Error('Invalid refresh token provided'));
      }

      const payload = jwt.verify(refreshToken, process.env.SECRET);
      const newAccessToken = generateTokenFromUserId(payload.userId, 'access');
      const newRefreshToken = generateTokenFromUserId(
        payload.userId,
        'refresh'
      );

      res.send({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      res.status(401);
      next(err);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, otp, password } = req.body;

      if (!email || !otp || !password) {
        res.status(400);
        return next(new Error('One or more parameters are missing'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.userService.resetPassword(email, otp, hashedPassword);

      res.json({ success: true });
    } catch (err) {
      res.status(404);
      next(err);
    }
  };

  sendOtp = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await this.userService.getUserByEmail(email);
      const newOtp = await this.userService.generateOtp(user._id);

      this.sendVerificationLink(email, newOtp);

      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  };

  async sendVerificationLink(email, otp) {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verification Link',
        text: `Enter this otp to verify: ${otp} Otp will expire in 5 mins`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      return error;
    }
  }
}

export default AuthController;
