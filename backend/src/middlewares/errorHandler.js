import { ValidationError } from 'yup';

export default function errorHandler(err, _req, res, _next) {
  console.log(err);

  if (res.statusCode < 400) {
    res.status(500);
  }

  if (err instanceof ValidationError) {
    console.log(err);
    res.json({
      success: false,
      message: err.errors.join(', '),
    });
  } else {
    res.json({ success: false, message: err.message });
  }
}
