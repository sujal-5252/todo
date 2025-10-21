import axios from 'axios';

class AuthService {
  api = axios.create({
    baseURL: 'http://localhost:3001/auth/',
  });

  async signup(name, email, password) {
    try {
      await this.api.post('/signup', { name, email, password });
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/login', { email, password });

      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
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

  async getUserInfo() {
    const response = await this.api.get('/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const user = response.data.result;

    return user;
  }

  async updateUserInfo(name) {
    const response = await this.api.post(
      '/user',
      { name },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    const user = response.data.result;

    return user;
  }
}

export default AuthService;
