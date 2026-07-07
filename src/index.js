// *************** IMPORT LIBRARY ***************
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express, { json } from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';

// *************** IMPORT MODULE ***************
import { authDirectiveTransformer, typeDefs as authDirectiveTypeDefs } from './shared/directives/auth.directive.js';
import { AuthMiddleware } from './shared/middlewares/auth.middleware.js';
import { authResolvers, authTypeDefs, studentResolver, studentTypeDefs } from './features/users/index.js';
import { ConnectDB } from './core/db.js';
import { CreateAcademicYearLoader } from './loader/academic_year.loader.js';
import { curriculumResolvers, curriculumTypeDefs, enrollmentResolvers, enrollmentTypeDefs } from './features/academic/index.js';
import { DateScalar } from './shared/graphql/scalar.date.js';
import { port } from './core/config.js';
import { systemResolvers, systemTypeDefs } from './features/system/index.js';
import { typeDefs as dateTypeDefs } from './shared/graphql/scalar.date.typedef.js';

// *************** GLOBAL VARIABLES ***************
// Express application instance used to register middleware and expose HTTP endpoints
const app = express();

/**
 * Orchestrates systemic asynchronous application bootstrap phases including storage layer hydration and network exposure.
 * Initializes the database connection, starts the GraphQL server,
 * registers middleware, and begins listening for incoming requests.
 * @returns {Promise<void>} Resolves once the database cluster and GraphQL transport layers achieve full operational readiness
 */
const init = async () => {
  // *************** START: Initialize database connection ***************
  await ConnectDB();
  // *************** END: Initialize database connection ***************

  const schema = makeExecutableSchema({
    typeDefs: [
      authDirectiveTypeDefs,
      authTypeDefs,
      curriculumTypeDefs,
      dateTypeDefs,
      enrollmentTypeDefs,
      studentTypeDefs,
      systemTypeDefs,
    ],
    resolvers: {
      Date: DateScalar,
      Mutation: {
        ...authResolvers.Mutation,
        ...curriculumResolvers.Mutation,
        ...enrollmentResolvers.Mutation,
        ...studentResolver.Mutation,
      },
      Query: {
        ...systemResolvers.Query,
        ...studentResolver.Query,
      },
      Student: {
        ...studentResolver.Student,
      },
    },
  });
  const authTransformedSchema = authDirectiveTransformer(schema, 'auth');

  // *************** START: Configure and start Apollo Server ***************
  const server = new ApolloServer({
    schema: authTransformedSchema,
  });
  await server.start();
  // *************** END: Configure and start Apollo Server ***************

  // *************** START: Register application middleware ***************
  app
    .use(cors())
    .use(json())
    .use(AuthMiddleware)
    .use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => {
          return {
            user: req.user,
            AcademicYearLoader: CreateAcademicYearLoader(),
          };
        },
      }),
    );
  // *************** END: Register application middleware ***************

  // *************** START: Expose HTTP server ***************
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  // *************** END: Expose HTTP server ***************
};

await init();
