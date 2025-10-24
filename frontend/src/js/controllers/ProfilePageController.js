import authService from '../services/AuthService';
import MainController from './MainController';

class ProfilePageController {
  static async renderProfilePage() {
    const profileImageEl = document.querySelector(
      '.profile-page .profile-image'
    );
    const profileNameEl = document.querySelector('.profile-page .profile-name');
    const updateProfileForm = document.querySelector('form.update-profile');
    const nameInput = updateProfileForm.querySelector('input#profile-name');
    const profileImageInput = updateProfileForm.querySelector(
      'input#profile_image'
    );

    const userInfo = await authService.getUserInfo();

    profileImageEl.src =
      'http://localhost:3001/uploads/' + userInfo.profileImage;
    profileNameEl.textContent = userInfo.name;
    nameInput.value = userInfo.name;

    updateProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      await authService.updateUserInfo(
        nameInput.value,
        profileImageInput.files[0]
      );
      MainController.showToast('Profile Updated');

      this.renderProfilePage();
    });
  }
}

export default ProfilePageController;
