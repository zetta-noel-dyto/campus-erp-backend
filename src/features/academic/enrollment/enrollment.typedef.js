const typeDefs = `#graphql
scalar Date

type AcademicYear {
    name: String!
    start_date: Date!
    end_date: Date!
    status: String!
    block_ids: [ID!]!
    student_ids: [ID!]!
}

input EnrollStudentInput {
    academic_year_id: ID!
    student_ids: [ID!]!
}

type Mutation {
    EnrollStudentsToYear(input: EnrollStudentInput!): AcademicYear!
}
`

export {
    typeDefs
}