import OTP from '../models/OTP.js';
import User from '../models/User.js';

class UserService {
  async createUser(email, password) {
    const user = new User({ email, password });
    await user.save();
    return user;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async isVerified(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.verified;
  }

  async updatePassword(email, newPassword) {
    await User.findOneAndUpdate({ email: email }, { password: newPassword });
  }

  async verifyUser(email, otp) {
    const user = await this.getUserByEmail(email);
    const actualOtp = await OTP.findOne({ userId: user._id });

    console.log(Number(otp), actualOtp.value);

    console.log(actualOtp.expiry, Date.now());
    if (Number(otp) !== actualOtp.value || actualOtp.expiry < Date.now()) {
      throw new Error('Invalid OTP');
    }

    user.verified = true;
    await user.save();
  }

  async generateOtp(userId) {
    const otp = await OTP.findOneAndUpdate(
      { userId },
      {
        userId: userId,
        value: Math.floor(100000 + Math.random() * 900000),
        expiry: new Date(Date.now() + 300 * 1000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return otp.value;
  }
}

export default UserService;
