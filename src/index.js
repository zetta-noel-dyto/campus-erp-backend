// *************** IMPORT LIBRARY ***************
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express, { json } from 'express';

// *************** IMPORT MODULE ***************
import { ConnectDB } from './core/db.js';
import { port } from './core/config.js';
import { curriculumResolvers, curriculumTypeDefs } from './features/system/academic/curriculum/index.js';
import { systemResolvers, systemTypeDefs } from './features/system/index.js';

// *************** GLOBAL VARIABLES ***************
const app = express();

/**
 * Orchestrates systemic asynchronous application bootstrap phases including storage layer hydration and network exposure.
 * 
 * @returns {Promise<void>} Resolves once the database cluster and GraphQL transport layers achieve full operational readiness
 */
const init = async () => {
    await ConnectDB();

    const server = new ApolloServer({
        typeDefs: [systemTypeDefs, curriculumTypeDefs],
        resolvers: [systemResolvers, curriculumResolvers]
    })
    await server.start();

    app
        .use(cors())
        .use(json())
        .use('/graphql', expressMiddleware(server))

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    })
}

await init();