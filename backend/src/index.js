import Express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import todoRouter from "./routers/todoRouter.js";

const app = Express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(Express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.use("/api/todo", todoRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
