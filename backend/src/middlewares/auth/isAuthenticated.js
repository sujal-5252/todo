import jwt from 'jsonwebtoken';
import UserService from '../../services/userService.js';

async function isAuthenticated(req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.status(400);
      return next(new Error('Invalid Authorization Header'));
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(400);
      return next(new Error('Invalid Authorization Header'));
    }

    const payload = jwt.verify(token, process.env.SECRET);
    const user = await new UserService().getUserById(payload.userId);

    if (!user) {
      return next(new Error('User with given ID not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
    next(err);
  }
}

export default isAuthenticated;
