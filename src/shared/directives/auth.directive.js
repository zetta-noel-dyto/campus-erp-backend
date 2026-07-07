import { defaultFieldResolver, GraphQLError } from 'graphql';
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';

const typeDefs = `#graphql 
directive @auth(requires: Role = admin) on FIELD_DEFINITION

enum Role {
   admin
   teacher 
}
`;

const authDirectiveTransformer = (schema, directiveName) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, directiveName);
      if (!authDirective) return fieldConfig;

      const { requires } = authDirective[0];
      const resolve = fieldConfig.resolve || defaultFieldResolver;
      fieldConfig.resolve = async (source, args, context, info) => {
        if (!context.user) {
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              status: 401,
            },
          });
        }

        const hasPermission = (() => {
          const role = context.user.role;
          if (requires === 'admin') return role === 'admin';
          if (required === 'teacher') return role === 'teacher' || role === 'admin';

          return false;
        })();
        if (!hasPermission) {
          throw new GraphQLError('Forbidden', {
            extensions: {
              code: 'FORBIDDEN',
              status: 403,
            },
          });
        }

        return resolve(source, args, context, info);
      };

      return fieldConfig;
    },
  });
};

export { authDirectiveTransformer, typeDefs };
