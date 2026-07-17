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
import { DateScalar } from './shared/graphql/date.graphql.scalar.js';
import { HandleApiError } from './core/error.js';
import { InitializeGradeAuditorJob } from './jobs/missing_grades.job.js';
import { InitializePDFService } from './shared/services/pdf.service.js';
import { port } from './core/config.js';
import { router as gradingRestRouter } from './features/academic/grading/grading.rest.router.js';
import { systemResolvers, systemTypeDefs } from './features/system/index.js';
import { typeDefs as dateTypeDefs } from './shared/graphql/date.graphql.typedef.js';

// *************** GLOBAL VARIABLES ***************
const app = express();

/**
 * Orchestrates systemic asynchronous application bootstrap phases including storage layer hydration and network exposure.
 * Initializes the database connection, starts application services, starts the GraphQL server,
 * registers middleware, and begins listening for incoming requests.
 * @returns {Promise<void>} Resolves once the database cluster and application transport layers achieve full operational readiness.
 */
const init = async () => {
  // *************** START: Initialize application dependencies ***************
  await ConnectDB();
  await InitializePDFService();
  InitializeGradeAuditorJob();
  // *************** END: Initialize application dependencies ***************

  // *************** START: Build GraphQL executable schema ***************
  const schema = makeExecutableSchema({
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
    resolvers: {
      Date: DateScalar,
      Mutation: {
        ...authResolvers.Mutation,
        ...curriculumResolvers.Mutation,
        ...enrollmentResolvers.Mutation,
        ...gradingResolvers.Mutation,
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
    .use('/api/academics', gradingRestRouter)
    .use(
      '/graphql',
      expressMiddleware(server, {
        context: ({ req }) => ({
          user: req.user,
          AcademicYearLoader: CreateAcademicYearLoader(),
        }),
      }),
    )
    .use((err, req, res, next) => {
      HandleApiError(res, err);
    });
  // *************** END: Register application middleware ***************

  // *************** START: Expose HTTP server ***************
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  // *************** END: Expose HTTP server ***************
};

// *************** INITIALIZE APPLICATION ***************
await init();
