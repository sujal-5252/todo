class TodoController {
  constructor(todoService) {
    console.log(todoService);
    this.todoService = todoService;
  }
  getAllTodo = async (_req, res, next) => {
    try {
      const todos = await this.todoService.fetchAllTodo();
      res.json(todos);
    } catch (err) {
      next(err);
    }
  };
  // async getTodoById(req, res, next) {
  //   try {
  //     const todo = this.todoService.fetchTodoById(req.params.id);
  //     if (!todo) {
  //       res.status(404);
  //       throw new Error(`Todo with id ${req.params.id} not found`);
  //     }
  //     res.json(todo);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  createTodo = async (req, res, next) => {
    try {
      const newTodo = req.body;
      console.log(req.body);

      const result = await this.todoService.createTodo(newTodo);
      res.send(result);
    } catch (err) {
      next(err);
    }
  };

  updateTodo = async (req, res, next) => {
    try {
      const newTodo = req.body;
      await this.todoService.updateTodo(req.params.id, newTodo);
      res.end();
    } catch (err) {
      next(err);
    }
  };

  deleteTodo = async (req, res, next) => {
    try {
      const id = req.params.id;
      await this.todoService.deleteTodo(id);
      res.end();
    } catch (err) {
      next(err);
    }
  };
}

export default TodoController;
