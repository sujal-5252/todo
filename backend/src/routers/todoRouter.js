import Express from "express";
import { getAllTodo, getTodoById } from "../controllers/todoController.js";

const todoRouter = Express.Router();

todoRouter.get("/", getAllTodo);
todoRouter.get("/:id", getTodoById);

export default todoRouter;
