import Express from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import todoRouter from './routers/todoRouter.js';
import mongoose from 'mongoose';
import authRouter from './routers/authRouter.js';
import logger from './middlewares/logger.js';
import isAuthenticated from './middlewares/auth/isAuthenticated.js';

const app = Express();
const port = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Databse connected');
} catch (err) {
  console.log(err);
}

app.use(cors());
app.use(Express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ status: 'running' });
});

app.use('/auth', authRouter);
app.use('/api/todo', isAuthenticated, todoRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
