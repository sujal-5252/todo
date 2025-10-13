class TodoController {
  constructor(todoService) {
    console.log(todoService);
    this.todoService = todoService;
  }
  getAllTodo = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { query, tag, sortBy } = req.query;
      const todos = await this.todoService.fetchAllTodo(
        userId,
        query,
        tag,
        sortBy
      );

      res.json({ success: true, result: todos });
    } catch (err) {
      next(err);
    }
  };

  createTodo = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const newTodo = { userId, ...req.body };
      console.log(req.body);

      const result = await this.todoService.createTodo(newTodo);

      res.send({ success: true, result: result });
    } catch (err) {
      next(err);
    }
  };

  updateTodo = async (req, res, next) => {
    try {
      const newTodo = req.body;

      await this.todoService.updateTodo(req.params.id, newTodo);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  deleteTodo = async (req, res, next) => {
    try {
      const id = req.params.id;

      await this.todoService.deleteTodo(id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };
}

export default TodoController;
