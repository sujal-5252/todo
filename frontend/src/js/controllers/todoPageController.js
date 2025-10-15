import TodoPageHandlers from '../eventHandlers/todoPageHandler';

class TodoPageController {
  todoPageHandlers = new TodoPageHandlers();

  static renderTodoPage() {
    const body = document.querySelector(body);

    const app = document.createElement('div');
    const nav = this.createNav();
    const sidebar = this.createSidebar();
    const todoForm = this.createTodoForm();
    const mainContent = this.createMainContent();
  }

  createNav(profileName = 'Random Profile') {
    const nav = document.createElement('nav');
    const logoContainer = document.createElement('div');
    const logoTextEl = document.createElement('h1');
    const container = document.createElement('div');
    const createButton = document.createElement('button');
    const dropdownContainer = document.createElement('div');
    const profilePicture = document.createElement('div');
    const menuContainer = document.createElement('div');
    const profileNameEl = document.createElement('div');
    const logoutButton = document.createElement('button');

    logoContainer.classList.add('logo');
    container.classList.add('container');
    createButton.classList.add('create');
    dropdownContainer.classList.add('dropdown-menu');
    profilePicture.classList.add('menu-btn', 'profile');
    menuContainer.classList.add('menu-content');
    profileName.classList.add('name');
    profileName.classList.add('logout');

    logoTextEl.textContent = 'TODOS';
    createButton.textContent = 'Create Todo';
    profileNameEl.textContent = profileName;
    logoutButton.textContent = 'Log Out';

    createButton.addEventListener(
      'click',
      this.todoPageHandlers.createButtonHandler
    );

    logoutButton.addEventListener(
      'click',
      this.todoPageHandlers.logoutButtonHandler
    );

    menuContainer.appendChild(profileName);
    menuContainer.appendChild(logoutButton);

    dropdownContainer.appendChild(profilePicture);
    dropdownContainer.appendChild(menuContainer);

    container.appendChild(createButton);
    container.appendChild(dropdownContainer);

    logoContainer.appendChild(logoTextEl);

    nav.appendChild(logoContainer);
    nav.appendChild(container);

    return nav;
  }

  createSidebar() {
    const sidebar = document.createElement('div');
    const heading = document.createElement('h2');
    const tagList = document.createElement('ul');

    sidebar.classList.add('sidebar');
    tagList.classList.add('tag-list');

    heading.textContent = 'Tags';

    sidebar.appendChild(heading);
    sidebar.appendChild(tagList);

    return sidebar;
  }

  createTodoForm() {
    const formContainer = document.createElement('div');
    const form = document.createElement('form');

    const titleInputContainer = document.createElement('div');
    const titleLabel = document.createElement('label');
    const titleInput = document.createElement('input');

    const descriptionInputContainer = document.createElement('div');
    const descriptionLabel = document.createElement('label');
    const descriptionInput = document.createElement('textarea');

    const fileInputContainer = document.createElement('div');
    const fileLabel = document.createElement('label');
    const fileInput = document.createElement('input');

    const tagsInputContainer = document.createElement('div');
    const tagsLabel = document.createElement('label');
    const tagsInput = document.createElement('input');

    const checkboxInputContainer = document.createElement('div');
    const isImportantCheckbox = document.createElement('input');
    const isImportantLabel = document.createElement('label');

    const submitButton = document.createElement('submit');

    formContainer.classList.add('form-container');
    form.classList.classList.add('form');
    titleInputContainer.classList.add('input-container');
    descriptionInputContainer.classList.add('input-container');
    fileInputContainer.classList.add('input-container');
    tagsInputContainer.classList.add('input-container');
    checkboxInputContainer.classList.add('checkbox-container');

    titleLabel.textContent = 'Title:';
    titleLabel.for = 'title';

    titleInput.type = 'text';
    titleInput.id = 'title';
    titleInput.required = true;
    titleInput.placeholder = 'Enter title...';

    descriptionLabel.textContent = 'Description:';
    descriptionLabel.for = 'description';

    descriptionInput.id = 'description';
    descriptionInput.placeholder = 'Enter description...';

    fileLabel.textContent = 'File:';
    fileLabel.for = 'file';

    fileInput.type = 'file';
    fileInput.id = 'file';

    tagsLabel.textContent = 'Tags:';
    tagsLabel.for = 'tags';

    tagsInput.type = 'text';
    tagsInput.id = 'tags';
    tagsInput.placeholder = 'Enter tags(comma separated)...';

    isImportantLabel.textContent = 'Important';
    isImportantLabel.for = 'is-important';

    isImportantCheckbox.type = 'checkbox';
    isImportantCheckbox.id = 'is-important';

    submitButton.textContent = 'Submit';
    submitButton.type = 'submit';

    form.addEventListener('submit', TodoPageHandlers.createTodoFormHandler);

    titleInputContainer.appendChild(titleLabel);
    titleInputContainer.appendChild(titleInput);
    descriptionInputContainer.appendChild(descriptionLabel);
    descriptionInputContainer.appendChild(descriptionInput);
    fileInputContainer.appendChild(fileLabel);
    fileInputContainer.appendChild(fileInput);
    tagsInputContainer.appendChild(tagsLabel);
    tagsInputContainer.appendChild(tagsInput);
    checkboxInputContainer.appendChild(isImportantLabel);
    checkboxInputContainer.appendChild(isImportantCheckbox);

    form.appendChild(titleInputContainer);
    form.appendChild(descriptionInputContainer);
    form.appendChild(fileInputContainer);
    form.appendChild(tagsInputContainer);
    form.appendChild(checkboxInputContainer);
    form.appendChild(submitButton);

    formContainer.appendChild(form);

    return formContainer;
  }
}
