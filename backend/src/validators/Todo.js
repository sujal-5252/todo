import * as z from 'zod';
const Todo = z.object({
  title: z.string().nonempty(),
  description: z.string().optional().nullable(),
  isCompleted: z.boolean().optional(),
  isImportant: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export { Todo };
