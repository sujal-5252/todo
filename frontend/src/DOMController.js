import {
  getAllTodo,
  getAllTags,
  updateTodo,
  createTodo,
  deleteTodo,
  getTodoByTag,
  getTodoByQuery,
} from './todoService.js';

class DOMController {
  constructor() {
    this.todoContainer = document.querySelector('.todo-container');
    this.tagList = document.querySelector('.tag-list');
    this.todoForm = document.querySelector('.todo-form');
  }

  showToast(message = 'This is a toast notification!') {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show the toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100); // Small delay for CSS transition

    // Hide and remove the toast after a few seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 500); // Wait for fade-out transition
    }, 3000); // Display time in milliseconds (e.g., 3 seconds)
  }

  async updateTodoList(notes) {
    const todos = notes ? notes : await getAllTodo();
    this.todoContainer.innerHTML = '';
    console.log(todos);
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
      isImportantEl.innerHTML = `<svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      if (todo.isImportant) {
        isImportantEl.querySelector('svg').classList.toggle('important');
      }
      if (todo.isCompleted) {
        todoEl.classList.toggle('completed');
      }
      updateButton.textContent = 'Update';
      markCompleteButton.textContent = 'Mark as Completed';
      deleteButton.textContent = 'Delete';

      updateButton.addEventListener('click', async (e) => {
        const id = e.target.parentElement.id;
        const todoEl = e.target.parentElement;
        const title = todoEl.querySelector('.title').value;
        if (!title) return;
        const description = todoEl.querySelector('.description').value;
        await updateTodo(id, { title, description });
        await this.updateTodoList();
        this.showToast('Data updated');
      });

      isImportantEl.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.parentElement.id;
        const todoEl = e.currentTarget.parentElement;
        const title = todoEl.querySelector('.title').value;
        if (!title) return;
        const isImportant = todoEl
          .querySelector('.is-important svg')
          .classList.contains('important');
        console.log(isImportant);
        await updateTodo(id, { title, isImportant: !isImportant });
        await this.updateTodoList();
      });

      markCompleteButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.parentElement.id;
        const todoEl = e.currentTarget.parentElement;
        const title = todoEl.querySelector('.title').value;
        if (!title) return;
        const isComplete = todoEl.classList.contains('completed');
        console.log(id, todoEl, title, isComplete);
        await updateTodo(id, { title, isCompleted: !isComplete });
        todoEl.classList.toggle('completed');
        await this.updateTodoList();
      });

      deleteButton.addEventListener('click', async (e) => {
        const id = e.currentTarget.parentElement.id;
        await deleteTodo(id);
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
        await this.updateTodoList(todos);
        return;
      }
      const todos = await getTodoByTag(e.target.textContent);
      await this.updateTodoList(todos);
    };
    this.tagList.innerHTML = '';
    const list = document.createElement('li');
    list.textContent = 'All';
    list.classList.toggle('selected');
    list.addEventListener('click', tagHandler);
    this.tagList.appendChild(list);
    const tags = await getAllTags();
    tags.forEach((tag) => {
      const list = document.createElement('li');
      list.textContent = tag;

      list.addEventListener('click', tagHandler);
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
      console.log(tags);
      console.log({ title, description, isImportant, tags });
      await createTodo({ title, description, isImportant, tags });
      await this.updateTodoList();
      await this.updateTagList();

      titleInput.value = '';
      descriptionInput.value = '';
      isImportantCheckbox.checked = false;
      tagsInput.value = '';
    });

    const searchInput = document.querySelector('.search input');
    searchInput.addEventListener('input', async (e) => {
      await this.updateTagList();
      if (!e.target.value) await this.updateTodoList();
      await this.updateTagList();
      const query = e.target.value;
      const todos = await getTodoByQuery(query);
      await this.updateTodoList(todos);
    });
  }
}

export default DOMController;
