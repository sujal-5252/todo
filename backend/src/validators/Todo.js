import { object, string, boolean, mixed } from 'yup';

const Todo = object({
  title: string().min(1).required(),
  description: string().nullable(),
  isCompleted: boolean(),
  isImportant: boolean(),
  tags: string(),
  attachment: mixed().nullable(),
});

const TodoUpdate = Todo.concat(
  object({
    title: string().min(1),
  })
);

export { Todo, TodoUpdate };
