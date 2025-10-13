import AuthService from './authService.js';
import TodoService from './todoService.js';

class DOMController {
  constructor() {
    this.authService = new AuthService();
    this.todoService = new TodoService();

    this.todoContainer = document.querySelector('.todo-container');
    this.tagList = document.querySelector('.tag-list');
    this.todoForm = document.querySelector('.todo-form');
    this.todoFormContainer = document.querySelector('.form-container');
  }

  showToast(message = 'This is a toast notification!') {
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

  async updateTodoList({ query = '', tag = '', sortBy = '' } = {}) {
    const selectedTagEl = document.querySelector('.tag-list li.selected');
    let selectedTag =
      selectedTagEl && selectedTagEl.textContent !== 'All'
        ? selectedTagEl.textContent
        : '';

    const sortValue = document.querySelector('#sort-input').value;

    const searchQuery = document.querySelector('.search input').value;

    if (!query) {
      query = searchQuery;
    }
    if (!tag) {
      tag = selectedTag;
    }
    if (!sortBy) {
      sortBy = sortValue;
    }

    const todos = await this.todoService.getAllTodo(query, tag, sortBy);
    console.log(todos);

    this.todoContainer.innerHTML = '';

    todos.forEach((todo) => {
      const todoEl = document.createElement('div');
      const titleEl = document.createElement('input');
      const isImportantEl = document.createElement('div');
      const descriptionEl = document.createElement('textarea');
      const updateButton = document.createElement('button');
      const markCompleteButton = document.createElement('button');
      const deleteButton = document.createElement('button');

      todoEl.classList.toggle('todo');
      titleEl.classList.toggle('title');
      isImportantEl.classList.toggle('is-important');
      descriptionEl.classList.toggle('description');
      updateButton.classList.toggle('update');
      markCompleteButton.classList.toggle('mark-complete');
      deleteButton.classList.toggle('delete');

      todoEl.id = todo._id;
      titleEl.value = todo.title;
      titleEl.required = true;

      if (todo.description) {
        descriptionEl.value = todo.description;
      } else {
        descriptionEl.placeholder = 'Add description....';
      }

      isImportantEl.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

      if (todo.isImportant) {
        isImportantEl.querySelector('svg').classList.toggle('important');
      }

      if (todo.isCompleted) {
        todoEl.classList.toggle('completed');
      }

      updateButton.textContent = 'Update';
      markCompleteButton.textContent = todo.isCompleted
        ? 'Mark as Incomplete'
        : 'Mark as Completed';
      deleteButton.textContent = 'Delete';

      updateButton.addEventListener('click', async (e) => {
        const id = e.target.parentElement.id;
        const todoEl = e.target.parentElement;
        const title = todoEl.querySelector('.title').value;

        if (!title) return;

        const description = todoEl.querySelector('.description').value;

        await this.todoService.updateTodo(id, { title, description });
        await this.updateTodoList();
        this.showToast('Data updated');
      });

      isImportantEl.addEventListener('click', async (e) => {
        e.stopPropagation();

        const id = e.currentTarget.parentElement.id;
        const todoEl = e.currentTarget.parentElement;

        const isImportant = todoEl
          .querySelector('.is-important svg')
          .classList.contains('important');

        console.log(isImportant);
        await this.todoService.updateTodo(id, {
          isImportant: !isImportant,
        });
        await this.updateTodoList();
      });

      markCompleteButton.addEventListener('click', async (e) => {
        e.stopPropagation();

        e.target.textContent = 'Mark as Incomplete';

        const id = e.currentTarget.parentElement.id;
        const todoEl = e.currentTarget.parentElement;

        const isComplete = todoEl.classList.contains('completed');
        console.log(id, todoEl, isComplete);

        await this.todoService.updateTodo(id, {
          isCompleted: !isComplete,
        });
        todoEl.classList.toggle('completed');

        setTimeout(async () => await this.updateTodoList(), 400);
      });

      deleteButton.addEventListener('click', async (e) => {
        const id = e.currentTarget.parentElement.id;

        await this.todoService.deleteTodo(id);
        await this.updateTodoList();
        await this.updateTagList();
      });

      todoEl.appendChild(titleEl);
      todoEl.appendChild(isImportantEl);
      todoEl.appendChild(descriptionEl);
      todoEl.appendChild(updateButton);
      todoEl.appendChild(markCompleteButton);
      todoEl.appendChild(deleteButton);

      this.todoContainer.appendChild(todoEl);
    });
  }

  async updateTagList() {
    const tagHandler = async (e) => {
      document
        .querySelectorAll('.tag-list li')
        .forEach((list) => list.classList.remove('selected'));

      e.target.classList.add('selected');

      if (e.target.textContent === 'All') {
        await this.updateTodoList();
        return;
      }

      const tag = e.target.textContent;
      await this.updateTodoList({
        query: '',
        tag: tag,
        sortBy: '',
      });
    };

    this.tagList.innerHTML = '';

    const list = document.createElement('li');

    list.textContent = 'All';
    list.classList.toggle('selected');
    list.addEventListener('click', tagHandler);
    this.tagList.appendChild(list);

    const tags = await this.todoService.getAllTags();

    tags.forEach((tag) => {
      const list = document.createElement('li');

      list.textContent = tag;
      list.addEventListener('click', tagHandler);
      this.tagList.appendChild(list);
    });
  }

  addEventListenersHomePage() {
    const createButton = document.querySelector('.create');

    createButton.addEventListener('click', () =>
      this.todoFormContainer.classList.toggle('hidden')
    );

    const logoutButton = document.querySelector('.logout');

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.reload();
    });

