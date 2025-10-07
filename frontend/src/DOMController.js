import { getAllTodo, createTodo, getAllTags } from './todoService.js';
class DOMController {
  constructor() {
    this.todoContainer = document.querySelector('.todo-container');
    this.tagList = document.querySelector('.tag-list');
    this.todoForm = document.querySelector('.todo-form');
  }

  async updateTodoList() {
    const todos = await getAllTodo();
    this.todoContainer.innerHTML = '';
    console.log(todos);
    todos.forEach((todo) => {
      const todoEl = document.createElement('div');
      const titleEl = document.createElement('input');
      const isImportantEl = document.createElement('div');
      const descriptionEl = document.createElement('textarea');
      const markCompleteButton = document.createElement('button');
      const deleteButton = document.createElement('button');

      todoEl.classList.toggle('todo');
      titleEl.classList.toggle('title');
      isImportantEl.classList.toggle('is-important');
      descriptionEl.classList.toggle('description');
      markCompleteButton.classList.toggle('mark-complete');
      deleteButton.classList.toggle('delete');

      todoEl.id = todo.id;
      titleEl.value = todo.title;
      titleEl.required = true;
      if (todo.description) descriptionEl.value = todo.description;
      else descriptionEl.placeholder = 'Add description....';
      isImportantEl.innerHTML = `<svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      if (todo.isImportant)
        isImportantEl.querySelector('svg').classList.toggle('important');
      markCompleteButton.textContent = 'Mark as Completed';
      deleteButton.textContent = 'Delete';

      todoEl.appendChild(titleEl);
      todoEl.appendChild(isImportantEl);
      todoEl.appendChild(descriptionEl);
      todoEl.appendChild(markCompleteButton);
      todoEl.appendChild(deleteButton);

      this.todoContainer.appendChild(todoEl);
    });
  }

  async updateTagList() {
    this.tagList.innerHTML = '';
    const list = document.createElement('li');
    list.textContent = 'All';
    this.tagList.appendChild(list);
    const tags = await getAllTags();
    tags.forEach((tag) => {
      const list = document.createElement('li');
      list.textContent = tag;
      this.tagList.appendChild(list);
    });
  }

  addEventListeners() {
    const createButton = document.querySelector('.create');
    createButton.addEventListener('click', () =>
      this.todoForm.classList.toggle('hidden')
    );

    this.todoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titleInput = e.target.querySelector('input#title');
      const descriptionInput = e.target.querySelector('input#description');
      const isImportantCheckbox = e.target.querySelector('input#is-important');
      const tagsInput = e.target.querySelector('input#tags');

      const title = titleInput.value;
      const description =
        descriptionInput.value !== '' ? descriptionInput.value : null;
      const isImportant = isImportantCheckbox.checked;
      const tags = tagsInput.value.split(' ');
      console.log({ title, description, isImportant, tags });
      await createTodo({ title, description, isImportant, tags });
      await this.updateTodoList();

      titleInput.value = '';
      descriptionInput.value = '';
      isImportantCheckbox.checked = false;
      tagsInput.value = '';
    });
  }
}

export default DOMController;
