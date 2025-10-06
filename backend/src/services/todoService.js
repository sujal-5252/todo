import db from "../db/db.js";
import { randomUUID } from "node:crypto";

class TodoService {
  db = null;
  constructor(db) {
    this.db = db;
  }

  fetchAllTodo() {
    return db.data;
  }

  fetchTodoById(id) {
    const todo = db.data.find((todo) => todo.id === id);
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
    if (!title) throw new Error("Title must be provided");
    const newTodo = { id, title, description, createdAt, isCompleted, isImportant, tags, updatedAt };
    db.data.push(newTodo);
    await db.save();
    return newTodo;
  }

  async updateTodo(id, { title, description, createdAt, isCompleted, isImportant, tags, updatedAt = new Date() }) {
    const idx = db.data.findIndex((data) => data.id === id);
    if (idx != -1) db.data[idx] = { id, title, description, createdAt, isCompleted, isImportant, tags, updatedAt };
    else throw new Error(`Todo with id ${id} does not exist`);
    await db.save();
  }

  async deleteTodo(id) {
    db.data.filter((data) => data.id !== id);
    await db.save();
  }
}

export default TodoService;
