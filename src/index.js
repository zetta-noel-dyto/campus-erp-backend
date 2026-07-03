// *************** IMPORT LIBRARY ***************
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express, { json } from 'express';

// *************** IMPORT MODULE ***************
import { ConnectDB } from './core/db.js';
import {
    curriculumResolvers,
    curriculumTypeDefs,
    enrollmentResolvers,
    enrollmentTypeDefs
} from './features/academic/index.js';
import { DateScalar } from './shared/graphql/scalar.date.js';
import { port } from './core/config.js';
import { systemResolvers, systemTypeDefs } from './features/system/index.js';
import { studentResolver, studentTypeDefs } from './features/users/student/index.js';

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

    // *************** START: Configure and start Apollo Server ***************
    const server = new ApolloServer({
        typeDefs: [
            curriculumTypeDefs,
            enrollmentTypeDefs,
            studentTypeDefs,
            systemTypeDefs,
        ],
        resolvers: {
            Date: DateScalar,
            Mutation: {
                ...curriculumResolvers.Mutation,
                ...enrollmentResolvers.Mutation,
                ...studentResolver.Mutation,
            },
            Query: {
                ...systemResolvers.Query
            }
        }
    })
    await server.start();
    // *************** END: Configure and start Apollo Server ***************

    // *************** START: Register application middleware ***************
    app
        .use(cors())
        .use(json())
        .use('/graphql', expressMiddleware(server));
    // *************** END: Register application middleware ***************

    // *************** START: Expose HTTP server ***************
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    })
    // *************** END: Expose HTTP server ***************
}

await init();