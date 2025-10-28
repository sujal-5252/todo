import LoginPageController from './LoginPageController.js';
import ProfilePageController from './ProfilePageController.js';
import TodoPageController from './TodoPageController.js';

class MainController {
  static showToast(message = 'This is a toast notification!') {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');

    toast.classList.add('toast');
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3000);
  }

  static async renderHomePage() {
    this.hideAllPages();

    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      this.unhidePage('login');
      LoginPageController.addEventListenersLoginPage();

      return;
    }

    const isProfilePage = window.location.pathname.startsWith('/profile');

    if (isProfilePage) {
      this.unhidePage('profile');
      await ProfilePageController.renderProfilePage();

      return;
    }

    this.unhidePage('todo');
    await TodoPageController.renderTodoPage();
  }

  static hideAllPages() {
    const divs = document.querySelectorAll('body > div');

    divs.forEach((div) =>
      div.id !== 'toast-container' ? div.classList.add('hidden') : ''
    );
  }

  static unhidePage(page) {
    let selector;

    switch (page) {
      case 'profile':
        selector = '.profile-page';
        break;

      case 'todo':
        selector = '.app';
        break;

      case 'login':
        selector = '.login';
        break;

      default:
        throw new Error('Page does not exist');
    }

    document.querySelector(selector).classList.remove('hidden');
  }
}

export default MainController;
