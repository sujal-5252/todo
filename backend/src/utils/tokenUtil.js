import jwt from 'jsonwebtoken';

function generateTokenFromUserId(userId, type = 'access') {
  let options;
  if (!type || type === 'access') {
    options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRY };
  } else if (type === 'refresh') {
    options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRY };
  }
  console.log({ userId });
  const token = jwt.sign({ userId }, process.env.SECRET, options);
  return token;
}

export { generateTokenFromUserId };
