// *************** GLOBAL VARIABLES ***************
// GraphQL schema definition for student domain including types, scalars, and mutations
const typeDefs = `#graphql
# *************** OBJECT TYPES ***************
type Student {
    first_name: String!
    last_name: String!
    email: String!
    student_number: String!
    registration_date: Date!
}

# *************** INPUT TYPES ***************
input CreateStudentInput {
    first_name: String!
    last_name: String!
    email: String!
    student_number: String!
}

# *************** MUTATIONS ***************
type Mutation {
    CreateStudent(input: CreateStudentInput!): Student!
}
`

// *************** EXPORT MODULE ***************
export {
    typeDefs
}