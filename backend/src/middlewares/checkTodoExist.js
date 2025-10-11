import Todo from '../models/Todo.js';

export default function checkIdExist(req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error('ID must not be empty');
  }

  const result = Todo.find({ _id: id });

  if (!result) {
    res.status(404);
    throw new Error('Todo with provided ID not found');
  }

  next();
}
