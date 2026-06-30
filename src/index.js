// Imported libraries
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express, { json } from "express";
// Imported function, resolver, variables
import { ConnectDB } from './core/db.js';
import { port } from './core/config.js';
import { systemResolvers, systemTypeDefs } from "./features/system/index.js";

// Initialize Express server
const app = express()

// Function to connect with MongoDB
ConnectDB()

app
    // Apply CORS
    .use(cors())
    // Apply JSON body parse
    .use(json())

// Initialize Apollo server with import type definition and resolver
const server = new ApolloServer({
    typeDefs: systemTypeDefs,
    resolvers: systemResolvers
})

// Start the Apollo server
await server.start()

// Configure the Apollo server as a middleware
app.use("/graphql", expressMiddleware(server))

// Start the Express server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})