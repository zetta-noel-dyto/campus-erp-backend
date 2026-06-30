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
const app = express()

// *************** START: Infrastructure & Database Orchestration ***************

// Establish persistent connection to MongoDB cluster before processing network traffic
ConnectDB()

// Enforce standard security headers and resource sharing policies
app.use(cors())
// Parse incoming application/json payloads into request object context
app.use(json())

// *************** END: Infrastructure & Database Orchestration ***************

// *************** START: GraphQL Gateway Initialization ***************

// Inject foundational schema definitions and system orchestrators into Apollo Server instance
const server = new ApolloServer({
    typeDefs: systemTypeDefs,
    resolvers: systemResolvers
})
// Await async engine boot process before binding network transport layer middleware
await server.start()

// Bind standalone GraphQL orchestrator endpoint specifically to the designated HTTP path
app.use('/graphql', expressMiddleware(server))

// *************** END: GraphQL Gateway Initialization ***************

// *************** START: Server Listener Boot ***************

// Bind application listener to network port and expose infrastructure server runtime
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})
// *************** END: Server Listener Boot ***************