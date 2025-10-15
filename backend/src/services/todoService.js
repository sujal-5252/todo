import Todo from '../models/Todo.js';

class TodoService {
  async fetchAllTodo(userId, query, tag, sortBy) {
    let searchQuery;
    if (tag && sortBy) {
      searchQuery = {
        $and: [
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ],
          },
          { tags: tag },
          { userId },
        ],
      };
    } else if (tag) {
      searchQuery = { tags: tag, userId };
    } else if (query) {
      searchQuery = {
        $and: [
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ],
          },
          { userId },
        ],
      };
    } else {
      searchQuery = { userId };
    }

    const sortQuery = sortBy
      ? { isCompleted: 1, [sortBy]: -1 }
      : { isCompleted: 1, createdAt: -1 };

    const todos = await Todo.find(searchQuery).sort(sortQuery);
    console.log(todos);

    return todos;
  }

  async createTodo({
    userId,
    title,
    description = null,
    isCompleted = false,
    isImportant = false,
    tags = [],
    attachment,
  }) {
    console.log(attachment);
    const todo = new Todo({
      userId,
      title,
      description,
      isCompleted,
      isImportant,
      tags,
      attachment,
    });

    await todo.save();
    return todo;
  }

  async updateTodo(
    userId,
    todoId,
    { title, description, isCompleted, isImportant, tags }
  ) {
    const newTodo = {};

    if (title) {
      newTodo.title = title;
    }

    if (description) {
      newTodo.description = description;
    }

    if (isCompleted !== undefined) {
      newTodo.isCompleted = isCompleted;
    }

    if (isImportant !== undefined) {
      newTodo.isImportant = isImportant;
    }

    if (tags !== undefined) {
      newTodo.tags = tags;
    }

    await Todo.findOneAndUpdate({ _id: todoId, userId }, newTodo);
  }

  async deleteTodo(id) {
    await Todo.deleteOne({ _id: id });
  }
}

export default TodoService;
