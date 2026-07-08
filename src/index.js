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
import {
  curriculumResolvers,
  curriculumTypeDefs,
  enrollmentResolvers,
  enrollmentTypeDefs,
  gradingResolvers,
  gradingTypeDefs,
} from './features/academic/index.js';
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

  // *************** START: Build GraphQL executable schema ***************
  // Combine all feature type definitions and resolvers into a single GraphQL schema.
  const schema = makeExecutableSchema({
    // Register GraphQL type definitions from authentication, academic, user, and system modules.
    typeDefs: [
      authDirectiveTypeDefs,
      authTypeDefs,
      curriculumTypeDefs,
      dateTypeDefs,
      enrollmentTypeDefs,
      gradingTypeDefs,
      studentTypeDefs,
      systemTypeDefs,
    ],

    // Merge resolver implementations from each application module.
    resolvers: {
      // Register custom scalar resolver for date-related fields.
      Date: DateScalar,
      // Combine all mutation operations exposed by the GraphQL API.
      Mutation: {
        ...authResolvers.Mutation,
        ...curriculumResolvers.Mutation,
        ...enrollmentResolvers.Mutation,
        ...gradingResolvers.Mutation,
        ...studentResolver.Mutation,
      },
      // Combine all query operations exposed by the GraphQL API.
      Query: {
        ...systemResolvers.Query,
        ...studentResolver.Query,
      },
      // Register field-level resolvers for Student object type.
      Student: {
        ...studentResolver.Student,
      },
    },
  });
  // Apply authorization directive middleware to protected GraphQL fields.
  const authTransformedSchema = authDirectiveTransformer(schema, 'auth');
  // *************** END: Build GraphQL executable schema ***************

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
        // Build GraphQL execution context with authenticated user data and request-level loaders.
        context: ({ req }) => ({
          user: req.user,
          // Initialize DataLoader instance to optimize academic year data fetching.
          AcademicYearLoader: CreateAcademicYearLoader(),
        }),
      }),
    );
  // *************** END: Register application middleware ***************

  // *************** START: Expose HTTP server ***************
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  // *************** END: Expose HTTP server ***************
};

// *************** INITIALIZE APPLICATION ***************
await init();
