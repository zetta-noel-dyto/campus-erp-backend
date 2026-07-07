import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../../../core/error.js';
import { jwt_secret } from '../../../core/config.js';
import { UserModel as Users } from '../user/user.model.js';

const LoginHelper = async (input) => {
  const user = await Users.findOne({ email: input.email }).lean();
  if (!user) {
    throw new AppError('Invalid email or password', 'UNAUTHORIZED', 401);
  }

  const comparePassword = await bcrypt.compare(input.password, user.password);
  if (!comparePassword) {
    throw new AppError('Invalid email or password', 'UNAUTHORIZED', 401);
  }

  return jwt.sign({ userId: user._id, role: user.role }, jwt_secret, { expiresIn: '8h' });
};

export { LoginHelper };
