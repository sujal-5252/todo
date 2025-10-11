import * as z from 'zod';

const Todo = z.object({
  title: z.string().nonempty(),
  description: z.string().optional().nullable(),
  isCompleted: z.boolean().optional(),
  isImportant: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

const TodoUpdate = Todo.extend({
  title: z.string().nonempty().optional(),
});

export { Todo, TodoUpdate };
