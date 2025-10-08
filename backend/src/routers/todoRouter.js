import Express from 'express';
import TodoService from '../services/todoService.js';
import TodoController from '../controllers/todoController.js';
import validateTodo from '../middlewares/validateTodo.js';
import checkIdExist from '../middlewares/checkTodoExist.js';

const todoRouter = Express.Router();
const todoService = new TodoService();
const todoController = new TodoController(todoService);

todoRouter.get('/', todoController.getAllTodo);
todoRouter.post('/', validateTodo, todoController.createTodo);
todoRouter.put('/:id', checkIdExist, validateTodo, todoController.updateTodo);
todoRouter.delete('/:id', checkIdExist, todoController.deleteTodo);

export default todoRouter;
