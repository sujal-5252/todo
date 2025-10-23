import authService from '../services/AuthService';
import MainController from './MainController';

class ProfilePageController {
  static async renderProfilePage() {
    const profileInitial = document.querySelector(
      '.profile-page .profile-initial'
    );
    const profileNameEl = document.querySelector('.profile-page .profile-name');
    const updateProfileForm = document.querySelector('form.update-profile');
    const nameInput = updateProfileForm.querySelector('input#profile-name');

    const userInfo = await authService.getUserInfo();

    profileInitial.textContent = userInfo.name[0];
    profileNameEl.textContent = userInfo.name;
    nameInput.value = userInfo.name;

    updateProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      await authService.updateUserInfo(nameInput.value);
      MainController.showToast('Profile Updated');

      this.renderProfilePage();
    });
  }
}

export default ProfilePageController;
