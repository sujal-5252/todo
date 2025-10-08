import { Todo } from '../validators/Todo.js';

export default function validateTodo(req, res, next) {
  if (!req.body) {
    res.status(400);
    throw new Error('Request body missing');
  }
  req.body = Todo.parse(req.body);
  next();
}
