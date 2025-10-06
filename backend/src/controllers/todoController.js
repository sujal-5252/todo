import TodoService from "../services/todoService.js";
import db from "../db/db.js";

const todoService = new TodoService(db);

async function getAllTodo(req, res) {
  const todos = todoService.fetchAllTodo();
  res.json(todos);
}

async function getTodoById(req, res) {
  const todo = todoService.fetchTodoById(req.params.id);
  if (!todo) {
    res.status(404);
    throw new Error(`Todo with id ${req.params.id} not found`);
  }
  res.json(todo);
}

export { getAllTodo, getTodoById };
