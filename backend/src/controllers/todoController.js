import TodoService from '../services/todoService.js';
import db from '../db/db.js';

const todoService = new TodoService(db);

async function getAllTodo(_req, res) {
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

async function createTodo(req, res) {
  const newTodo = req.body;
  console.log(req.body);

  const result = await todoService.createTodo(newTodo);
  res.send(result);
}

export { getAllTodo, getTodoById, createTodo };
