import { object, string, boolean, mixed } from 'yup';

const todoValidator = object({
  title: string().min(1).required(),
  description: string().nullable(),
  isCompleted: boolean(),
  isImportant: boolean(),
  tags: string(),
  attachment: mixed().nullable(),
});

const todoUpdateValidator = todoValidator.concat(
  object({
    title: string().min(1),
  })
);

export { todoValidator, todoUpdateValidator };