    this.todoForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const titleInput = e.target.querySelector('input#title');
      const descriptionInput = e.target.querySelector('textarea#description');
      const isImportantCheckbox = e.target.querySelector('input#is-important');
      const tagsInput = e.target.querySelector('input#tags');
      const title = titleInput.value;
      const description =
        descriptionInput.value !== '' ? descriptionInput.value : null;
      const isImportant = isImportantCheckbox.checked;
      const tags = tagsInput.value.split(',');

      console.log(tags);
      console.log({ title, description, isImportant, tags });

      await this.todoService.createTodo({
        title,
        description,
        isImportant,
        tags,
      });
      this.showToast('Todo created');
      await this.updateTodoList();
      await this.updateTagList();

      titleInput.value = '';
      descriptionInput.value = '';
      isImportantCheckbox.checked = false;
      tagsInput.value = '';
    });

    const searchInput = document.querySelector('.search input');
    searchInput.addEventListener('input', async () => {
      await this.updateTodoList();
    });

    const sortInput = document.querySelector('#sort-input');
    sortInput.addEventListener('change', async (e) => {
      await this.updateTodoList({ sortBy: e.target.value });
    });
  }

  addEventListenersLoginPage() {
    const headingLogin = document.querySelector('.login h1 span#login');
    const headingSignup = document.querySelector('.login h1 span#signup');

    headingLogin.addEventListener('click', () => {
      headingSignup.classList.remove('selected');
      headingLogin.classList.add('selected');

      document.querySelector('.login form button').textContent = 'Login';
    });

    headingSignup.addEventListener('click', () => {
      headingLogin.classList.remove('selected');
      headingSignup.classList.add('selected');

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

      try {
        messageEl.className = 'message';

        if (formButton.textContent === 'Create Account') {
          await this.authService.signup(email, password);
          this.renderOtpPage(email);
        } else if (formButton.textContent === 'Login') {
          await this.authService.login(email, password);
          window.location.reload();
        }
      } catch (err) {
        console.log(err);
        messageEl.className = 'message';
        messageEl.classList.add('error');
        messageEl.textContent = err.message;
      }
    });
  }

  renderOtpPage(email) {
    const heading = document.querySelector('.login h1');
    const form = document.querySelector('.login form');
    console.log(form);
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
        await this.authService.verify(email, otp);
        message.textContent = 'OTP Verified. Please Login';
        setInterval(() => window.location.reload(), 3000);
      } catch (err) {
        message.textContent = err.response.data.message;
      }
    });

    resendLink.addEventListener('click', async () => {
      await this.authService.resendOtp(email);
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

  async renderHomePage() {
    const pages = document.querySelectorAll('body > div');

    pages.forEach((page) => page.classList.add('hidden'));

    if (localStorage.getItem('accessToken')) {
      document.querySelector('.app').classList.remove('hidden');

      await this.updateTodoList();
      await this.updateTagList();
      this.addEventListenersHomePage();
    } else {
      document.querySelector('.login').classList.remove('hidden');

      this.addEventListenersLoginPage();
    }
  }
}

export default DOMController;
