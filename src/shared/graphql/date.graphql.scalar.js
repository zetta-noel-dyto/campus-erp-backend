// *************** IMPORT LIBRARY ***************
import { GraphQLScalarType, Kind } from 'graphql';

// *************** CUSTOM SCALAR ***************
/**
 * Custom GraphQL scalar for handling Date values consistently across API boundaries.
 * Converts between ISO string format and JavaScript Date objects.
 */
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom date type',
  serialize: (value) => new Date(value).toISOString(),
  parseValue: (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;

    return date;
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) return null;
    const date = new Date(ast.value);
    if (isNaN(date.getTime())) return null;

    return date;
  },
});

// *************** EXPORT MODULE ***************
export { DateScalar };
