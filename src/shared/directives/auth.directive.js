// *************** IMPORT LIBRARY ***************
import { defaultFieldResolver, GraphQLError } from 'graphql'
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'

// *************** TYPE DEFINITIONS ***************
const typeDefs = `#graphql 
directive @auth(requires: Role = admin) on FIELD_DEFINITION

enum Role {
   admin
   teacher 
}
`

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
      const authDirective = getDirective(schema, fieldConfig, directiveName)
      if (!authDirective) return fieldConfig
      const { requires } = authDirective[0]
      const resolve = fieldConfig.resolve || defaultFieldResolver
      // *************** END: Retrieve auth directive configuration ***************

      // *************** START: Apply authentication and authorization middleware ***************
      fieldConfig.resolve = async (source, args, context, info) => {
        // *************** Validate user authentication state ***************
        if (!context.user) {
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              status: 401
            }
          })
        }

        // *************** Validate user role permission ***************
        const hasPermission = (() => {
          const role = context.user.role
          if (requires === 'admin') return role === 'admin'
          if (requires === 'teacher') return role === 'teacher'

          return false
        })()
        if (!hasPermission) {
          throw new GraphQLError('Forbidden', {
            extensions: {
              code: 'FORBIDDEN',
              status: 403
            }
          })
        }

        return resolve(source, args, context, info)
      }

      return fieldConfig
      // *************** END: Apply authentication and authorization middleware ***************
    }
  })
}

// *************** EXPORT MODULE ***************
export { authDirectiveTransformer, typeDefs }
