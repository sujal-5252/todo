// import db from '../db/db.js';
import { randomUUID } from 'node:crypto';

class TodoService {
  db = null;
  constructor(db) {
    this.db = db;
  }

  fetchAllTodo() {
    return this.db.data;
  }

  fetchTodoById(id) {
    const todo = this.db.data.find((todo) => todo.id === id);
    return todo || null;
  }

  async createTodo({
    id = randomUUID(),
    title,
    description = null,
    createdAt = new Date(),
    isCompleted = false,
    isImportant = false,
    tags = [],
    updatedAt = null,
  }) {
    if (!title) throw new Error('Title must be provided');
    if (!description) description = null;
    if (isCompleted === undefined) isCompleted = false;
    if (isImportant === undefined) isImportant = false;
    if (tags === undefined) tags = [];

    const newTodo = {
      id,
      title,
      description,
      createdAt,
      isCompleted,
      isImportant,
      tags,
      updatedAt,
    };

    this.db.data.push(newTodo);
    await this.db.save();
    return newTodo;
  }

  async updateTodo(
    id,
    {
      title,
      description,
      createdAt,
      isCompleted,
      isImportant,
      tags,
      updatedAt = new Date(),
    }
  ) {
    const idx = this.db.data.findIndex((data) => data.id === id);

    if (idx === -1) {
      throw new Error(`Todo with id ${id} does not exist`);
    }

    this.db.data[idx] = {
      id,
      title,
      description,
      createdAt,
      isCompleted,
      isImportant,
      tags,
      updatedAt,
    };

    await this.db.save();
  }

  async deleteTodo(id) {
    this.db.data = this.db.data.filter((data) => data.id !== id);
    await this.db.save();
  }
}

export default TodoService;
