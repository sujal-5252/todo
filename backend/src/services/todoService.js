import Todo from '../models/Todo.js';

class TodoService {
  async fetchAllTodo() {
    const todos = await Todo.find({});
    console.log(todos);
    return todos;
  }

  async createTodo({
    title,
    description = null,
    isCompleted = false,
    isImportant = false,
    tags = [],
  }) {
    if (!title) throw new Error('Title must be provided');
    if (!description) description = null;
    if (isCompleted === undefined) isCompleted = false;
    if (isImportant === undefined) isImportant = false;
    if (tags === undefined) tags = [];
    const todo = new Todo({
      title,
      description,
      isCompleted,
      isImportant,
      tags,
    });
    await todo.save();
    return todo;
  }

  async updateTodo(id, { title, description, isCompleted, isImportant, tags }) {
    const newTodo = {};
    if (title) newTodo.title = title;

    if (description) newTodo.description = description;

    if (isCompleted !== undefined) newTodo.isCompleted = isCompleted;
    if (isImportant !== undefined) newTodo.isImportant = isImportant;
    if (tags !== undefined) newTodo.tags = tags;

    await Todo.findByIdAndUpdate(id, newTodo);
  }

  async deleteTodo(id) {
    await Todo.deleteOne({ _id: id });
  }
}

export default TodoService;
