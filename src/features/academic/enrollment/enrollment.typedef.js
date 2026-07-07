// *************** GLOBAL VARIABLES ***************
// GraphQL schema definition for AcademicYear domain including enrollment mutation
const typeDefs = `#graphql
# *************** OBJECT TYPES ***************
type AcademicYear {
    _id: ID!
    name: String!
    start_date: Date!
    end_date: Date!
    status: String!
    block_ids: [ID!]!
    student_ids: [ID!]!
}

# *************** INPUT TYPES ***************
input EnrollStudentInput {
    academic_year_id: ID!
    student_ids: [ID!]!
}

# *************** MUTATIONS ***************
type Mutation {
    EnrollStudentsToYear(input: EnrollStudentInput!): AcademicYear! @auth(requires: admin)
}
`;

// *************** EXPORT MODULE ***************
export { typeDefs };
