import { Todo, TodoUpdate } from '../../validators/Todo.js';

export default function validateTodo(type) {
  return (req, res, next) => {
    try {
      if (!req.body) {
        throw new Error('Request body missing');
      }

      if (type === 'create') {
        req.body = Todo.parse(req.body);
      } else if (type === 'update') {
        req.body = TodoUpdate.parse(req.body);
      }

      next();
    } catch (err) {
      res.status(500);
      next(err);
    }
  };
}
