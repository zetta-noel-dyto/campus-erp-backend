// *************** IMPORT LIBRARY ***************
import { defaultFieldResolver, GraphQLError } from 'graphql';
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';

// *************** TYPE DEFINITIONS ***************
// GraphQL directive definitions used to apply role-based authorization rules on schema fields.
const typeDefs = `#graphql 
directive @auth(requires: Role = admin) on FIELD_DEFINITION

enum Role {
   admin
   teacher 
}
`;

// Transforms GraphQL schema fields by injecting authentication and authorization checks.
/**
 * Adds authentication and role-based authorization logic to fields using the specified GraphQL directive.
 * @param {Object} schema - GraphQL schema that contains fields to be transformed.
 * @param {string} directiveName - Name of the directive used to identify protected fields.
 * @returns {Object} Transformed GraphQL schema with authorization middleware applied.
 */
const authDirectiveTransformer = (schema, directiveName) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // *************** START: Retrieve auth directive configuration ***************
      // Check whether the current field contains the required authorization directive.
      const authDirective = getDirective(schema, fieldConfig, directiveName);
      if (!authDirective) return fieldConfig;

      // Extract the required role configuration from the directive definition.
      const { requires } = authDirective[0];

      // Preserve existing resolver behavior while adding authorization checks.
      const resolve = fieldConfig.resolve || defaultFieldResolver;

      // *************** END: Retrieve auth directive configuration ***************

      // *************** START: Apply authentication and authorization middleware ***************
      // Wrap resolver execution with permission validation before allowing field access.
      fieldConfig.resolve = async (source, args, context, info) => {
        // *************** Validate user authentication state ***************
        // Prevent access when request context does not contain an authenticated user.
        if (!context.user) {
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              status: 401,
            },
          });
        }

        // *************** Validate user role permission ***************
        // Check whether the authenticated user's role matches the required directive role.
        const hasPermission = (() => {
          const role = context.user.role;

          if (requires === 'admin') return role === 'admin';
          if (requires === 'teacher') return role === 'teacher' || role === 'admin';

          return false;
        })();

        // Reject requests where the authenticated user does not have sufficient permission.
        if (!hasPermission) {
          throw new GraphQLError('Forbidden', {
            extensions: {
              code: 'FORBIDDEN',
              status: 403,
            },
          });
        }

        // Execute original resolver after successful authentication and authorization checks.
        return resolve(source, args, context, info);
      };

      // Return updated field configuration with authorization wrapper applied.
      return fieldConfig;

      // *************** END: Apply authentication and authorization middleware ***************
    },
  });
};

// *************** EXPORT MODULE ***************
// Export directive transformer and GraphQL type definitions for schema configuration.
export { authDirectiveTransformer, typeDefs };
