import { object, string, boolean, array } from 'yup';

const Todo = object({
  title: string().min(1).required(),
  description: string().nullable(),
  isCompleted: boolean(),
  isImportant: boolean(),
  tags: array().of(string()),
});

const TodoUpdate = Todo.concat(
  object({
    title: string().min(1),
  })
);

export { Todo, TodoUpdate };
