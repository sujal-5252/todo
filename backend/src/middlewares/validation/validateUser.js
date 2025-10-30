import userValidator from '../../validators/userValidator.js';

export default async function validateUser(req, res, next) {
  try {
    if (!req.body) {
      res.status(400);
      throw new Error('Request body missing');
    }

    req.body = await userValidator.validate(req.body);
    next();
  } catch (err) {
    res.status(400);
    next(err);
  }
}
