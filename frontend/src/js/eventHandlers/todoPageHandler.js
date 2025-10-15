class TodoPageHandlers {
  static createButtonHandler = () => {
    const todoFormContainer = document.querySelector('.form-container');
    todoFormContainer.classList.toggle('hidden');
  };

  static logoutButtonHandler = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    window.location.reload();
  };

  static createTodoFormHandler = async (e) => {
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
    const tags = tagsInput.value.split(',');
    const attachment = file.files[0];

    await TodoService.createTodo({
      title,
      description,
      isImportant,
      tags,
      attachment,
    });

    DomController.showToast('Todo created');
    await TodoPageController.updateTodoList();
    await TodoPageController.updateTagList();

    titleInput.value = '';
    descriptionInput.value = '';
    isImportantCheckbox.checked = false;
    tagsInput.value = '';
  };
}

export default TodoPageHandlers;
