import User from '../../validators/User.js';

export default async function validateUser(req, res, next) {
  try {
    if (!req.body) {
      res.status(400);
      throw new Error('Request body missing');
    }

    req.body = await User.validate(req.body);
    next();
  } catch (err) {
    res.status(400);
    next(err);
  }
}
