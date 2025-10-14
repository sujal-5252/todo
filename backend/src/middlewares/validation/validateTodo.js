import { Todo, TodoUpdate } from '../../validators/Todo.js';

export default function validateTodo(type) {
  return async (req, res, next) => {
    try {
      if (!req.body) {
        throw new Error('Request body missing');
      }

      if (type === 'create') {
        req.body = await Todo.validate(req.body);
      } else if (type === 'update') {
        req.body = await TodoUpdate.validate(req.body);
      }

      next();
    } catch (err) {
      res.status(500);
      next(err);
    }
  };
}
