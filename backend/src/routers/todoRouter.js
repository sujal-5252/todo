import Express from 'express';
import multer from 'multer';
import TodoService from '../services/todoService.js';
import TodoController from '../controllers/TodoController.js';
import validateTodo from '../middlewares/validation/validateTodo.js';
import checkIdExist from '../middlewares/checkTodoExist.js';

const todoRouter = Express.Router();
const todoService = new TodoService();
const todoController = new TodoController(todoService);

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

todoRouter.get('/', todoController.getAllTodo);
todoRouter.post(
  '/',
  upload.single('attachment'),
  validateTodo('create'),
  todoController.createTodo
);
todoRouter.put(
  '/:id',
  checkIdExist,
  validateTodo('edit'),
  todoController.updateTodo
);
todoRouter.delete('/:id', checkIdExist, todoController.deleteTodo);

export default todoRouter;
