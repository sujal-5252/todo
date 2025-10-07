import Express from 'express';
import {
  createTodo,
  getAllTodo,
  getTodoById,
} from '../controllers/todoController.js';
import validateTodo from '../middlewares/validateTodo.js';

const todoRouter = Express.Router();

todoRouter.get('/', getAllTodo);
todoRouter.get('/:id', getTodoById);
todoRouter.post('/', validateTodo, createTodo);

export default todoRouter;
