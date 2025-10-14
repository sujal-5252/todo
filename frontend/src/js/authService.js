import axios from 'axios';

class AuthService {
  api = axios.create({
    baseURL: 'http://localhost:3001/auth/',
  });

  async signup(email, password) {
    try {
      await this.api.post('/signup', { email, password });
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/login', { email, password });

      localStorage.setItem('access-token', response.data.accessToken);
      localStorage.setItem('refresh-token', response.data.refreshToken);
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async verify(email, otp) {
    await this.api.post(`/verify`, { email, otp });
  }

  async sendOtp(email) {
    await this.api.post('/send-otp', { email });
  }

  async resetPassword(email, otp, password) {
    await this.api.post('/reset-password', { email, otp, password });
  }
}

export default AuthService;
