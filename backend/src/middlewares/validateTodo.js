import * as z from 'zod';

const Todo = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  createdAt: z.date().optional().default(new Date()),
  isCompleted: z.boolean().optional().default(false),
  isImportant: z.boolean().optional().default(false),
  updatedAt: z.date().optional().nullable(),
});
export default function validateTodo(req, res, next) {
  if (!req.body) {
    res.status(400);
    throw new Error('Request body missing');
  }
  Todo.parse(req.body);
  next();
}
