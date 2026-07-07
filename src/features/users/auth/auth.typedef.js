// *************** TYPE DEFINITIONS ***************
// GraphQL schema definitions for user authentication operations and user data structure.
const typeDefs = `#graphql
type User {
    _id: ID!
    email: String!
    role: String!
}

input LoginInput {
    email: String!
    password: String!
}

type Mutation {
    Login(input: LoginInput!): String!
}
`;

// *************** EXPORT MODULE ***************
export { typeDefs };
