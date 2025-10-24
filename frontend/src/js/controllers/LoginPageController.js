import authService from '../services/AuthService';
import MainController from './MainController';

class LoginPageController {
  static addEventListenersLoginPage() {
    const headingLogin = document.querySelector('.login h1 span#login');
    const headingSignup = document.querySelector('.login h1 span#signup');
    const resetPassword = document.querySelector('.reset-password');
    const message = document.querySelector('.login .message');

    headingLogin.addEventListener('click', () => {
      headingSignup.classList.remove('selected');
      headingLogin.classList.add('selected');

      resetPassword.style.display = 'block';
      message.textContent = '';

      document.querySelector('.login form input#name').disabled = true;

      document.querySelector('.login form div#name').classList.add('hidden');
      document.querySelector('.login form button').textContent = 'Login';
    });

    headingSignup.addEventListener('click', () => {
      headingLogin.classList.remove('selected');
      headingSignup.classList.add('selected');

      resetPassword.style.display = 'none';
      message.textContent = '';

      document.querySelector('.login form input#name').disabled = false;
      document.querySelector('.login form div#name').classList.remove('hidden');
      document.querySelector('.login form button').textContent =
        'Create Account';
    });

    const loginForm = document.querySelector('.login form');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const messageEl = document.querySelector('.login form .message');
      const formButton = document.querySelector('.login form button');

      const email = document.querySelector('.login input#email').value;
      const password = document.querySelector('.login input#password').value;
      const name = document.querySelector('.login input#name').value;

      try {
        messageEl.className = 'message success';

        if (formButton.textContent === 'Create Account') {
          await authService.signup(name, email, password);
          this.renderOtpPage(email);
        } else if (formButton.textContent === 'Login') {
          await authService.login(email, password);
          window.location.reload();
        }
      } catch (err) {
        console.log(err);
        messageEl.className = 'message error';
        messageEl.textContent = err.message;
      }
    });

    resetPassword.addEventListener('click', () => {
      this.renderResetPasswordPage();
    });
  }

  static renderResetPasswordPage() {
    const heading = document.querySelector('.login h1');
    const form = document.querySelector('.login form');

    const emailContainer = document.createElement('div');
    const emailLabel = document.createElement('label');
    const emailInput = document.createElement('input');
    const generateOtpButton = document.createElement('button');

    const otpContainer = document.createElement('div');
    const otpLabel = document.createElement('label');
    const otpInput = document.createElement('input');

    const passwordContainer = document.createElement('div');
    const passwordLabel = document.createElement('label');
    const passwordInput = document.createElement('input');
    const message = document.createElement('div');

    const submitButton = document.createElement('button');

    heading.textContent = 'Reset Password';
    form.innerHTML = '';
    form.id = 'reset-password';

    emailContainer.classList.add('input-container');
    otpContainer.classList.add('input-container');
    passwordContainer.classList.add('input-container');
    message.classList.add('message');

    generateOtpButton.textContent = 'Send OTP';
    generateOtpButton.style.backgroundColor = 'yellow';
    otpLabel.textContent = 'Enter OTP';
    otpInput.type = 'text';
    otpInput.maxLength = 6;
    otpInput.minLength = 6;
    otpInput.placeholder = 'Enter OTP sent to you email';
    otpInput.disabled = true;

    emailLabel.textContent = 'Email';
    emailInput.type = 'email';

    passwordLabel.textContent = 'New Password:';
    passwordInput.type = 'Password';
    passwordInput.disabled = 'true';

    submitButton.textContent = 'Reset Password';
    submitButton.style.backgroundColor = 'gray';
    submitButton.id = 'disabled';

    generateOtpButton.addEventListener('click', async () => {
      if (emailInput.value === '') {
        message.textContent = 'Enter Email';
        message.className = 'message error';
        return;
      }

      try {
        await authService.sendOtp(emailInput.value);

        message.textContent = 'OTP sent';
        message.className = 'message success';
      } catch (err) {
        message.textContent = err.response.data.message;
        message.className = 'message error';
        return;
      }

      submitButton.style.backgroundColor = '';

      MainController.showToast('Otp sent');

      passwordInput.disabled = false;
      otpInput.disabled = false;
      generateOtpButton.textContent = 'Resend OTP';
      submitButton.id = '';
    });

    submitButton.addEventListener('click', async () => {
      if (!emailInput.value || !otpInput.value || !passwordInput.value) {
        message.textContent = 'One or more fields are missing';
        message.className = 'message error';
        return;
      }

      try {
        await authService.resetPassword(
          emailInput.value,
          otpInput.value,
          passwordInput.value
        );

        MainController.showToast('Reset password successfully');

        setInterval(() => window.location.reload(), 1000);
      } catch (err) {
        message.textContent = err.response.data.message;
        message.className = 'message error';
        return;
      }
    });

    emailContainer.appendChild(emailLabel);
    emailContainer.appendChild(emailInput);
    otpContainer.appendChild(otpLabel);
    otpContainer.appendChild(otpInput);
    passwordContainer.appendChild(passwordLabel);
    passwordContainer.appendChild(passwordInput);
    passwordContainer.appendChild(message);

    form.appendChild(emailContainer);
    form.appendChild(generateOtpButton);
    form.appendChild(otpContainer);
    form.appendChild(passwordContainer);
    form.appendChild(submitButton);
  }

  static renderOtpPage(email) {
    const heading = document.querySelector('.login h1');
    const form = document.querySelector('.login form');

    const container = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const resendLink = document.createElement('a');
    const message = document.createElement('div');
    const button = document.createElement('button');

    container.classList.add('input-container');
    message.classList.add('message');

    label.for = 'otp';
    input.type = 'text';
    input.name = 'otp';
    input.id = 'otp';
    input.maxLength = 6;
    input.minLength = 6;
    input.placeholder = 'Enter OTP sent to you email';

    form.innerHTML = '';
    heading.textContent = 'Verify OTP';
    button.textContent = 'Verify OTP';
    resendLink.textContent = 'Resend OTP';

    button.addEventListener('click', async () => {
      const otp = input.value;

      try {
        await authService.verify(email, otp);

        MainController.showToast(
          'Account created successfully. Redirecting to login page'
        );

        setInterval(() => window.location.reload(), 3000);
      } catch (err) {
        message.textContent = err.response.data.message;
      }
    });

    resendLink.addEventListener('click', async () => {
      await authService.resendOtp(email);

      message.textContent = 'OTP Resent';
      message.classList.toggle('error');
    });

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(resendLink);
    container.appendChild(message);

    form.appendChild(container);
    form.appendChild(button);
  }
}

export default LoginPageController;
