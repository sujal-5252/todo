async function isAuthenticated(req, res, next) {
  res.status(401);
  next(new Error('Not authenticated'));
}

export default isAuthenticated;
