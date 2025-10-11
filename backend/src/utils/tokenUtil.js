import jwt from 'jsonwebtoken';

function generateTokenFromUserId(userId, type) {
  let options;
  if (!type || type === 'access') {
    options = { expiresIn: '20m' };
  } else if (type === 'refresh') {
    options = { expiresIn: '30d' };
  }
  console.log({ userId });
  const token = jwt.sign({ userId }, process.env.SECRET, options);
  return token;
}

export { generateTokenFromUserId };
