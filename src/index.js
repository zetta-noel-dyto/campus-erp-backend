// *************** IMPORT LIBRARY ***************
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express, { json } from 'express';

// *************** IMPORT MODULE ***************
import { ConnectDB } from './core/db.js';
import { port } from './core/config.js';
import { systemResolvers, systemTypeDefs } from './features/system/index.js';

// *************** GLOBAL VARIABLES ***************
// Instantiate Express application framework instance to host network middleware layers
const app = express();

/**
 * Orchestrates systemic asynchronous application bootstrap phases including storage layer hydration and network exposure.
 * 
 * @returns {Promise<void>} Resolves once the database cluster and GraphQL transport layers achieve full operational readiness
 */
const init = async () => {
    // *************** Enforce synchronous lifecycle startup blocking to guarantee database readiness before binding network ports
    await ConnectDB();

    // *************** START: GraphQL Gateway Initialization ***************

    // Inject foundational schema definitions and system orchestrators into Apollo Server instance
    const server = new ApolloServer({
        typeDefs: systemTypeDefs,
        resolvers: systemResolvers
    })
    // Await async engine boot process before binding network transport layer middleware
    await server.start();

    // *************** END: GraphQL Gateway Initialization ***************

    // *************** START: Infrastructure & Middleware Orchestration ***************

    app
        // Enforce standard security headers and resource sharing policies
        .use(cors())
        // Parse incoming application/json payloads into request object context
        .use(json())
        // Bind standalone GraphQL orchestrator endpoint specifically to the designated HTTP path
        .use('/graphql', expressMiddleware(server))

    // *************** END: Infrastructure & Middleware Orchestration ***************

    // *************** START: Server Listener Boot ***************

    // Bind application listener to network port and expose infrastructure server runtime
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    })

    // *************** END: Server Listener Boot ***************
}

// *************** START: Runtime Execution Trigger ***************

// Execute top-level async control sequence to anchor operational infrastructure state trees
await init();

// *************** END: Runtime Execution Trigger ***************