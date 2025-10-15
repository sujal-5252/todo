import Todo from '../models/Todo.js';

export default async function checkIdExist(req, res, next) {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    if (!id) {
      res.status(400);
      throw new Error('ID must not be empty');
    }

    const result = await Todo.findOne({ _id: id, userId });
    console.log(result);

    if (!result) {
      res.status(404);
      throw new Error('Todo with provided ID not found');
    }

    next();
  } catch (err) {
    next(err);
  }
}
