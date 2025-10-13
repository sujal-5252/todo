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

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async verify(email, otp) {
    await this.api.post(`/verify`, { email, otp });
  }

  async resendOtp(email) {
    await this.api.post('/resend-otp', { email });
  }
}

export default AuthService;
