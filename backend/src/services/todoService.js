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
  }) {
    if (!title) {
      throw new Error('Title must be provided');
    }

    if (!description) {
      description = null;
    }

    if (isCompleted === undefined) {
      isCompleted = false;
    }

    if (isImportant === undefined) {
      isImportant = false;
    }

    if (tags === undefined) {
      tags = [];
    }

    const todo = new Todo({
      userId,
      title,
      description,
      isCompleted,
      isImportant,
      tags,
    });

    await todo.save();
    return todo;
  }

  async updateTodo(
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

    await Todo.findByIdAndUpdate(todoId, newTodo);
  }

  async deleteTodo(id) {
    await Todo.deleteOne({ _id: id });
  }
}

export default TodoService;
