import User from '../../models/User.js';

export default function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400);
    throw new Error('Request body missing');
  }

  req.body = User.parse(req.body);
  next();
}
