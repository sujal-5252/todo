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

  async verifyUser(userId) {
    await User.findByIdAndUpdate(userId, { verified: true });
  }
}

export default UserService;
