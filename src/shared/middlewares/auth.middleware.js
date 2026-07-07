import jwt from 'jsonwebtoken';
import { jwt_secret } from '../../core/config.js';

const AuthMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = undefined;
    return next();
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.user = decoded;
  } catch (error) {
    req.user = undefined;
  }

  next();
};

export { AuthMiddleware };
