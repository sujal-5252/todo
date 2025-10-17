import {
  todoValidator,
  todoUpdateValidator,
} from '../../validators/todoValidator.js';

export default function validateTodo(type) {
  return async (req, res, next) => {
    try {
      if (!req.body) {
        throw new Error('Request body missing');
      }

      if (type === 'create') {
        req.body = await todoValidator.validate(req.body);
      } else if (type === 'update') {
        req.body = await todoUpdateValidator.validate(req.body);
      }

      next();
    } catch (err) {
      res.status(500);
      next(err);
    }
  };
}
