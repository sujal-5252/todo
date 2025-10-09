import * as z from 'zod';

export default function errorHandler(err, _req, res, _next) {
  console.log('Working');
  if (res.status <= 200) {
    res.status(500);
  }

  if (err instanceof z.ZodError) {
    res.json({ message: z.prettifyError(err) });
  } else {
    res.json({ message: err.message });
  }
}
