import { LoginHelper } from './auth.helper.js';
import { LoginSchema } from './auth.validator.js';
import { NormalizeGqlError } from '../../../core/error.js';
import { ValidateInput } from '../../../shared/validators/validators.input.js';

const Login = async (_, { input }) => {
  try {
    const data = ValidateInput(LoginSchema, input);
    return await LoginHelper(data);
  } catch (error) {
    throw NormalizeGqlError(error);
  }
};

const resolver = {
  Mutation: {
    Login,
  },
};

export { resolver };
