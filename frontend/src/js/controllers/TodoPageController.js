import todoService from '../services/TodoService';
import authService from '../services/AuthService';
import MainController from './MainController';

class TodoPageController {
  static async updateTodoList({ query = '', tag = '', sortBy = '' } = {}) {
    const todoContainer = document.querySelector('.todo-container');
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

    const todos = await todoService.getAllTodo(query, tag, sortBy);
    console.log(todos);

    todoContainer.innerHTML = '';

    todos.forEach((todo) => {
      const todoEl = this.createTodoElement(todo);

      todoContainer.appendChild(todoEl);
    });
  }

  static async updateTagList() {
    const tagList = document.querySelector('.tag-list');

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

    tagList.innerHTML = '';

    const list = document.createElement('li');

    list.textContent = 'All';
    list.classList.toggle('selected');
    list.addEventListener('click', tagHandler);

    tagList.appendChild(list);

    const tags = await todoService.getAllTags();

    tags.forEach((tag) => {
      const list = document.createElement('li');

      list.textContent = tag;
      list.addEventListener('click', tagHandler);

      tagList.appendChild(list);
    });
  }

  static addEventListenersTodoPage() {
    const todoForm = document.querySelector('.todo-form');
    const todoFormContainer = document.querySelector('.form-container');
    const createButton = document.querySelector('.create');
    const logoutButton = document.querySelector('.logout');
    const profilePictrue = document.querySelector('nav .profile');

    createButton.addEventListener('click', () =>
      todoFormContainer.classList.toggle('hidden')
    );

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      window.location.reload();
    });

    profilePictrue.addEventListener(
      'click',
      () => (window.location.href = window.location.origin + '/profile')
    );

    todoForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const titleInput = e.target.querySelector('input#title');
      const descriptionInput = e.target.querySelector('textarea#description');
      const isImportantCheckbox = e.target.querySelector('input#is-important');
      const tagsInput = e.target.querySelector('input#tags');
      const file = e.target.querySelector('input#file');

      const title = titleInput.value;
      const description =
        descriptionInput.value !== '' ? descriptionInput.value : null;
      const isImportant = isImportantCheckbox.checked;
      const tags = tagsInput.value.split(',').filter((t) => t && t !== ' ');
      const attachment = file.files[0];

      await todoService.createTodo({
        title,
        description,
        isImportant,
        tags,
        attachment,
      });

      MainController.showToast('Todo created');

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

  static async renderTodoPage() {
    await TodoPageController.updateTodoList();
    await TodoPageController.updateTagList();
    TodoPageController.addEventListenersTodoPage();

    const user = await authService.getUserInfo();
    const profileName = user.name;

    const profileNameEl = document.querySelector('nav .name');
    const profile = document.querySelector('nav .profile');

    const profileImageEl = document.createElement('img');

    profileImageEl.classList.toggle('profile-image');

    profileNameEl.textContent = `Hello, ${profileName}`;
    profileImageEl.src = 'http://localhost:3001/uploads/' + user.profileImage;

    profile.appendChild(profileImageEl);
  }

  static createTodoElement(todo) {
    const todoEl = document.createElement('div');
    const titleEl = document.createElement('input');
    const isImportantEl = document.createElement('div');
    const descriptionEl = document.createElement('textarea');
    const updateButton = document.createElement('button');
    const markCompleteButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const fileInput = document.createElement('input');
    const fileContainer = document.createElement('div');
    const fileLogo = document.createElement('img');
    const fileList = document.createElement('div');

    todoEl.classList.toggle('todo');
    titleEl.classList.toggle('title');
    isImportantEl.classList.toggle('is-important');
    descriptionEl.classList.toggle('description');
    updateButton.classList.toggle('update');
    markCompleteButton.classList.toggle('mark-complete');
    deleteButton.classList.toggle('delete');
    fileInput.classList.toggle('file-input');
    fileContainer.classList.toggle('file-container');

    todoEl.id = todo._id;
    titleEl.value = todo.title;
    titleEl.required = true;
    fileInput.type = 'file';

    if (todo.description) {
      descriptionEl.value = todo.description;
    } else {
      descriptionEl.placeholder = 'Add description....';
    }

    isImportantEl.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

    fileLogo.src = 'src/assets/attachment-icon.svg';

    if (todo.isImportant) {
      isImportantEl.querySelector('svg').classList.toggle('important');
    }

    if (todo.isCompleted) {
      todoEl.classList.toggle('completed');
    }

    if (todo.attachment) {
      const fileLink = document.createElement('a');
      fileLink.href = 'http://localhost:3001/uploads/' + todo.attachment;
      fileLink.textContent = todo.attachment;
      console.log(fileLink.textContent);
      fileList.appendChild(fileLink);
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

      if (!title) {
        return;
      }

      const description = todoEl.querySelector('.description').value;

      await todoService.updateTodo(id, { title, description });
      await this.updateTodoList();

      MainController.showToast('Data updated');
    });

    isImportantEl.addEventListener('click', async (e) => {
      e.stopPropagation();

      const id = e.currentTarget.parentElement.id;
      const todoEl = e.currentTarget.parentElement;

      const isImportant = todoEl
        .querySelector('.is-important svg')
        .classList.contains('important');

      console.log(isImportant);
      await todoService.updateTodo(id, {
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

      await todoService.updateTodo(id, {
        isCompleted: !isComplete,
      });

      todoEl.classList.toggle('completed');
      fileContainer.classList.toggle('file-container');

      await this.updateTodoList();
    });

    deleteButton.addEventListener('click', async (e) => {
      const id = e.currentTarget.parentElement.id;

      await todoService.deleteTodo(id);
      await this.updateTodoList();
      await this.updateTagList();
    });

    todoEl.appendChild(titleEl);
    todoEl.appendChild(isImportantEl);
    todoEl.appendChild(descriptionEl);

    if (todo.attachment) {
      fileContainer.appendChild(fileLogo);
      fileContainer.appendChild(fileList);
      todoEl.appendChild(fileContainer);
    }

    todoEl.appendChild(updateButton);
    todoEl.appendChild(markCompleteButton);
    todoEl.appendChild(deleteButton);

    return todoEl;
  }
}

export default TodoPageController;
