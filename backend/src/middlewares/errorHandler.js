import * as z from 'zod';

export default function errorHandler(err, _req, res, _next) {
  console.log(err);

  if (res.statusCode < 400) {
    res.status(500);
  }

  if (err instanceof z.ZodError) {
    console.log(err.issues);
    res.json({
      success: false,
      message: err.issues
        .map((issue) => issue.path[0] + ': ' + issue.message)
        .join(', '),
    });
  } else {
    res.json({ success: false, message: err.message });
  }
}
